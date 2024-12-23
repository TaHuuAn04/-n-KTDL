/* 1. Trả về danh sách nhân viên
   2. Cho phép tìm kiếm theo tên hoặc mã số nhân viên
   3. Lọc theo phòng ban, lương
   4. Thêm, sửa, xóa thông tin nhân viên
   5. Trả về thông tin 1 nhân viên
   6. Cập nhật lương nhân viên
*/

const express = require('express');
const router = express.Router();
const EmployeeModel = require('./Model/Employee');
const redisClient = require('./caching/redis');
const checkSeniorManagement = require('./Middleware/checkManager'); 


// Trả về tất cả nhân viên
//http://localhost:3000/employee/All?page=1&limit=9
router.get('/All', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 9; 

        const cacheKey = `employees:page=${page}&limit=${limit}`;

        // Kiểm tra xem kết quả đã có trong cache Redis chưa
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

            // Lưu kết quả vào Redis với thời gian cache là 1 giờ
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
    const { keywords } = req.query; // Lấy từ query parameters

    if (!keywords) {
        console.log('Query Parameters:', req.query);
        return res.status(400).json({ message: 'Từ khóa rỗng hoặc không hợp lệ' });
    }

    try {
        const cacheKey = `employee:find:${keywords}`;

        // Kiểm tra Redis cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss: Retrieving data from MongoDB');

        // Tìm kiếm trong MongoDB
        let employee = await EmployeeModel.findOne({ "User_Code": keywords });
        if (!employee) {
            employee = await EmployeeModel.findOne({ "First Name": keywords });
        }

        if (employee) {
            const response = {
                message: 'Tìm thấy employee!',
                user: {
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
                },
            };

            // Lưu kết quả vào Redis với thời gian cache là 1 giờ
            await redisClient.setex(cacheKey, 3600, JSON.stringify(response));

            return res.status(200).json(response);
        }

        return res.status(404).json({ message: 'Không tìm thấy Employee!' });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// Lọc theo phòng ban và sort theo lương 
// http://localhost:3000/employee/SortAndFilter?team=Sales&sortBySalary=asc&page=2&limit=5
router.get('/SortAndFilter', async (req, res) => {
    try {
        const { team, sortBySalary, page = 1, limit = 10 } = req.query;

        // Tạo bộ lọc
        let filter = {};
        if (team) {
            filter.Team = team; // Lọc theo phòng ban (Team)
        }

        // Xác định sắp xếp theo lương
        let sort = {};
        if (sortBySalary === 'asc') {
            sort.Salary = 1; // Tăng dần
        } else if (sortBySalary === 'desc') {
            sort.Salary = -1; // Giảm dần
        }

        // Tạo một key duy nhất cho cache dựa trên các tham số
        const cacheKey = `employees:${JSON.stringify(filter)}:${JSON.stringify(sort)}:${page}:${limit}`;

        // Kiểm tra trong Redis cache
        redisClient.get(cacheKey, async (err, data) => {
            if (err) throw err;

            if (data) {
                // Nếu có dữ liệu trong cache, trả về ngay
                return res.status(200).json(JSON.parse(data));
            } else {
                // Nếu không có trong cache, truy vấn MongoDB
                const employees = await EmployeeModel.find(filter)
                    .sort(sort)
                    .skip((page - 1) * limit) // Tính toán skip cho phân trang
                    .limit(parseInt(limit));

                if (employees.length === 0) {
                    return res.status(404).json({ message: 'Không tìm thấy nhân viên nào!' });
                }

                // Lưu dữ liệu vào cache
                const result = {
                    message: 'Danh sách nhân viên:',
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

                // Lưu vào Redis cache với thời gian hết hạn 1 giờgiờ
                redisClient.setex(cacheKey, 3600, JSON.stringify(result));

                // Trả kết quả
                return res.status(200).json(result);
            }
        });
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
  "User_Code": "00001"
}

*/
router.post('/Add', checkSeniorManagement, async (req, res) => {
    try {
        // Lấy dữ liệu nhân viên từ body request
        const { First_Name, Gender, Start_Date, Salary, Bonus, Senior_Management, Team, branch, Email, User_Code } = req.body;
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
            "User_Code": User_Code || '' // để trống
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

// API xóa nhân viên
router.delete('/Delete/:User_Code', checkSeniorManagement, async (req, res) => {
    try {
        const { User_Code } = req.params; // Lấy User_Code từ URL params

        if (!User_Code) {
            return res.status(400).json({ message: 'Vui lòng cung cấp User_Code!' });
        }

        // Tìm nhân viên theo User_Code
        const employee = await EmployeeModel.findOne({ "User_Code": User_Code });

        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên!' });
        }

        // Xóa nhân viên
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


module.exports = router;
