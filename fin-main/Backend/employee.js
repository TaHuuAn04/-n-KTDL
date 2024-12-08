const express = require('express');
const router = express.Router();
const EmployeeModel = require('./Model/Employee');

router.get('/Find', async (req, res) => {
    const { username } = req.query; // Lấy từ query parameters

    if (!username) {
        return res.status(400).json({ message: 'Từ khóa không hợp lệ!' });
    }

    try {
        const employee = await EmployeeModel.findOne({ "User_Code": username });
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
        return res.status(404).json({ message: 'Không tìm thấy Employee!' });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});

router.get('/All', async (req, res) => {
    try {
        //Lấy hết
        const employees = await EmployeeModel.find();

        // Kiểm tra xem có dữ liệu hay không
        if (employees.length > 0) {
            return res.status(200).json({
                message: 'Danh sách nhân viên:',
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


module.exports = router;
