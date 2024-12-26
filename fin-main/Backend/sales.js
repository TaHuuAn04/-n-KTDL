const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SaleModel = require('./Model/Sale');
const dayjs = require('dayjs');

// Trả về toàn bộ lịch sử Sales
router.get('/all', async (req, res) => {
    try {
        console.log("Get all sales");
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Truy vấn MongoDB để lấy sản phẩm
        const sales = await SaleModel.find().skip(skip).limit(limit);

        if (sales.length === 0) {
            return res.status(200).json({ message: 'Chưa có lịch sử bán hàng nào trong cửa hàng' });
        }

        res.json({
            message: 'Lấy danh sách bán hàng thành công',
            sales: sales,
            page: page,
            limit: limit
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa dựa theo ID
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log("Delete sales", req.params.id);
        const productId = req.params.id;
        // Giả sử bạn muốn xóa Sale dựa trên productId (thay thế logic phù hợp)
        const deletedSale = await SaleModel.findOneAndDelete({ 'SKU': productId }); // Tìm và xóa Sale dựa trên SKU liên quan

        if (!deletedSale) {
            return res.status(404).json({ message: 'Lịch sử bán hàng không tồn tại' });
        }

        res.status(200).json({
            message: 'Xóa thành công!',
            sale: deletedSale
        });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xóa', error: err.message });
    }
});

//Tìm kiếm 1 lịch sử mua hàng dựa trên id
router.get('/find/:orderID', async (req, res) => {
    try {
        const orderID = req.params.orderID;

        // Truy vấn MongoDB
        const sale = await SaleModel.findOne({ 'Order ID': orderID });
        if (!sale) {
            return res.status(404).json({ message: 'Lịch sử bán hàng không tồn tại!' });
        }

        res.status(200).json({
            message: 'Tìm kiếm thành công',
            sale: sale
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
    }
});

//API sửa dựa trên id của lịch sử tìm kiếm
router.patch('/update/:orderID', async (req, res) => {
    try {
        console.log("Update sale:", req.body);
        const orderID = req.params.orderID;
        const updatedData = req.body;
        const updatedSale = await SaleModel.findOneAndUpdate(
            { 'Order ID': orderID },    // Tìm theo saleId
            updatedData,            // Cập nhật với updatedData
            {
                new: true,            // Trả về đối tượng đã cập nhật
                runValidators: true   // Chạy validation trước khi lưu
            }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: 'Lịch sử mua hàng không tồn tại!' });
        }
        res.status(200).json({
            message: 'Chỉnh sửa thành công!',
            sale: updatedSale
        });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật!', error: err.message });
    }
});

// Thêm lịch sử bán hàng
router.post('/add', async (req, res) => {
    try {
        console.log("Add new sale!!");
        const saleData = req.body;
        const newSale = new SaleModel(saleData);
        console.log("newSale", newSale);
        await newSale.save();
        res.status(201).json({
            message: 'Thêm lịch sử bán hàng thành công',
            sale: newSale
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi xảy ra khi thêm lịch sử bán hàng', error: err.message });
    }
});

// Filter dựa trên id khách, khoảng thời gian, khoản tiền của đơn, sortBy, bổ sung trạng thái, có phân trang
router.get('/filter', async (req, res) => {
    try {
        let { page, limit, custID, priceMax, status, priceMin, fromDate, toDate, sortBy, orderId } = req.query;
        console.log("req", req.query);
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;
        let filter = {};

        if (custID) {
            filter['Cust ID'] = custID;
        }
        if (fromDate || toDate) {
            filter.Date = {}; // Sửa createdAt thành Date
            if (fromDate) filter.Date.$gte = new Date(fromDate);
            if (toDate) filter.Date.$lte = new Date(toDate);
        }

        if (priceMin || priceMax) {
            filter.Amount = {};
            if (priceMin) filter.Amount.$gte = parseFloat(priceMin);
            if (priceMax) filter.Amount.$lte = parseFloat(priceMax);
        }

        // status: Pending, Processing, Delivering, Delivered, Cancelled
        if (status) {
            filter.Status = status;
        }
        if (orderId) {
            filter["Order ID"] = { $regex: orderId, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }
        // Xác định tham số sort theo ngày hoặc giá, mặc định là sắp xếp theo ngày thêm vào (tăng dần)
        let sort = {};
        if (sortBy) {
            if (sortBy === 'price_asc') {
                sort.Amount = 1;
            } else if (sortBy === 'price_desc') {
                sort.Amount = -1;
            } else if (sortBy === 'date_asc') {
                sort.Date = 1; // Sửa lại thành Date
            } else if (sortBy === 'date_desc') {
                sort.Date = -1; // Sửa lại thành Date
            }
        } else {
            sort.Amount = 1;
        }

        // Truy vấn MongoDB
        const sales = await SaleModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort);

        // Lấy tổng số đơn hàng (không phân trang) để tính totalPages
        const totalOrders = await SaleModel.countDocuments(filter);

        if (sales.length === 0) {
            return res.status(200).json({
                message: 'Chưa có lịch sử bán hàng thỏa mãn điều kiện',
                totalOrders: 0,
                sale: [],
            });
        }

        // Format lại dữ liệu sales trước khi trả về
        const formattedSales = sales.map((sale, index) => ({
            stt: (page - 1) * limit + index + 1, // Tính stt dựa trên page và limit
            'Order ID': sale['Order ID'], // Giữ nguyên Order ID
            CustID: sale['Cust ID'],
            Date: dayjs(sale.Date).format('DD/MM/YYYY'), // Format Date
            'ship-city': sale['ship-city'],
            'ship-state': sale['ship-state'],
            'ship-country': sale['ship-country'],
            SKU: sale.SKU,
            Qty: sale.Qty,
            'ship-postal-code': sale['ship-postal-code'],
            Amount: sale.Amount,
            Status: sale.Status,
            // Thêm các trường khác nếu cần
        }));

        res.json({
            message: 'Lấy danh sách lịch sử bán hàng thành công',
            totalOrders: totalOrders, // Trả về tổng số đơn hàng
            sale: formattedSales, // Trả về mảng formattedSales
            page: page,
            limit: limit,
        });

    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
    }
});
// API đếm số lượng đơn hàng theo trạng thái
router.get('/count', async (req, res) => {
    try {
        const { status, orderId } = req.query;
        let filter = {};


        // Lọc theo trạng thái (status) nếu được cung cấp
        if (status) {
            filter.Status = status;
        }

        // Lọc theo orderId (nếu cần)
        if (orderId) {
            filter["Order ID"] = { $regex: orderId, $options: 'i' };
        }

        // Đếm số lượng đơn hàng thỏa mãn điều kiện filter
        const totalOrders = await SaleModel.countDocuments(filter);

        res.status(200).json({ totalOrders });
    } catch (error) {
        console.error('Error counting orders:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
// Đổi trạng thái của đơn
router.patch('/changeStatus/:orderID', async (req, res) => {
    const { orderID } = req.params;
    try {
        // Tìm đơn hàng theo orderID
        const order = await SaleModel.findOne({ 'Order ID': orderID });

        if (!order) {
            return res.status(404).json({ message: 'Not found' });
        }

        // Kiểm tra trạng thái hiện tại và chuyển sang trạng thái tiếp theo
        switch (order.Status) {
            case 'Pending':
                order.Status = 'Processing';
                break;
            case 'Processing':
                order.Status = 'Delivering';
                break;
            case 'Delivering':
                order.Status = 'Delivered';
                break;
            case 'Delivered':
                order.Status = 'Cancelled';
                break;
            case 'Cancelled':
                order.Status = 'Pending';
                break;
            default:
                return res.status(400).json({ message: 'Invalid order status transition' });
        }
        await order.save();
        return res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
// API hủy đơn hàng
router.patch('/cancelSale/:orderID', async (req, res) => {
    const { orderID } = req.params;
    // Kiểm tra quyền của user (ví dụ: chỉ admin hoặc nhân viên được hủy đơn)

    try {
        // Tìm đơn hàng theo orderID (sử dụng trường Order ID của bạn)
        const order = await SaleModel.findOne({ 'Order ID': orderID });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Kiểm tra trạng thái hiện tại của đơn hàng (nếu cần)
        if (order.Status === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel a delivered order' });
        }

        // Cập nhật trạng thái thành Cancelled
        order.Status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;