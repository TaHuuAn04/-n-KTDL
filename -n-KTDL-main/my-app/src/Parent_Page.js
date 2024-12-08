import React from 'react';
import Headerall from './components/Headerall';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const Parent = () => {
  

  return (
    <div>
      <Headerall />
      <Outlet/>
      <Footer />
    </div>
  );
};

export default Parent;

