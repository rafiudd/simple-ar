import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './HomePage';
import OrderPage from './OrderPage';
import OrderSuccess from './OrderSuccess';

export default function RootApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/success/:id" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}
