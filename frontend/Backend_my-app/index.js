import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import CustomerModel from "./models/Customer.js";
import ProductModel from "./models/Product.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
    "mongodb+srv://antaduychinh:abcxyz04@fashionshop.qdyue.mongodb.net/fashion?retryWrites=true&w=majority&appName=Fashionshop"
);


app.get('/getCus', (req, res) => {
    CustomerModel.find()
    .then(customer => res.json(customer))
    .catch(err => res.json(err))
}) 

app.get('/getProduct', (req, res) => {
    ProductModel.find()
    .then(product => res.json(product))
    .catch(err => res.json(err))
}) 

app.get('/getProduct_Name', (req, res) => {
    ProductModel.aggregate([
        {
            $group: {
                _id: {
                    Name: "$Name",
                    Category: "$Category"
                }
            }
        },
        {
            $project: {
                _id: 0,
                Name: "$_id.Name",
                Category: "$_id.Category"
            }
        }
    ])
    .then(productName => res.json(productName))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("Server is running");
});