const mongoose = require ('mongoose');
const { float } = require('webidl-conversions');

const SalarySchema = new mongoose.Schema(

    {  
        "ID":{
            type: Number,
            require: true
        },
        "Team":{
            type: String,
            require: true
        },
        "Number_of_WDs":{
            type: Number,
            require: true
        },
        "User_Code": {
            type: String,
            require: true
        },
        "Total_Salary":{
            type: Number,
            require: true
        },
        "Date_Update": {
            type: Date,
            require: true
        },
        "Updated_By":{
            type: String,
            require: true
        }

    }, {
        collection : 'Salary'
    }
);
const SalaryModel = mongoose.model("Salary", SalarySchema);
module.exports = SalaryModel;