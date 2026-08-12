import React from 'react'

export default function CartItem({item, onIncrease, onDecrease, onRemove}){
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded shadow">
      <img src={item.image || '/images/products/default.png'} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onDecrease(item)} className="px-2 py-1 bg-gray-200 rounded">−</button>
        <div className="w-8 text-center">{item.quantity}</div>
        <button onClick={() => onIncrease(item)} className="px-2 py-1 bg-gray-200 rounded">+</button>
      </div>
      <div className="w-24 text-right font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</div>
      <button onClick={() => onRemove(item.id)} className="ml-4 text-red-500">Remover</button>
    </div>
  )
}
