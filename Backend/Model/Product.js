const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
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
    }
)
const ProductModel= mongoose.model("Product", ProductSchema)
module.exports = ProductModel;