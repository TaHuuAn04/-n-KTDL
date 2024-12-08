import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import CustomerModel from "./models/Customer.js";
import ProductModel from "./models/Product.js";
import OrderModel from "./models/Order.js";
import Customer_testModel from "./models/Customer_test.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import OrderModel_test from "./models/Order_test.js";

const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();



mongoose.connect(
    "mongodb+srv://antaduychinh:abcxyz04@fashionshop.qdyue.mongodb.net/fashion?retryWrites=true&w=majority&appName=Fashionshop"
);


app.get('/getCustomer', (req, res) => {
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

app.get('/getCategory_Name', (req, res) => {
    ProductModel.aggregate([
        {
            $group: {
                _id: {
                    // Name: "$Name",
                    Category: "$Category"
                }
            }
        },
        {
            $project: {
                _id: 0,
                // Name: "$_id.Name",
                Category: "$_id.Category"
            }
        }
    ])
    .then(productName => res.json(productName))
    .catch(err => res.json(err))
})

app.get('/getstatus', (req, res) => {
    OrderModel.aggregate([
        {
            $group: {
                _id: {
                    // Name: "$Name",
                    Status: "$Status"
                }
            }
        },
        {
            $project: {
                _id: 0,
                // Name: "$_id.Name",
                Status: "$_id.Status"
            }
        }
    ])
    .then(productName => res.json(productName))
    .catch(err => res.json(err))
})


// app.get('/getOrder-test', (req, res) => {
//     OrderModel.aggregate([
//         {
//             // Nhóm theo Cust ID
//             $group: {
//                 _id: "$Cust ID",  // Nhóm theo Cust ID 
//                 orders: { $push: "$Order ID" } 
//             }
//         },
//         {
//             // Chọn các trường cần thiết
//             $project: {
//                 _id: 0,  // Ẩn _id mặc định
//                 "Cust ID": "$_id",  // Đổi tên _id thành CustID
//                 orders: 1  // Giữ lại danh sách sản phẩm của mỗi CustID
//             }
//         }
//     ])
//     .then(productName => res.json(productName))
//     .catch(err => res.json(err))
// })


// app.get('/getOrder', (req, res) => {
//     OrderModel.aggregate([
//         {
//             $group: {
//                 _id: {
//                     // Name: "$Name",
//                     Category: "$Category"
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 // Name: "$_id.Name",
//                 Category: "$_id.Category"
//             }
//         }
//     ])
//     .then(productName => res.json(productName))
//     .catch(err => res.json(err))
// })

app.get('/getProductsByName', async (req, res) => {
    try {
      const productName = req.query.Name;
      const products = await ProductModel.find({ Name: productName });
      res.json(products);
    } catch (err) {
      res.status(500).send(err);
    }
});



app.post("/Create_Account", (req, res) => {
    Customer_testModel.create(req.body)
    .then(customer_test => res.json(customer_test))
    .catch(err => res.json(err));
});


app.get("/getCustomer_MaxCustID", async (req, res) => {
    try {
        const MaxCustID = await CustomerModel.findOne({})
        .sort({"Cust ID": -1}) // Sắp theo thứ tự giảm dần
        .limit(1); //Lấy 1 kết quả

        res.status(200).json(MaxCustID);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

app.post('/check-email', async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra xem email có tồn tại trong database không
        const user = await CustomerModel.findOne({ Email: email }); 
        if (user) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        } else {
            return res.status(200).json({ message: "Email chưa tồn tại" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});




// app.post('/login-test', async (req, res) => {
//     const { Email, password } = req.body;

//     if (!Email || !password) {
//         return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu!' });
//     }

//     try {
//         // Kiểm tra trong model Employee (Admin)
//         // const admin = await EmployeeModel.findOne({ _id: username });

//         // if (admin) {
//         //     if (admin.password !== password) {
//         //         return res.status(401).json({ message: 'Sai mật khẩu!' });
//         //     }
//         //     return res.status(200).json({
//         //         message: 'Đăng nhập thành công!',
//         //         user: {
//         //             username: admin._id,
//         //             name: admin["First Name"],
//         //             role: 'admin'
//         //         },
//         //         isAdmin: true,
//         //     });
//         // }

//         // Nếu không phải Admin, kiểm tra trong model Customer
//         const customer = await CustomerModel.findOne({ "Email": Email });

//         if (customer) {
//             if (customer.password !== password) {
//                 return res.status(401).json({ message: 'Sai mật khẩu!' });
//             }
//             return res.status(200).json({
//                 message: 'Đăng nhập thành công!',
//                 user: {
//                     username: customer["Cust ID"],
//                     name: `${customer["First Name"]} ${customer["Last Name"]}`,
//                     role: 'customer'
//                 },
//                 // isAdmin: false,
//             });
//         }

//         // Nếu không tìm thấy cả trong Employee lẫn Customer
//         return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
//     } catch (error) {
//         console.error('Lỗi trong quá trình đăng nhập:', error);
//         return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
//     }
// });

// app.post("/login", async (req, res) => {
//     const {Email, password} = req.body;
//     const user = await CustomerModel.findOne({"Email": Email})
//     .then(user => {
//         if(user) {
//             if(user.password === password) {
//                 res.status(200).json( { message: "Đăng nhập thành công!"})
//             }
//             else {
                
//                 return res.status(401).json({ message: "Sai mật khẩu!"});
//             }
//         }
//         else {
//             return res.status(404).json({ message: "Tài khoản không tồn tại!"});
//         }
//     })
// });


app.post('/login-test', async (req, res) => {
    const { Email, password } = req.body;

    if (!Email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu!' });
    }

    try {
        // Tìm khách hàng theo Email
        const customer = await CustomerModel.findOne({ "Email": Email }).exec();

        if (customer) {
            // So sánh mật khẩu nhập vào với mật khẩu lưu trong cơ sở dữ liệu
            if (password !== customer.password) {
                return res.status(401).json({ message: 'Sai mật khẩu!' });
            }

            return res.status(200).json({
                message: 'Đăng nhập thành công!',
                user: {
                    custID: customer["Cust ID"],
                    name: `${customer["First Name"]} ${customer["Last Name"]}`,
                    firstName: customer["First Name"],
                    lastName: customer["Last Name"],
                    company: customer["Company"],
                    city: customer["City"],
                    country: customer["Country"],
                    phone1: customer["Phone 1"],
                    phone2: customer["Phone 2"],
                    email: customer["Email"],
                    subdate: customer["Subscription Date"],


                }
            });
        }

        return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trên server!' });
    }
});



app.get('/getProductBySKU', async (req, res) => {
    try {
        const sku = req.query.sku;
        console.log('SKU:', sku); // Log SKU

        const product = await ProductModel.findOne({ "SKU Code": sku });
        console.log('Product:', product); // Log Product
        res.json(product);
    } catch (err) {
        console.error('Error:', err); // Log Error
        res.status(500).send(err);
    }
});

app.get('/getOrder_Delivered', async (req, res) => {
    try {
        const custId = req.query.custId;

        const deliveredOrders = await OrderModel.aggregate([
            {
                $match: {
                    "Cust ID": parseInt(custId),
                    "Status": "Delivered"
                }
            },
            {
                $group: {
                    _id: "$Order ID",
                    orders: {
                        $push: {
                            SKU: "$SKU",
                            Category: "$Category",
                            Size: "$Size",
                            Qty: "$Qty",
                            Amount: "$Amount",
                            Date: "$Date",
                            ship_city: "$ship-city"
                        }
                    }
                }
            }
        ]);

        res.json(deliveredOrders);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
});


app.get('/getOrder_Returned', async (req, res) => {
    try {
        const custId = req.query.custId;

        const deliveredOrders = await OrderModel.aggregate([
            {
                $match: {
                    "Cust ID": parseInt(custId),
                    "Status": "Returned"
                }
            },
            {
                $group: {
                    _id: "$Order ID",
                    orders: {
                        $push: {
                            SKU: "$SKU",
                            Category: "$Category",
                            Size: "$Size",
                            Qty: "$Qty",
                            Amount: "$Amount",
                            Date: "$Date",
                            ship_city: "$ship-city"
                        }
                    }
                }
            }
        ]);

        res.json(deliveredOrders);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
});


app.get('/getOrder_Refunded', async (req, res) => {
    try {
        const custId = req.query.custId;

        const deliveredOrders = await OrderModel.aggregate([
            {
                $match: {
                    "Cust ID": parseInt(custId),
                    "Status": "Refunded"
                }
            },
            {
                $group: {
                    _id: "$Order ID",
                    orders: {
                        $push: {
                            SKU: "$SKU",
                            Category: "$Category",
                            Size: "$Size",
                            Qty: "$Qty",
                            Amount: "$Amount",
                            Date: "$Date",
                            ship_city: "$ship-city"
                        }
                    }
                }
            }
        ]);

        res.json(deliveredOrders);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
});


app.get('/getOrder_Cancelled', async (req, res) => {
    try {
        const custId = req.query.custId;

        const deliveredOrders = await OrderModel.aggregate([
            {
                $match: {
                    "Cust ID": parseInt(custId),
                    "Status": "Cancelled"
                }
            },
            {
                $group: {
                    _id: "$Order ID",
                    orders: {
                        $push: {
                            SKU: "$SKU",
                            Category: "$Category",
                            Size: "$Size",
                            Qty: "$Qty",
                            Amount: "$Amount",
                            Date: "$Date",
                            ship_city: "$ship-city"
                        }
                    }
                }
            }
        ]);

        res.json(deliveredOrders);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
});


app.get('/getOrder_Delivering', async (req, res) => {
    try {
        const custId = req.query.custId;

        const deliveredOrders = await OrderModel.aggregate([
            {
                $match: {
                    "Cust ID": parseInt(custId),
                    "Status": "Delivering"
                }
            },
            {
                $group: {
                    _id: "$Order ID",
                    orders: {
                        $push: {
                            SKU: "$SKU",
                            Category: "$Category",
                            Size: "$Size",
                            Qty: "$Qty",
                            Amount: "$Amount",
                            Date: "$Date",
                            ship_city: "$ship-city"
                        }
                    }
                }
            }
        ]);

        res.json(deliveredOrders);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
});


app.post('/orders-test', (req, res) => {
    const { cart } = req.body;

    // Lưu từng sản phẩm trong giỏ hàng vào database
    cart.forEach(item => {
        const order = new Order({
            orderId: generateOrderId(), // Hàm tạo Order ID
            productId: item._id,
            quantity: item.quantity,
            // Các thông tin khác như userId, date, etc.
        });

        order.save()
            .then(() => console.log('Order saved:', order))
            .catch(err => console.error('Error saving order:', err));
    });

    res.status(200).send('Order saved');
});


app.post('/purchase', async (req, res) => {
    try {
        const cart = req.body.cart;
        // Save each item in the cart to the database
        for (const item of cart) {
            await OrderModel.create(item);
        }
        res.status(200).send('Purchase successful');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Purchase failed');
    }
});


app.post('/saveOrder', async (req, res) => {
    try {
        const { products, totalAmount, user } = req.body;

        // Tạo Order mới
        const newOrder = new OrderModel({
            user: user,
            products: products,
            totalAmount: totalAmount,
            date: new Date(),
        });

        // Lưu vào MongoDB
        await newOrder.save();
        res.status(200).send({ message: 'Order saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to save order' });
    }
});


const cartSchema = new mongoose.Schema({
    items: [
        {
            id: String,
            name: String,
            price: Number,
            quantity: Number,
        }
    ],
    total: Number,
    date: { type: Date, default: Date.now }
});


const Cart = mongoose.model('Cart', cartSchema);

app.post('/api/cart', async (req, res) => {
    const { items, total } = req.body;
    const newCart = new Cart({ items, total });
    await newCart.save();
    res.status(201).send(newCart);
});


// app.post("/Order_Sale", (req, res) => {
//     OrderModel_test.create(req.body)
//     .then(order_test => res.json(order_test))
//     .catch(err => res.json(err));
// });

app.post('/Order_Sale', (req, res) => {
    const newOrder = new OrderModel_test(req.body);
    newOrder.save()
        .then(order => res.status(201).send(order))
        .catch(err => res.status(400).send(err));
});


app.post('/api/checkout', async (req, res) => {
    const cartItems = req.body.cart;
  
    try {
      const savedItems = await OrderModel_test.insertMany(cartItems);
      res.status(200).json({ message: 'Cart items saved successfully!', data: savedItems });
    } catch (error) {
      res.status(500).json({ message: 'Error saving cart items', error: error.message });
    }
  });


app.get("/getShip_Postal_Code_MAX", async (req, res) => {
    try {
        const MaxCustID = await OrderModel.findOne({})
        .sort({"ship-postal-code": -1}) // Sắp theo thứ tự giảm dần
        .limit(1); //Lấy 1 kết quả

        res.status(200).json(MaxCustID);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});


router.put('/update-password/:custID', async (req, res) => {
    const { custID } = req.params;
    const { newPassword } = req.body;  // Lấy mật khẩu mới từ request body

    try {
        // Tìm người dùng theo Cust ID
        const user = await CustomerModel.findOne({ "Cust ID": custID });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cập nhật mật khẩu nếu Cust ID khớp
        user.password = newPassword;

        await user.save();  // Lưu thay đổi vào cơ sở dữ liệu
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating password", error: err });
    }
});







app.get("/getUser/:custID", async (req, res) => {
    try {
      const custID = req.params.custID;
  
      // Truy vấn theo "Cust ID" (với dấu cách)
      const user = await Customer_testModel.findOne({ "Cust ID": custID });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      res.json(user); // Trả về thông tin người dùng
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).send("Server Error");
    }
  });




app.post("/updateUser", async (req, res) => {
    const { "Cust ID": custID, password } = req.body;
  
    try {
      // Truy vấn theo "Cust ID" (với dấu cách)
      const user = await Customer_testModel.findOne({ "Cust ID": custID });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Cập nhật city
      user.password = password;
      await user.save();
  
      res.json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Server Error");
    }
  });



app.post("/updateUser_Infor", async (req, res) => {
    const { "Cust ID": custID, password, "First Name": firstName,
         "Last Name": lastName, Company, City, Country,
          "Phone 1": phone1, "Phone 2": phone2 } = req.body;
  
    try {
      // Truy vấn theo "Cust ID" (với dấu cách)
      const user = await Customer_testModel.findOne({ "Cust ID": custID });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Cập nhật city
      user.password = password;
      user["First Name"] = firstName;
      user["Last Name"] = lastName;
      user.Company = Company;
      user.City = City;
      user.Country = Country;
      user["Phone 1"] = phone1;
      user["Phone 2"] = phone2;
      await user.save();
  
      res.json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Server Error");
    }
  });


  app.post('/updateOrderStatus', async (req, res) => {
    const { SKU, Status } = req.body;
    try {
        const result = await OrderModel.updateOne(
            { SKU: SKU },
            { $set: { Status: Status } }
        );
        if (result.nModified > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Order not found or status not changed' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Server Error');
    }
});



app.listen(3001, () => {
    console.log("Server is running");
});
