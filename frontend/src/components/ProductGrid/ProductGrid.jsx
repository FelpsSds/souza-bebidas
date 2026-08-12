import React from 'react'
import ProductCard from '../ProductCard/ProductCard'

export default function ProductGrid({products, onAdd}){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  )
}
