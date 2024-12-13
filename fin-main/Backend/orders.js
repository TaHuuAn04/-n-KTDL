const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SalesModel = require('./Model/Sale');
const ProductModel = require('./Model/Product');
const verifyToken = require('./middleware/verifyToken');
const redisClient = require('./caching/redis');

// Customer tạo 1 đơn hàng mới
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { SKU, Qty, Channel, ship_city, ship_state, ship_postal_code, ship_country, B2B } = req.body;
        const status = 'Pending';
        const currency = 'INR';
        const product = await ProductModel.findOne({ "SKU Code": SKU });
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        const Size = product.Size;
        const Category = product.Category;
        const Amount = product.Price * Qty;
        const custID = req.user.custID;
        const orderCount = await SalesModel.countDocuments();
        const orderID = `${orderCount + 1}-${custID}`;
        const newOrder = new SalesModel({
            "Order ID": orderID,
            "Cust ID": custID,
            "Status": status,
            "SKU": SKU,
            "Qty": Qty,
            "Amount": Amount,
            "Size": Size,
            "Category": Category,
            "Channel": Channel,
            "Currency": currency,
            "Ship City": ship_city,
            "Ship State": ship_state,
            "Ship Postal Code": ship_postal_code,
            "Ship Country": ship_country,
            "B2B": B2B,
            "Date": new Date(),
        });
        await newOrder.save();
        return res.status(201).json({
            message: 'Đơn hàng đã được tạo thành công',
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau' });
    }
});

// Customer xóa 1 đơn hàng (chỉ có thể xóa nếu đơn hàng đang ở trạng thái Pending)
router.delete('/delete/:orderID', verifyToken, async (req, res) => {
    const { orderID } = req.params;  // Lấy orderID từ URL
    try {
        const order = await SalesModel.findOne({ "Order ID": orderID });
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }
        if (order.Status !== 'Pending') {
            return res.status(400).json({ message: 'Chỉ có thể xóa đơn hàng có trạng thái Pending' });
        }
        await SalesModel.deleteOne({ "Order ID": orderID });
        return res.status(200).json({ message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server, không thể xóa đơn hàng' });
    }
});

// Lấy tất cả đơn hàng của customer đó theo điều kiện. Nếu bỏ trống các trường ==> get all
router.get('/filter', verifyToken, async (req, res) => {
    try {
        let { page, limit, priceMax, priceMin, fromDate, toDate, sortBy } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;
        let filter = {};

        const custID = req.user.custID;
        filter['Cust ID'] = custID;

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);  // Chuyển fromDate thành đối tượng Date
            if (toDate) filter.createdAt.$lte = new Date(toDate);  // Chuyển toDate thành đối tượng Date
        }
        
        if (priceMin || priceMax) {
            filter.Amount = {};
            if (priceMin) filter.Amount.$gte = parseFloat(priceMin);
            if (priceMax) filter.Amount.$lte = parseFloat(priceMax);
        }
  
        // Xác định tham số sort theo ngày hoặc giá, mặc định là sắp xếp theo ngày thêm vào (tăng dần)
        let sort = {};
        if (sortBy) {
            if (sortBy === 'price_asc') {
                sort.Amount = 1;
            } else if (sortBy === 'price_desc') {
                sort.Amount = -1;
            } else if (sortBy === 'date_asc') {
                sort.timestamps = 1;
            } else if (sortBy === 'date_desc') {
                sort.timestamps = -1;
            }
        } else {
            sort.Amount = 1;
        }
  
        // Tạo khóa cache cho kết quả lọc
        const cacheKey = `filter:${JSON.stringify(req.query)}`;
  
        // Kiểm tra cache Redis
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.json(JSON.parse(cachedData));  // Trả kết quả từ cache
        }
        else {
          console.log("Cache miss: Sales retrieved from MongoDB");
        }
  
        // Nếu không có cache, truy vấn MongoDB
        const sales = await SalesModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort);
  
        if (sales.length === 0) {
            return res.status(200).json({ message: 'Chưa có lịch sử mua hàng thỏa mãn điều kiện' });
        }
  
        // Lưu kết quả vào Redis
        redisClient.setex(cacheKey, 3600, JSON.stringify({
            message: 'Lấy danh sách lịch sử mua hàng thành công',
            sale: sales,
            page: page,
            limit: limit
        }));  // Lưu cache trong 1 giờ (3600 giây)
  
        res.json({
            message: 'Lấy danh sách lịch sử mua hàng thành công',
            sale: sales,
            page: page,
            limit: limit
        });
  
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
    }
});

// Chỉnh sửa. Chỉ được chỉnh sửa đơn hàng nếu trạng thái là Pending
router.patch('/update/orderID/:orderID', verifyToken, async (req, res) => {
    try {
        const orderID = req.params.orderID; 
        const updatedData = req.body;        
        const checkOrder = await SalesModel.findOne({ "Order ID": orderID });
        if (!checkOrder) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
        }

        if (checkOrder.Status !== 'Pending') {
            return res.status(400).json({ message: 'Đơn hàng chỉ được sửa ở trạng thái Pending!' });
        }
        const updatedOrder = await SalesModel.findOneAndUpdate(
            { "Order ID": orderID },  
            updatedData,              
            { new: true, runValidators: true }  
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Không thể cập nhật đơn hàng!' });
        }
        res.status(200).json({
            message: 'Chỉnh sửa thành công!',
            order: updatedOrder
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật!' });
    }
});


//003308-5307602
//31050-5307602



module.exports = router;  
