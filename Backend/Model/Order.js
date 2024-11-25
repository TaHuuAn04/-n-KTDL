const { Double } = require('bson')
const mongoose = require ('mongoose')

const OrderSchema = new mongoose.Schema({
        "Order ID":{
            type: String,
            require: true
        },
        "Cust ID":{type: Number, require: true},
        "Gender":{type: String},
        "Age":{type: Number},
        "Age Group":{type: String},
        "Date":{type: String, require: true},
        "Month":{type: String, require: true},
        "Status":{type: String, require: true},
        "Channel":{type: String},
        "SKU":{type: String, require: true},
        "Category":{type: String},
        "Size":{type: String, require: true},
        "Qty":{type: Number, require: true},
        "currency":{type: String},
        "Amount":{type: Number, require: true},
        "ship-city": {type: String},
        "ship-state":{type: String},
        "ship-postal-code":{type: Number},
        "ship-country":{type: String},
        "B2B": Boolean
    }, {
        collection : 'sale'
    }
);
const OrderModel = mongoose.model("sale", OrderSchema);
module.exports = OrderModel;