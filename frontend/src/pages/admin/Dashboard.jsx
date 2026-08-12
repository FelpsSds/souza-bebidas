import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'

export default function AdminDashboard(){
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
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

  async function updateStatus(orderId, newStatus){
    const token = localStorage.getItem('sb_token')
    if(!token) { localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    try{
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, { method: 'PATCH', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: newStatus }) })
      if(res.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
      const js = await res.json()
      if(js && js.ok){
        setOrders(prev => prev.map(o => o.id === orderId ? js.data : o))
      } else alert('Erro ao atualizar status')
    }catch(err){ console.error(err); alert('Erro de rede') }
  }

  async function updateBatchStatus(newStatus){
    if(!selected || selected.length===0) return alert('Selecione ao menos um pedido')
    const token = localStorage.getItem('sb_token')
    if(!token) { localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    try{
      const res = await fetch(`${API_BASE}/api/orders`, { method: 'PATCH', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ids: selected, status: newStatus }) })
      if(res.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
      const js = await res.json()
      if(js && js.ok){
        // atualizar localmente
        const updatedIds = js.data.map(o=>o.id)
        setOrders(prev => prev.map(o => updatedIds.includes(o.id) ? js.data.find(u=>u.id===o.id) : o))
        setSelected([])
      } else alert('Erro no update em lote')
    }catch(err){ console.error(err); alert('Erro de rede') }
  }

    function normalizePhoneForWhatsApp(raw){
      if(!raw) return ''
      const digits = String(raw).replace(/\D/g,'')
      // if looks like local BR (10 or 11 digits), prefix country code 55
      if(digits.length === 10 || digits.length === 11) return `55${digits}`
      return digits
    }

    function notifyWhatsApp(order){
      const phone = normalizePhoneForWhatsApp(order.phone || (order.customer && order.customer.phone))
      if(!phone) return alert('Número inválido')
      const items = (order.items||[]).map(i=>`${i.quantity}x Produto#${i.productId}`).join(', ')
      const msg = `Olá ${order.customer && order.customer.name ? order.customer.name : ''}, seu pedido #${order.id} agora está com status: ${order.status}. Itens: ${items}. Total: R$ ${Number(order.total).toFixed(2)}. Obrigado!`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      window.open(url, '_blank')
    }

    function notifySelected(){
      if(!selected || selected.length===0) return alert('Selecione ao menos um pedido')
      const toNotify = orders.filter(o=> selected.includes(o.id))
      toNotify.forEach(o=> notifyWhatsApp(o))
    }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        {loading ? <div>Carregando pedidos...</div> : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Pesquisar por ID, telefone ou nome" className="p-2 border rounded w-80" />
              <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="p-2 border rounded">
                <option value="">Todos os status</option>
                <option value="novo">novo</option>
                <option value="preparando">preparando</option>
                <option value="enviado">enviado</option>
                <option value="entregue">entregue</option>
                <option value="cancelado">cancelado</option>
              </select>
              <div className="flex items-center gap-2">
                <select id="batchStatus" className="p-2 border rounded">
                  <option value="preparando">preparando</option>
                  <option value="enviado">enviado</option>
                  <option value="entregue">entregue</option>
                  <option value="cancelado">cancelado</option>
                </select>
                <button onClick={()=>updateBatchStatus(document.getElementById('batchStatus').value)} className="px-3 py-2 bg-[#1F6B45] text-white rounded">Atualizar selecionados</button>
                <button onClick={notifySelected} className="px-3 py-2 border rounded">Notificar selecionados (WhatsApp)</button>
              </div>
            </div>

            <div className="space-y-4">
            {orders.filter(o=>{
              if(statusFilter && o.status !== statusFilter) return false
              const q = String(searchQuery || '').trim()
              if(!q) return true
              if(/^\d+$/.test(q)){
                if(String(o.id) === q) return true
                if((o.phone||'').includes(q)) return true
                if((o.customer && o.customer.phone || '').includes(q)) return true
                return false
              }
              const ql = q.toLowerCase()
              if((o.customer && o.customer.name || '').toLowerCase().includes(ql)) return true
              if((o.phone||'').toLowerCase().includes(ql)) return true
              if(String(o.id).includes(ql)) return true
              return false
            }).map(o=> (
              <div key={o.id} className="p-4 bg-white rounded shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="mr-3">
                    <input type="checkbox" checked={selected.includes(o.id)} onChange={(e)=>{
                      if(e.target.checked) setSelected(prev=>[...prev, o.id])
                      else setSelected(prev=>prev.filter(id=>id!==o.id))
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Pedido #{o.id}</div>
                    <div className="text-sm">Cliente: {o.customer ? o.customer.name : '—'}</div>
                    <div className="text-sm">Telefone: {o.phone}</div>
                    <div className="mt-2">
                      {o.items && o.items.map(it=> (
                        <div key={it.id} className="text-sm">{it.quantity}x Produto #{it.productId} — R$ {it.price}</div>
                      ))}
                    </div>
                  </div>
                  <div className="w-48">
                    <div className="text-right font-bold">R$ {o.total.toFixed(2)}</div>
                    <div className="mt-2">
                      <select value={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="w-full p-2 border rounded">
                        <option value="novo">novo</option>
                        <option value="preparando">preparando</option>
                        <option value="enviado">enviado</option>
                        <option value="entregue">entregue</option>
                        <option value="cancelado">cancelado</option>
                      </select>
                      <div className="mt-2 flex gap-2">
                        <button onClick={()=>notifyWhatsApp(o)} className="px-3 py-2 border rounded">Notificar (WhatsApp)</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
