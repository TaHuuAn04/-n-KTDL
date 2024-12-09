const mongoose = require ('mongoose');

const SaleSchema = new mongoose.Schema(
    {
        "Order ID":{
            type: String,
            require: true
        },
        "Cust ID":{
            type: Number,
            require: true
        },
        "Gender":{
            type: String,
            require: true
        },
        "Age": {
            type: Number,
            require: true
        },
        "Age Group": {
            type: String,
            require: true
        },
        "Date": {
            type: Date,
            require: true
        },
        "Month": {
            type: String,
            require:true
        },
        "Status": {
            type: String,
            require: true
        },
        "Channel": {
            "type": String,
            require: true
        },
        "SKU": {
            "type": String,
            require: true
        },
        "Category": {
            "type": String,
            require: true
        },
        "Size": {
            "type": String,
            require: true
        },
        "Qty" : {
            "type": Number,
            require: true
        },
        "currency": {
            "type": String,
            require: true
        },
        "Amount" : {
            "type": Number,
            require: true
        },
        "ship-city": {
            "type": String,
            require: true
        },
        "ship-state": {
            "type": String,
            require: true
        },
        "ship-postal-code" : {
            "type": Number,
            require: true
        },
        "ship-country": {
            "type": String,
            require: true
        },
        "B2B": {
            "type": Boolean,
            require: true
        }

    }, {collection: 'sale', timestamps: true}
);
const SaleModel = mongoose.model("sale", SaleSchema);
module.exports = SaleModel;