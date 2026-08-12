import React, { useState } from 'react'

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))

export default function ProductCard({product, onAdd}){
  const [open, setOpen] = useState(false)
  const imgs = (product.images && product.images.length) ? product.images : (product.image ? [product.image] : [])
  const [index, setIndex] = useState(0)

  function prev(){ setIndex(i => (i - 1 + imgs.length) % imgs.length) }
  function next(){ setIndex(i => (i + 1) % imgs.length) }

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <button onClick={()=>{ if(imgs.length) setOpen(true) }} className="block mb-3">
        <img src={imgs[0] || '/images/products/default.png'} alt={product.name} className="h-40 object-cover rounded w-full" />
      </button>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-bold">{money(product.price)}</div>
        <button onClick={() => onAdd && onAdd(product)} className="px-3 py-1 bg-[#1F6B45] text-white rounded">Adicionar</button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full mx-4">
            <button onClick={()=>setOpen(false)} className="absolute top-2 right-2 text-white bg-black/40 rounded px-2 py-1">Fechar</button>
            <div className="bg-white p-4 rounded">
              <div className="flex items-center justify-center">
                {imgs.length > 1 && <button onClick={prev} className="px-3 py-1 mr-2">◀</button>}
                <img src={imgs[index]} alt={`${product.name} ${index+1}`} className="max-h-[70vh] object-contain" />
                {imgs.length > 1 && <button onClick={next} className="px-3 py-1 ml-2">▶</button>}
              </div>
              {product.description && <p className="mt-3 text-sm text-gray-700">{product.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
