import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import ProductGrid from '../../../components/ProductGrid/ProductGrid'
import productsData from '../../../services/mockProducts'
import { useCart } from '../../../contexts/CartContext'

export default function Products(){
  const [products] = useState(productsData)
  const { addItem } = useCart()

  const handleAdd = (product) => {
    addItem(product, 1)
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Produtos</h1>
        <ProductGrid products={products} onAdd={handleAdd} />
      </main>
    </div>
  )
}
