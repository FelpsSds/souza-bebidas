import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home/Home'
import Products from './pages/public/Products/Products'
import { CartProvider } from './contexts/CartContext'

function Cart(){
  return (<div className="p-6"><h1>Carrinho</h1></div>)
}

export default function App(){
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/produtos" element={<Products/>} />
          <Route path="/carrinho" element={<Cart/>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
