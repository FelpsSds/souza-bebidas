import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'

export default function AdminDashboard(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  useEffect(()=>{
    const token = localStorage.getItem('sb_token')
    if(!token) return navigate('/admin/login')
    setLoading(true)
    fetch(`${API_BASE}/api/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>{
        if(r.status === 401) { localStorage.removeItem('sb_token'); navigate('/admin/login'); return null }
        return r.json()
      }).then(js=>{
        if(js && js.ok) setOrders(js.data)
      }).catch(err=>{ console.error(err) }).finally(()=>setLoading(false))
  },[])

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        {loading ? <div>Carregando pedidos...</div> : (
          <div className="space-y-4">
            {orders.map(o=> (
              <div key={o.id} className="p-4 bg-white rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">Pedido #{o.id} - {o.status}</div>
                    <div className="text-sm">Cliente: {o.customer ? o.customer.name : '—'}</div>
                    <div className="text-sm">Telefone: {o.phone}</div>
                  </div>
                  <div className="text-right">R$ {o.total.toFixed(2)}</div>
                </div>
                <div className="mt-2">
                  {o.items && o.items.map(it=> (
                    <div key={it.id} className="text-sm">{it.quantity}x Produto #{it.productId} — R$ {it.price}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
