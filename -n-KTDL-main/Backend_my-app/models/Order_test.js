import { Double } from 'bson';
import mongoose from 'mongoose';

const Order_testSchema = new mongoose.Schema({
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
        collection : 'sale_test'
    }
);
const OrderModel_test = mongoose.model("sale_test", Order_testSchema);
export default OrderModel_test;