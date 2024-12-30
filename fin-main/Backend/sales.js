const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SaleModel = require('./Model/Sale');
const ProductModel = require('./Model/Product');
const redisClient = require('./caching/redis');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
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

router.patch('/update/:orderID', async (req, res) => {
    try {
        const orderID = req.params.orderID;
        console.log("orderID", orderID);

        // Lấy thông tin đơn hàng cũ từ database
        const oldSale = await SaleModel.findOne({ 'Order ID': orderID });

        // Lấy các trường từ req.body và validate
        const {
            'Cust ID': custID,
            SKU,
            Qty,
            Amount,
            Status,
            Date,
            'ship-city': shipCity,
            'ship-state': shipState,
            'ship-postal-code': shipPostalCode,
            'ship-country': shipCountry
        } = req.body;

        const updatedData = {};

        // Validate và cập nhật các trường
        if (custID) updatedData['Cust ID'] = custID;
        if (SKU) updatedData.SKU = SKU;

        if (Qty) {
            if (typeof Qty !== 'number' || Qty < 0) {
                return res.status(400).json({ message: "Qty phải là số nguyên dương!" });
            }
            updatedData.Qty = Qty;
        }

        if (Amount) {
            if (typeof Amount !== 'number' || Amount < 0) {
                return res.status(400).json({ message: "Amount phải là số dương!" });
            }
            updatedData.Amount = Amount;
        }

        if (Status) updatedData.Status = Status;

        if (Date) {
            const dateObject = dayjs(Date, 'DD/MM/YYYY');
            if (!dateObject.isValid()) {
                return res.status(400).json({ message: "Ngày không hợp lệ, sử dụng định dạng DD/MM/YYYY" });
            }
            updatedData.Date = dateObject.toDate();
        }

        if (shipCity) updatedData['ship-city'] = shipCity;
        if (shipState) updatedData['ship-state'] = shipState;

        if (shipPostalCode) {
            const postalCodeNumber = parseInt(shipPostalCode, 10);
            if (isNaN(postalCodeNumber)) {
                return res.status(400).json({ message: "'ship-postal-code' phải là số hợp lệ!" });
            }
            updatedData['ship-postal-code'] = postalCodeNumber;
        }

        if (shipCountry) updatedData['ship-country'] = shipCountry;

        // Kiểm tra xem có trường nào được cập nhật không
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'Không có thông tin cần cập nhật!' });
        }

        // Tìm và cập nhật đơn hàng
        const updatedSale = await SaleModel.findOneAndUpdate(
            { 'Order ID': orderID },
            updatedData,
            {
                new: true,
                runValidators: true
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
        console.error("Lỗi cập nhật đơn hàng:", err);

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            return res.status(400).json({ message: message });
        }

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
            'Order ID': sale['Order ID'], // Giữ nguyên Order ID
            'Cust ID': sale['Cust ID'],
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

        const oldStatus = order.Status; // Lưu lại trạng thái cũ
        const orderDate = order.Date;

        // Chỉ xử lý khi chuyển từ Pending sang Processing
        if (order.Status === 'Pending') {
            order.Status = 'Processing';

            // Lấy thông tin sản phẩm từ đơn hàng (giả sử đơn hàng chỉ có 1 sản phẩm)
            const skuCode = order.SKU; // SKU Code của sản phẩm
            const quantityToSubtract = order.Qty; // Số lượng cần trừ

            // Tìm sản phẩm cần cập nhật
            const product = await ProductModel.findOne({ 'SKU Code': skuCode });

            if (!product) {
                return res.status(404).json({ message: `Product with SKU Code ${skuCode} not found` });
            }

            // Trừ tồn kho theo thứ tự ưu tiên B1 -> B2 -> B3 -> B4
            let remainingQuantity = quantityToSubtract;

            const branches = ['stock in B1', 'stock in B2', 'stock in B3', 'stock in B4'];
            for (const branch of branches) {
                if (remainingQuantity <= 0) break; // Đã trừ đủ, thoát vòng lặp

                const currentStock = product[branch];
                if (currentStock > 0) {
                    const subtractAmount = Math.min(remainingQuantity, currentStock);
                    product[branch] -= subtractAmount;
                    remainingQuantity -= subtractAmount;
                }
            }

            // Kiểm tra xem đã trừ đủ số lượng cần thiết chưa
            if (remainingQuantity > 0) {
                return res.status(400).json({ message: `Not enough stock for product ${skuCode}` });
            }

            // Cập nhật tổng tồn kho (Stock)
            product.Stock = product['stock in B1'] + product['stock in B2'] + product['stock in B3'] + product['stock in B4'];

            // Lưu thay đổi vào database
            await product.save();
            await order.save();

            // Xóa cache liên quan
            const keysToDelete = [];
            keysToDelete.push(`sale:${orderID}`);
            keysToDelete.push(...(await redisClient.keys('sale:*')));
            keysToDelete.push(...(await redisClient.keys('filter:*')));
            keysToDelete.push(`product:${skuCode}`); // Xóa cache của sản phẩm liên quan

            if (keysToDelete.length > 0) {
                await redisClient.del(keysToDelete);
            }

            return res.status(200).json({ message: 'Order status updated successfully', order });
        } else {
            // Nếu trạng thái hiện tại không phải là 'Pending', chỉ cập nhật trạng thái đơn hàng
            switch (order.Status) {
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

            const updatedOrder = await order.save();

            // Xóa cache liên quan
            const keysToDelete = [];
            keysToDelete.push(`sale:${orderID}`);
            keysToDelete.push(...(await redisClient.keys('sale:*')));
            keysToDelete.push(...(await redisClient.keys('filter:*')));

            // Xóa cache doanh thu theo tháng (nếu là Delivered -> Cancelled)
            if (oldStatus === 'Delivered' && order.Status === 'Cancelled') {
                const year = new Date(orderDate).getFullYear();
                keysToDelete.push(`monthly-revenue:${year}`);
            }

            if (keysToDelete.length > 0) {
                await redisClient.del(keysToDelete);
            }

            return res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
        }
    } catch (error) {
        console.error('Error:', error);
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
// API tính doanh thu theo tháng (12 tháng gần nhất)
router.get('/monthly-revenue', async (req, res) => {
    try {
        const selectedYear = parseInt(req.query.year);

        if (!selectedYear) {
            return res.status(400).json({ message: 'Vui lòng chọn năm!' });
        }

        // Tạo cache key dựa trên năm được chọn
        const cacheKey = `monthly-revenue:${selectedYear}`;

        // Kiểm tra cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss');

        const months = [];
        for (let i = 0; i < 12; i++) {
            months.push(dayjs(`${selectedYear}-${i + 1}`).format('YYYY-MM'));
        }

        const revenueData = [];
        for (const month of months) {
            const startOfMonth = dayjs(month).startOf('month').toDate();
            const endOfMonth = dayjs(month).endOf('month').toDate();

            const result = await SaleModel.aggregate([
                {
                    $match: {
                        Date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$Amount' }
                    }
                }
            ]);

            revenueData.push({
                month: dayjs(month).format('MM/YYYY'),
                revenue: result.length > 0 ? result[0].revenue : 0
            });
        }

        // Lưu kết quả vào cache
        redisClient.setex(cacheKey, 3600, JSON.stringify(revenueData)); // Cache trong 1 giờ (3600 giây)

        res.status(200).json(revenueData);
    } catch (error) {
        console.error('Lỗi tính toán doanh thu:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
module.exports = router;