const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json());
const ProductModel = require ('./Model/Product')
mongoose.connect("mongodb+srv://antaduychinh:abcxyz04@fashionshop.qdyue.mongodb.net/fashion?retryWrites=true&w=majority&appName=Fashionshop")


app.get("/getProduct", (req, res)=>{
    ProductModel.find({}).then(function(Product){
        res.json(Product)
    }).catch(function(err){
        res.json(err)
    })

})
app.listen(3001, ()=> {
    console.log("Connect successfully!");
})
