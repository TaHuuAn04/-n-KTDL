/* 1. Trả về danh sách nhân viên
   2. Cho phép tìm kiếm theo tên hoặc mã số nhân viên
   3. Lọc theo phòng ban, lương
   4. Thêm, sửa, xóa thông tin nhân viên
   5. Trả về thông tin 1 nhân viên
   6. Cập nhật lương nhân viên
   7. Trả về lịch sử cập nhật lương của nhân viên
   8. Update lương nhân viên theo phòng ban
*/

const express = require('express');
const router = express.Router();
const EmployeeModel = require('./Model/Employee');
const SalaryModel =require ('./Model/Salary');
const redisClient = require('./caching/redis');
const checkSeniorManagement = require('./Middleware/checkManager'); 
const SHA1 = require('./SHA/SHA1');
const jwt = require('jsonwebtoken');

// Trả về tất cả nhân viên
//http://localhost:3000/employee/All?page=1&limit=9
router.get('/All', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 9; 

        const cacheKey = `employees:page=${page}&limit=${limit}`;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss: Retrieving data from MongoDB');

        const startIndex = (page - 1) * limit;

        const employees = await EmployeeModel.find()
            .skip(startIndex)
            .limit(limit);

        const totalEmployees = await EmployeeModel.countDocuments();

        if (employees.length > 0) {
            const response = {
                message: 'Danh sách nhân viên:',
                currentPage: page,
                totalPages: Math.ceil(totalEmployees / limit),
                totalEmployees: totalEmployees,
                employees: employees.map(employee => ({
                    First_Name: employee["First Name"] || '',
                    Gender: employee["Gender"] || '',
                    Start_Date: employee["Start Date"] || '',
                    Salary: employee["Salary"] || 0,
                    Bonus: employee["Bonus"] || 0,
                    Senior_Management: employee["Senior Management"] || false,
                    Team: employee["Team"] || '',
                    branch: employee["branch"] || '',
                    Email: employee["Email"] || '',
                    User_Code: employee["User_Code"] || '',
                })),
            };

            await redisClient.setex(cacheKey, 3600, JSON.stringify(response));

            return res.status(200).json(response);
        }

        return res.status(404).json({ message: 'Không có nhân viên nào!' });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// Cho phép tìm theo tên hoặc mã số nhân viên
// http://localhost:3000/employee/Find?keywords=Douglas
router.get('/Find', async (req, res) => {
    const { keywords } = req.query;

    if (!keywords) {
        return res.status(400).json({ message: 'Từ khóa rỗng hoặc không hợp lệ' });
    }

    // Xác thực token và lấy thông tin người dùng (nếu có)
    const authHeader = req.headers.authorization;
    let user = null;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            user = decoded; // { id, username, role, manage, branch, Team }
        } catch (err) {
            console.error("Lỗi xác thực token:", err);
        }
    }

    // Kiểm tra quyền truy cập
    if (!user) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }

    let filter = {
        $or: [
            { "User_Code": { $regex: keywords, $options: 'i' } },
            { "First Name": { $regex: keywords, $options: 'i' } },
        ]
    };

    // Áp dụng filter bổ sung dựa trên role
    if (user.role === 'admin') {
        // Admin: không cần thêm filter
    } else if (user.manage) {
        // Manager: chỉ tìm nhân viên cùng branch và Team
        filter.branch = user.branch;
        filter.Team = user.Team;
    } else {
        // Không phải admin hay manager: không cho phép tìm kiếm
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }

    try {
        const cacheKey = `employee:find:${keywords}:${JSON.stringify(filter)}`;

        // Kiểm tra cache (nếu bạn muốn sử dụng cache)
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Retrieving data from MongoDB');

        // Tìm kiếm danh sách nhân viên thỏa điều kiện
        const employees = await EmployeeModel.find(filter);

        if (employees.length > 0) {
            const response = {
                message: 'Tìm thấy danh sách nhân viên!',
                totalEmployees: employees.length,
                employees: employees.map(employee => ({
                    First_Name: employee["First Name"] || '',
                    Gender: employee["Gender"] || '',
                    Start_Date: employee["Start Date"] || '',
                    Salary: employee["Salary"] || 0,
                    Bonus: employee["Bonus"] || 0,
                    Senior_Management: employee["Senior Management"] || false,
                    Team: employee["Team"] || '',
                    branch: employee["branch"] || '',
                    Email: employee["Email"] || '',
                    User_Code: employee["User_Code"] || '',
                })),
            };

            // Lưu kết quả vào cache (nếu bạn muốn sử dụng cache)
            // await redisClient.setex(cacheKey, 3600, JSON.stringify(response));

            return res.status(200).json(response);
        }

        return res.status(404).json({ message: 'Không tìm thấy nhân viên nào thỏa điều kiện!' });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

// Lọc theo phòng ban và sort theo lương 
// http://localhost:3000/employee/SortAndFilter?team=Sales&sortBySalary=asc&page=2&limit=5
router.get('/SortAndFilter', async (req, res) => {
    try {
        const { team,branch, sortBySalary, page = 1, limit = 10 } = req.query;

        // Giải mã token để lấy thông tin người dùng (nếu có)
        const authHeader = req.headers.authorization;
        let user = null;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                user = decoded;
            } catch (err) {
                console.error("Lỗi xác thực token:", err);
            }
        }

        let filter = {};
        let sort = {};

        // Phân quyền
        if (user && user.role === 'admin') {
            // Không thêm filter
        } else if (user && user.manage) {
            filter.branch = user.branch;
            filter.Team = user.Team;
        } else if (user) {
            filter.User_Code = user.username;
        } else {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
        }

        if (team) {
            filter.Team = team;
        }
        if (branch) {
            filter.branch = branch;
        }
        // Sắp xếp
        if (sortBySalary === 'asc') {
            sort.Salary = 1;
        } else if (sortBySalary === 'desc') {
            sort.Salary = -1;
        }

        // Tạo cache key
        const cacheKey = `SortAndFilter:${JSON.stringify(filter)}:${JSON.stringify(sort)}:page=${page}:limit=${limit}`;

        // Kiểm tra cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Cache hit");
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("Cache miss");

        // Lấy tổng số nhân viên thỏa mãn filter (trước khi phân trang)
        const totalEmployees = await EmployeeModel.countDocuments(filter);

        const employees = await EmployeeModel.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        if (employees.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên nào!' });
        }

        const result = {
            message: 'Danh sách nhân viên:',
            totalEmployees: totalEmployees,
            employees: employees.map(employee => ({
                First_Name: employee["First Name"] || '',
                Gender: employee["Gender"] || '',
                Start_Date: employee["Start Date"] || '',
                Salary: employee["Salary"] || 0,
                Bonus: employee["Bonus"] || 0,
                Senior_Management: employee["Senior Management"] || false,
                Team: employee["Team"] || '',
                branch: employee["branch"] || '',
                Email: employee["Email"] || '',
                User_Code: employee["User_Code"] || '',
            })),
        };

        // Lưu vào cache
        redisClient.setex(cacheKey, 3600, JSON.stringify(result)); // Lưu cache trong 1 giờ

        return res.status(200).json(result);

    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// Thêm nhân viên
// http://localhost:3000/employee/add
/* 
{
  "First_Name": "Huyentest_Add",
  "Gender": "Male",
  "Start_Date": "2024-12-24",
  "Salary": 5000,
  "Bonus": 500,
  "Senior_Management": false,
  "Team": "HR",
  "branch": 1,
  "Email": "john.doe@example.com",
  "User_Code": "admin",
  "Password" : "admin"
}

*/
router.post('/Add', checkSeniorManagement, async (req, res) => {
    try {
        // Lấy dữ liệu nhân viên từ body request
        const { First_Name, Gender, Start_Date, Salary, Bonus, Senior_Management, Team, branch, Email, User_Code, Password } = req.body;

        if (!First_Name || !Gender || !Start_Date || !Salary || !Email) {
            return res.status(400).json({ message: 'Thông tin nhân viên không đủ!' });
        }
        const newEmployee = new EmployeeModel({
            "First Name": First_Name,
            "Gender": Gender,
            "Start Date": Start_Date,
            "Salary": Salary,
            "Bonus": Bonus || 0, // Mặc định Bonus là 0
            "Senior Management": Senior_Management || false, // Mặc định là false
            "Team": Team || '', // để trống
            "branch": branch || '', // để trống
            "Email": Email,
            "User_Code": User_Code || '' , // để trống,
            "password" : SHA1(Password) || ''
        });

        const savedEmployee = await newEmployee.save();

        
        return res.status(201).json({
            message: 'Nhân viên đã được thêm thành công!',
            employee: {
                First_Name: savedEmployee["First Name"],
                Gender: savedEmployee["Gender"],
                Start_Date: savedEmployee["Start Date"],
                Salary: savedEmployee["Salary"],
                Bonus: savedEmployee["Bonus"],
                Senior_Management: savedEmployee["Senior Management"],
                Team: savedEmployee["Team"],
                branch: savedEmployee["branch"],
                Email: savedEmployee["Email"],
                User_Code: savedEmployee["User_Code"]
            }
        });

    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// Đếm số lượng nhân viên
// http://localhost:3000/employee/count
router.get('/count', async (req, res) => {
    try {
        const employeeCount = await EmployeeModel.countDocuments();

        res.status(200).json({
            message: 'Tổng số nhân viên',
            count: employeeCount
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// API xóa nhân viên
router.delete('/Delete/:User_Code', checkSeniorManagement, async (req, res) => {
    try {
        const { User_Code } = req.params; 

        if (!User_Code) {
            return res.status(400).json({ message: 'Vui lòng cung cấp User_Code!' });
        }

        
        const employee = await EmployeeModel.findOne({ "User_Code": User_Code });

        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên!' });
        }

        
        await EmployeeModel.deleteOne({ "User_Code": User_Code });

        return res.status(200).json({
            message: 'Nhân viên đã được xóa thành công!',
        });
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});


router.put('/Update/:User_Code', checkSeniorManagement, async (req, res) => {
    try {
        const { User_Code } = req.params; 
        const { First_Name, Gender, Salary, Bonus, Senior_Management, Team, branch, Email } = req.body;
        console.log("first name", First_Name);
        
        if (!User_Code) {
            return res.status(400).json({ message: 'Vui lòng cung cấp User_Code!' });
        }

        
        if (!First_Name && !Gender && !Salary && !Bonus && !Senior_Management && !Team && !branch && !Email) {
            return res.status(400).json({ message: 'Không có thông tin cần sửa!' });
        }

        
        const employee = await EmployeeModel.findOne({ "User_Code": User_Code });

        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên!' });
        }

        
        if (First_Name) employee["First Name"] = First_Name;
        if (Gender) employee.Gender = Gender;
        if (Salary) employee.Salary = Salary;
        if (Bonus) employee.Bonus = Bonus;
        if (Senior_Management !== undefined) employee["Senior Management"] = Senior_Management; // true/false
        if (Team) employee.Team = Team;
        if (branch) employee.branch = branch;
        if (Email) employee.Email = Email;

        
        const updatedEmployee = await employee.save();

        return res.status(200).json({
            message: 'Thông tin nhân viên đã được cập nhật thành công!',
            employee: {
                First_Name: updatedEmployee["First Name"],
                Gender: updatedEmployee.Gender,
                Salary: updatedEmployee.Salary,
                Bonus: updatedEmployee.Bonus,
                Senior_Management: updatedEmployee["Senior Management"],
                Team: updatedEmployee.Team,
                branch: updatedEmployee.branch,
                Email: updatedEmployee.Email,
                User_Code: updatedEmployee.User_Code
            }
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

// Trả về thông tin một nhân viên
// http://localhost:3000/employee/Information/MAR_0001
router.get('/Information/:user_code', async (req, res) => {
    const { user_code } = req.params;
    try {
        const employeeInfo = await EmployeeModel.findOne({ "User_Code": user_code });
        if (employeeInfo) {
            return res.status(200).json({
                message: 'Thông tin nhân viên',
                employee: {
                    First_Name: employeeInfo["First Name"] || '',
                    Gender: employeeInfo["Gender"] || '',
                    Start_Date: employeeInfo["Start Date"] || '',
                    Salary: employeeInfo["Salary"] || 0,
                    Bonus: employeeInfo["Bonus"] || 0,
                    Senior_Management: employeeInfo["Senior Management"] || false,
                    Team: employeeInfo["Team"] || '',
                    branch: employeeInfo["branch"] || '',
                    Email: employeeInfo["Email"] || '',
                    User_Code: employeeInfo["User_Code"] || '',
                }
            });
        } else {
            
            return res.status(404).json({ message: 'Không tìm thấy nhân viên này!' });
        }
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// http://localhost:3000/employee/SalaryHistory/CLI_0029
router.get('/SalaryHistory/:user_code', async (req, res) => {
    const { user_code } = req.params;

    try {
        const Salary = await SalaryModel.find({ "User_Code": user_code })
                                        .sort({ "Date_Update": -1 }); // Sắp xếp giảm dần theo Date_Update


        const result = {
            message: 'Lịch sử lương:',
            total: Salary.length,
            Salary_History: Salary.map(salary => ({
                Team: salary["Team"] || '',
                Number_of_WDs: salary["Number_of_WDs"] || 30,
                User_Code: salary["User_Code"] || '',
                Total_Salary: salary["Total_Salary"] || '',
                Date_Update: salary["Date_Update"] || '',
                Updated_By: salary["Updated_By"] || ''
            })),
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi trong quá trình truy vấn:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

router.post('/UpdateTeamSalary', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        let user = null;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                user = decoded;
            } catch (err) {
                console.error("Lỗi xác thực token:", err);
            }
        }

        let filter = {};
        if (user.role === 'admin') {
            // Admin: Cập nhật lương cho tất cả manager
            filter = { "Senior Management": true };
        } else if (user.manage) {
            // Manager: Cập nhật lương cho nhân viên thường cùng team và chi nhánh
            filter = {
                "Team": user.Team,
                "branch": user.branch,
                "Senior Management": false // Chỉ cập nhật cho nhân viên thường
            };
        } else {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
        }

        const teamMembers = await EmployeeModel.find(filter).lean().exec();

        if (teamMembers.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên phù hợp!' });
        }

        const currentDate = new Date();

        const salaryUpdates = teamMembers.map(async (member) => {
            const lastSalaryUpdate = await SalaryModel.findOne({ "User_Code": member.User_Code })
                .sort({ "Date_Update": -1 });

            let numberOfWDs = 30;
            if (lastSalaryUpdate && lastSalaryUpdate.Date_Update) {
                const lastUpdateDate = new Date(lastSalaryUpdate.Date_Update);
                if (!isNaN(lastUpdateDate)) {
                    numberOfWDs = Math.floor((currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24));
                }
            }

            const newSalary = new SalaryModel({
                ID: await SalaryModel.countDocuments() + 1,
                Team: member.Team,
                Number_of_WDs: numberOfWDs,
                User_Code: member.User_Code,
                Total_Salary: member.Salary + (member.Bonus * 100),
                Date_Update: currentDate,
                Updated_By: user.User_Code // Cập nhật bởi user hiện tại
            });

            await newSalary.save();
        });

        await Promise.all(salaryUpdates);

        const successMessage = user.role === 'admin'
            ? 'Cập nhật lương cho tất cả quản lý thành công!'
            : 'Cập nhật lương cho nhân viên trong team và chi nhánh thành công!';

        return res.status(200).json({ message: successMessage });

    } catch (error) {
        console.error('Lỗi trong quá trình cập nhật lương:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const totalEmployees = await EmployeeModel.countDocuments();

        const branchStats = await EmployeeModel.aggregate([
            {
                $group: {
                    _id: '$branch',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            total: totalEmployees,
            branches: branchStats
        });
    } catch (error) {
        console.error('Lỗi thống kê nhân viên:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
module.exports = router;
