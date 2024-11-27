import './App.css';
import Homepage from './Homepage';
import Order from './Order';
import OrderDetail from './OrderDetail';
import OrderManagementCancelled from './OrderManagementCancelled';
import OrderManagementComplete from './OrderManagementCompleted';
import OrderManagementToPay from './OrderManagementToPay';
import Product from './Product';
import ViewPurchaseHistory from './ViewPurchaseHistory';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';



function App() {
  // const [customer, setCustomer] = useState([]);
  // const [product, setProduct] = useState([]);
  
  
  // useEffect(() => {
  //   axios.get('http://localhost:3001/getCus')
  //   .then(customer => setCustomer(customer.data))
  //   .catch(err => console.log(err));
  // }, []);
  
  // useEffect(() => {
  //   axios.get("http://localhost:3001/getProduct")
  //   .then(product => setProduct(product.data))
  //   .catch(err => console.log(err))
  // }, [])

  return (
    <>
    
    </>
  );
}

export default App;
