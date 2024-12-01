const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = require('./Model/Product');  

//Trả về toàn bộ sản phẩm
router.get('/all', async (req, res) => {
    try {
      console.log("Get all products");
      let { page, limit } = req.query;
      page = parseInt(page) || 1;  
      limit = parseInt(limit) || 10;  
      const skip = (page - 1) * limit;
      const products = await ProductModel.find()
        .skip(skip)       
        .limit(limit);    
      if (products.length === 0) {
        return res.status(200).json({ message: 'Chưa có sản phẩm nào trong cửa hàng' });
      }
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
router.post('/add', async (req, res) => {
    try {
      console.log("Add new product!!");
      const productData = req.body;
      const newProduct = new ProductModel(productData);
      console.log("newProduct", newProduct);
      await newProduct.save();
      res.status(201).json({
        message: 'Thêm sản phẩm mới thành công',
        product: newProduct
      });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi xảy ra khi thêm sản phẩm', error: err.message });
    }
});

//Xóa 1 sản phẩm
router.delete('delete/:id', async (req, res) => {
    try {
      const productId = req.params.id; 
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' }); 
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
router.patch('/update/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedData, {
        new: true, 
        runValidators: true 
      });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại!' }); 
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
router.get('/id/:skuCode', async (req, res) => { // Thay đổi :id thành :skuCode
  try {
    console.log("skuCode", req.params.skuCode);
    const skuCode = req.params.skuCode; // Lấy skuCode từ params

    // Tìm kiếm sản phẩm theo trường 'SKU Code'
    const product = await ProductModel.findOne({ 'SKU Code': skuCode });

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }
    res.status(200).json({
      message: 'Tìm kiếm thành công',
      product: product
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
      console.log("SupplierID ", supplierID);
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

      const products = await ProductModel.find(filter)
        .skip(skip)        
        .limit(limit)      
        .sort(sort);      
      if (products.length === 0) {
        return res.status(200).json({ message: 'Chưa có sản phẩm nào trong cửa hàng' });
      }
      res.json({
        message: 'Lấy danh sách sản phẩm thành công!',
        products: products,
        page: page,
        limit: limit
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
  
  

module.exports = router;  