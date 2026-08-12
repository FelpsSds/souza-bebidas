import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header/Header'
import ProductGrid from '../../../components/ProductGrid/ProductGrid'
import productsData from '../../../services/mockProducts'
import { useCart } from '../../../contexts/CartContext'

export default function Products(){
  const [products, setProducts] = useState(productsData)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    fetch(`${API_BASE}/api/products`).then(r=>r.json()).then(js=>{
      if(js && js.ok && Array.isArray(js.data)){
        // map to the frontend shape if needed
        const mapped = js.data.map(p=>({ id: p.id, name: p.name, description: p.description, price: p.price, stock: p.stock, image: (p.images && p.images[0]) || '/images/products/default.png' }))
        setProducts(mapped)
      }
    }).catch(err=>{
      console.error('failed loading products', err)
    }).finally(()=>setLoading(false))
  },[])
  const { addItem } = useCart()

  const handleAdd = (product) => {
    addItem(product, 1)
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Produtos</h1>
        {loading ? <div>Carregando produtos...</div> : <ProductGrid products={products} onAdd={handleAdd} />}
      </main>
    </div>
  )
}
