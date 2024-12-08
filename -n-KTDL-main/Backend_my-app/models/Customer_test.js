
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const Customer_testSchema = new mongoose.Schema(
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
        "City": {
            type: String,
            require: true
        },
        "Country": {
            type: String,
            require: true
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
        "Subscription Date": {
            type: String
        },
        "password": {
            type: String,
            require: true
        }

    }, { collection: 'customer_test' }
);
const Customer_testModel = mongoose.model("customer_test", Customer_testSchema);
export default Customer_testModel;