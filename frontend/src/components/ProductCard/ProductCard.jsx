import React from 'react'

export default function ProductCard({product, onAdd}){
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <img src={product.image || '/images/products/default.png'} alt={product.name} className="h-40 object-cover mb-3 rounded" />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-bold">R$ {product.price.toFixed(2)}</div>
        <button onClick={() => onAdd && onAdd(product)} className="px-3 py-1 bg-[#1F6B45] text-white rounded">Adicionar</button>
      </div>
    </div>
  )
}
