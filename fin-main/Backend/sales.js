const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SaleModel = require('./Model/Sale');  
const checkCache = require('./caching/cacheMiddleware');
const redisClient = require('./caching/redis');

// Trả về toàn bộ lịch sử Sales
router.get('/all', checkCache('sale'), async (req, res) => {
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
  
      // Lưu kết quả vào Redis cache
      const cacheKey = `sale:${page}:${limit}`;
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('Cache hit');
          return res.json(JSON.parse(cachedData));  // Trả kết quả từ cache
      }
      else {
        console.log("Cache miss: Sales retrieved from MongoDB");
      }
  
      redisClient.setex(cacheKey, 3600, JSON.stringify({
        message: 'Lấy danh sách bán hàng thành công',
        sales: sales,
        page: page,
        limit: limit
      })); // Lưu cache trong 1 giờ (3600 giây)
  
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
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Lịch sử bán hàng không tồn tại' }); 
      }
      res.status(200).json({
        message: 'Xóa thành công!',
        product: deletedProduct
      });
    } catch (err) {
      res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xóa', error: err.message });
    }
});

//Tìm kiếm 1 lịch sử mua hàng dựa trên id
router.get('/find/:id', async (req, res) => {
    try {
      console.log("id", req.params.id);
      const id = req.params.id;
      const cacheKey = `sale:${id}`;
      const cachedSale = await redisClient.get(cacheKey);
      if (cachedSale) {
        console.log('Cache hit: Sale found in Redis');
        return res.status(200).json({
          message: 'Tìm kiếm thành công (from cache)',
          sale: JSON.parse(cachedSale)  // Trả về dữ liệu từ cache
        });
      }
      // Nếu không có trong cache, truy vấn MongoDB
      const sale = await SaleModel.findOne({ '_id': id });
      if (!sale) {
        return res.status(404).json({ message: 'Lịch sử bán hàng không tồn tại!' });
      }
      // Lưu kết quả vào Redis cache với thời gian hết hạn (TTL), ví dụ 1 giờ (3600 giây)
      await redisClient.setex(cacheKey, 3600, JSON.stringify(sale));
  
      console.log('Cache miss: Sale retrieved from MongoDB');
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
router.patch('/update/:id', async (req, res) => {
    try {
      console.log("Update sale:", req.body);
      const saleId = req.params.id;
      const updatedData = req.body;
      const updatedSale = await SaleModel.findByIdAndUpdate(saleId, updatedData, {
        new: true, 
        runValidators: true 
      });
  
      if (!updatedSale) {
        return res.status(404).json({ message: 'Lịch sử mua hàng không tồn tại!' }); 
      }
      res.status(200).json({
        message: 'Chỉnh sửa thành công!',
        sale: SaleModel
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

// Filter dựa trên id khách, khoảng thời gian, khoản tiền của đơn, sortBy, có phân trang 
router.get('/filter', async (req, res) => {
    try {
        let { page, limit, custID, priceMax, priceMin, fromDate, toDate, sortBy } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;
        let filter = {};
  
        if (custID) {
            filter['Cust ID'] = custID;
        }

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
        const sales = await SaleModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort);
  
        if (sales.length === 0) {
            return res.status(200).json({ message: 'Chưa có lịch sử bán hàng thỏa mãn điều kiện' });
        }
  
        // Lưu kết quả vào Redis
        redisClient.setex(cacheKey, 3600, JSON.stringify({
            message: 'Lấy danh sách lịch sử bán hàng thành công',
            sale: sales,
            page: page,
            limit: limit
        }));  // Lưu cache trong 1 giờ (3600 giây)
  
        res.json({
            message: 'Lấy danh sách lịch sử bán hàng thành công',
            sale: sales,
            page: page,
            limit: limit
        });
  
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
    }
});



module.exports = router;  