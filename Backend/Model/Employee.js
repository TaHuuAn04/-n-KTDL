const mongoose = require ('mongoose');
const { float } = require('webidl-conversions');

const EmployeeSchema = new mongoose.Schema(

    {
        "First Name":{
            type: String,
            require: true
        },
        "Gender":{
            type: String,
            require: true
        },
        "Start Date":{
            type: String,
            require: true
        },
        "Last Login Time": {
            type: String
        },
        "Salary":{
            type: Number,
            require: true
        },
        "Bonus": Number,
        "Senior Management": Boolean,
        "Team": String,
        "branch": Number,
        "password":{
            type: String,
            require: true
        }

    }, {
        collection : 'employee'
    }
);
const EmployeeModel = mongoose.model("employee", EmployeeSchema);
module.exports = EmployeeModel;