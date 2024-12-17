const express = require('express');
const router = express.Router();
const EmployeeModel = require('./Model/Employee');
// Cho phép tìm theo tên hoặc mã số nhân viên
// http://localhost:3000/employee/Find?keywords=Douglas
router.get('/Find', async (req, res) => {
    
    const { keywords } = req.query; // Lấy từ query parameters
    
    if (!keywords) {
        console.log('Query Parameters:', req.query);
        return res.status(400).json({ message: 'Từ khóa rỗng hoặc không hợp lệ' });
    }

    try {
        let employee = await EmployeeModel.findOne({ "User_Code": keywords });
        if (employee) {
            return res.status(200).json({
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
            });
        }
        else{
            employee = await EmployeeModel.findOne({"First Name": keywords });
            if (employee) {
                return res.status(200).json({
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
                });
            }
        }
        return res.status(404).json({ message: 'Không tìm thấy Employee!' });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
// Trả về tất cả nhân viên
//http://localhost:3000/employee/All?page=1&limit=9
router.get('/All', async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 9; 

        
        const startIndex = (page - 1) * limit;

        
        const employees = await EmployeeModel.find()
            .skip(startIndex) 
            .limit(limit); 

        
        const totalEmployees = await EmployeeModel.countDocuments();

        
        if (employees.length > 0) {
            return res.status(200).json({
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
            });
        }

        
        return res.status(404).json({ message: 'Không có nhân viên nào!' });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
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
