// src/RootApp.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import OrderPage from './OrderPage';
import OrderSuccess from './OrderSuccess';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/LoginPage';
import ProductsPage from './admin/ProductsPage';
import OrdersPage from './admin/OrdersPage';
import { AuthProvider } from './contexts/AuthContext';  

export default function RootApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/order/success/:id" element={<OrderSuccess />} />

          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
