import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header(){
  return (
    <header className="sb-header">
      <div className="sb-container">
        <Link to="/" className="sb-logo">SOUZA BEBIDAS</Link>
        <nav className="sb-nav">
          <Link to="/produtos">Produtos</Link>
          <Link to="/servicos">Serviços</Link>
          <Link to="/contato">Contato</Link>
          <Link to="/carrinho" className="sb-cart">Carrinho</Link>
        </nav>
      </div>
    </header>
  )
}
