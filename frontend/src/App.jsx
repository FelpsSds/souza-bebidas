import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home/Home'

function Products(){
  return (<div className="p-6"><h1>Produtos</h1></div>)
}

function Cart(){
  return (<div className="p-6"><h1>Carrinho</h1></div>)
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/produtos" element={<Products/>} />
        <Route path="/carrinho" element={<Cart/>} />
      </Routes>
    </BrowserRouter>
  )
}
