const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(
            'mongodb+srv://vooconghau2604:ngoisao999hihi@testdata.yzlvf.mongodb.net/?retryWrites=true&w=majority&appName=TestData');
        console.log('MongoDB Connected');
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;