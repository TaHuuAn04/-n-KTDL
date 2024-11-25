
const mongoose = require ('mongoose')

const BranchSchema = new mongoose.Schema(

    {
        "Branch": { type: Number, require: true},
        "Time opened": String,
        "Time closed": String,
        "NumEmploy": {
            type: Number,
            require: true
        },
        "Location": String


    }, {
        collection : 'branch'
    }
);
const BranchModel = mongoose.model("branch", BranchSchema);
module.exports = BranchModel;