const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = require('./Model/Product');  
const checkCache = require('./caching/cacheMiddleware');
const redisClient = require('./caching/redis');
const checkAdmin = require('./middleware/checkAdmin');
const SaleModel = require('./Model/Sale');
//Trả về toàn bộ sản phẩm
router.get('/all', checkCache('products'), async (req, res) => {
  try {
    console.log("Get all products");
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Truy vấn MongoDB để lấy sản phẩm
    const products = await ProductModel.find().skip(skip).limit(limit);

    if (products.length === 0) {
      return res.status(200).json({ message: 'Chưa có sản phẩm nào trong cửa hàng' });
    }

    // Lưu kết quả vào Redis cache
    const cacheKey = `products:${page}:${limit}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Cache hit');
        return res.json(JSON.parse(cachedData));  // Trả kết quả từ cache
    }
    else {
      console.log("Cache miss: Product retrieved from MongoDB");
    }

    redisClient.setex(cacheKey, 3600, JSON.stringify({
      message: 'Lấy danh sách sản phẩm thành công',
      products: products,
      page: page,
      limit: limit
    })); // Lưu cache trong 1 giờ (3600 giây)

    res.json({
      message: 'Lấy danh sách sản phẩm thành công',
      products: products,
      page: page,
      limit: limit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Tạo 1 sản phẩm mới
router.post('/add', checkAdmin, async (req, res) => {
    try {
        console.log("Add new product!!");
        const productData = req.body;
        const newProduct = new ProductModel(productData);
        console.log("newProduct", newProduct);
        await newProduct.save();

        // Xóa cache liên quan đến sản phẩm
        const keysToDelete = await redisClient.keys('products:*');
        const filterKeyToDelete = await redisClient.keys('filter:*');
        if (keysToDelete.length > 0) {
            await redisClient.del(keysToDelete);
        }
        if (filterKeyToDelete.length > 0) {
            await redisClient.del(filterKeyToDelete);
        }

        res.status(201).json({
            message: 'Thêm sản phẩm mới thành công',
            product: newProduct
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi xảy ra khi thêm sản phẩm', error: err.message });
    }
});

//Xóa 1 sản phẩm
router.delete('/delete/:id', checkAdmin, async (req, res) => {
    try {
        console.log("Delete product", req.params.id);
        const productId = req.params.id;
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Xóa cache liên quan đến sản phẩm
        const keysToDelete = await redisClient.keys('products:*');
        const productCacheKey = `product:${deletedProduct['SKU Code']}`; // Key của sản phẩm bị xóa
        const filterKeyToDelete = await redisClient.keys('filter:*');
        if (keysToDelete.length > 0) {
            await redisClient.del(keysToDelete);
        }
        await redisClient.del(productCacheKey); // Xóa cache của sản phẩm bị xóa
        if (filterKeyToDelete.length > 0) {
            await redisClient.del(filterKeyToDelete);
        }

        res.status(200).json({
            message: 'Xóa thành công!',
            product: deletedProduct
        });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xóa', error: err.message });
    }
});

// Chỉnh sửa 1 sản phẩm
router.patch('/update/:id', checkAdmin, async (req, res) => {
    try {
        console.log("Update product:", req.body);
        const productId = req.params.id;
        const updatedData = req.body;
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedData, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        // Xóa cache liên quan đến sản phẩm
        const keysToDelete = await redisClient.keys('products:*');
        const productCacheKey = `product:${updatedProduct['SKU Code']}`; // Key của sản phẩm bị chỉnh sửa
        const filterKeyToDelete = await redisClient.keys('filter:*');
        if (keysToDelete.length > 0) {
            await redisClient.del(keysToDelete);
        }
        await redisClient.del(productCacheKey); // Xóa cache của sản phẩm bị chỉnh sửa
        if (filterKeyToDelete.length > 0) {
            await redisClient.del(filterKeyToDelete);
        }

        res.status(200).json({
            message: 'Chỉnh sửa thành công!',
            product: updatedProduct
        });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật!', error: err.message });
    }
});

// Tìm kiếm 1 sản phẩm
router.get('/id/:skuCode', async (req, res) => {
  try {
    console.log("skuCode", req.params.skuCode);
    const skuCode = req.params.skuCode;

    // Tạo cache key duy nhất cho mỗi skuCode
    const cacheKey = `product:${skuCode}`;

    // Kiểm tra xem dữ liệu có trong cache Redis không
    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      console.log('Cache hit: Product found in Redis');
      return res.status(200).json({
        message: 'Tìm kiếm thành công (from cache)',
        product: JSON.parse(cachedProduct)  // Trả về dữ liệu từ cache
      });
    }

    // Nếu không có trong cache, truy vấn MongoDB
    const product = await ProductModel.findOne({ 'SKU Code': skuCode });

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }

    // Lưu kết quả vào Redis cache với thời gian hết hạn (TTL), ví dụ 1 giờ (3600 giây)
    await redisClient.setex(cacheKey, 3600, JSON.stringify(product));

    console.log('Cache miss: Product retrieved from MongoDB');
    res.status(200).json({
      message: 'Tìm kiếm thành công',
      product: product
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
  }
});

router.get('/count', async (req, res) => {
  try {
    const filter = {};

    const { category, supplierID, priceMin, priceMax } = req.query;
    if (category) {
      filter.Category = category;
    }
    if (supplierID) {
      filter.SupplierID = supplierID;
    }
    if (priceMin) {
      filter.Price = { $gte: parseFloat(priceMin) };
    }
    if (priceMax) {
      if (filter.Price) {
        filter.Price.$lte = parseFloat(priceMax);
      } else {
        filter.Price = { $lte: parseFloat(priceMax) };
      }
    }

    const count = await ProductModel.countDocuments(filter);

    res.status(200).json({
      message: 'Lấy số lượng sản phẩm thành công!',
      count: count
    });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
  }
});

router.get('/filter', async (req, res) => {
  try {
      let { page, limit, category, supplierID, priceMin, priceMax, sortBy } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const skip = (page - 1) * limit;
      let filter = {};
      console.log("Get  products type");
      console.log("Category: ", category);
      console.log("SupplierID: ", supplierID);
      console.log("SortBy: ", sortBy);

      if (category) {
          filter.Category = category;
      }
      if (supplierID) {
          filter.SupplierID = supplierID;
      }
      if (priceMin || priceMax) {
          filter.Price = {};
          if (priceMin) filter.Price.$gte = parseFloat(priceMin);
          if (priceMax) filter.Price.$lte = parseFloat(priceMax);
      }

      // Xác định tham số sort theo ngày hoặc giá, mặc định là sắp xếp theo ngày thêm vào (tăng dần)
      let sort = {};
      if (sortBy) {
          if (sortBy === 'price_asc') {
              sort.Price = 1;
          } else if (sortBy === 'price_desc') {
              sort.Price = -1;
          } else if (sortBy === 'date_asc') {
              sort.timestamps = 1;
          } else if (sortBy === 'date_desc') {
              sort.timestamps = -1;
          }
      } else {
          sort.timestamps = 1;
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
        console.log("Cache miss: Product retrieved from MongoDB");
      }

      // Nếu không có cache, truy vấn MongoDB
      const products = await ProductModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort(sort);

      if (products.length === 0) {
          return res.status(200).json({ message: 'Chưa có sản phẩm nào trong cửa hàng' });
      }

      // Lưu kết quả vào Redis
      redisClient.setex(cacheKey, 3600, JSON.stringify({
          message: 'Lấy danh sách sản phẩm thành công',
          products: products,
          page: page,
          limit: limit
      }));  // Lưu cache trong 1 giờ (3600 giây)

      res.json({
          message: 'Lấy danh sách sản phẩm thành công',
          products: products,
          page: page,
          limit: limit
      });

  } catch (err) {
      res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
  }
});
router.get('/stats', async (req, res) => {
    try {
        // Tính tổng số lượng sản phẩm hiện có
        const totalStock = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $add: ["$stock in B1", "$stock in B2", "$stock in B3", "$stock in B4"]
                        }
                    }
                }
            }
        ]);
        const totalSold = await SaleModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$Qty' }
                }
            }
        ]);

        res.status(200).json({
            totalStock: totalStock.length > 0 ? totalStock[0].total : 0,
            totalSold: totalSold.length > 0 ? totalSold[0].total : 0
        });
    } catch (error) {
        console.error('Lỗi thống kê sản phẩm:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});
module.exports = router;  