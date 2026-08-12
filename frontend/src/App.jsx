import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home(){
  return (<div><h1>Souza Bebidas</h1><p>Home</p></div>)
}

function Products(){
  return (<div><h1>Produtos</h1></div>)
}

function Cart(){
  return (<div><h1>Carrinho</h1></div>)
}

export default function App(){
  return (
    <BrowserRouter>
      <nav style={{padding:16}}>
        <Link to="/">Home</Link> | <Link to="/produtos">Produtos</Link> | <Link to="/carrinho">Carrinho</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/produtos" element={<Products/>} />
        <Route path="/carrinho" element={<Cart/>} />
      </Routes>
    </BrowserRouter>
  )
}
