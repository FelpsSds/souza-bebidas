import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home/Home'
import Products from './pages/public/Products/Products'
import CartPage from './pages/public/Cart/Cart'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import { CartProvider } from './contexts/CartContext'

export default function App(){
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/produtos" element={<Products/>} />
          <Route path="/carrinho" element={<CartPage/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/produtos" element={<AdminProducts/>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
