import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  function fetchProducts(){
    setLoading(true)
    fetch(`${API_BASE}/api/products`).then(r=>r.json()).then(js=>{ if(js && js.ok) setProducts(js.data) }).finally(()=>setLoading(false))
  }

  useEffect(()=>{ fetchProducts() }, [])

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Produtos (Admin)</h1>
        {loading ? <div>Carregando...</div> : (
          <div className="grid grid-cols-1 gap-3">
            {products.map(p=> (
              <div key={p.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">R$ {p.price}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded">Editar</button>
                  <button className="px-3 py-1 border rounded text-red-500">Remover</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
