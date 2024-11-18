

import mongoose from 'mongoose';

const uri = 'mongodb+srv://antaduychinh:abcxyz04@fashionshop.qdyue.mongodb.net/?retryWrites=true&w=majority&appName=Fashionshop';

const Product_Schema = new mongoose.Schema(
    {
        "SKU Code": { type: String, required: false },
        "Design No": { type: String, required: false },
        "Stock": { type: String, required: true },
        "stock in B1": { type: Number, required: false },
        "stock in B2": { type: Number, required: false },
        "stock in B3": { type: Number, required: false },
        "stock in B4": { type: Number, required: false },
        "Category": { type: String, required: true },
        "Name": { type: String, required: true },
        "Size": { type: String, required: false },
        "Color": { type: String, required: false },
        "SupplierID": { type: Number, required: true },
        "Supplier Code": { type: String, required: false },
        "Supplier": { type: String, required: false }
    },
    { collection: 'Product' } 
);

const Product = mongoose.model('Product', Product_Schema);

async function findAllProducts() {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000
        });
        console.log('Kết nối đến MongoDB Atlas thành công');

        const products = await Product.find({});
        console.log('Tất cả sản phẩm:', products);
    } catch (err) {
        console.error('Lỗi kết nối MongoDB Atlas:', err);
    }
}

findAllProducts();
