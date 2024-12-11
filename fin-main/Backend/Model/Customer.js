const mongoose = require('mongoose')
const CustomerSchema = new mongoose.Schema(
    {
        "Cust ID": {
            type: Number,
            require: true,
        },
        "First Name": {
            type: String,
            require: true
        },
        "Last Name": {
            type: String,
            require: true
        },
        "Company": {
            type: String
        },
        "Phone 1": {
            type: String,
            require: true
        },
        "Phone 2": {
            type: String
        },
        "Email": {
            type: String,
            require: true
        },
        "Subcription Date": {
            type: String
        },
        "password": {
            type: String,
            require: true
        },
        "Sex": {
            type: String
        },
        "Age": {
            type: Number
        },

    }, { collection: 'customer' }
);
const CustomerModel = mongoose.model("customer", CustomerSchema);
module.exports = CustomerModel;