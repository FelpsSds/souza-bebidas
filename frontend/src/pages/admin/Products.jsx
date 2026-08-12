import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', stock: '', images: '' })
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const navigate = useNavigate()

  function fetchProducts(){
    setLoading(true)
    fetch(`${API_BASE}/api/products`).then(r=>r.json()).then(js=>{ if(js && js.ok) setProducts(js.data) }).catch(err=>console.error(err)).finally(()=>setLoading(false))
  }

  useEffect(()=>{ fetchProducts() }, [])

  function openCreate(){ setEditing(null); setForm({ name:'', slug:'', description:'', price:'', stock:'', images:''}); setShowForm(true) }

  function openEdit(p){ setEditing(p); setForm({ name: p.name||'', slug: p.slug||'', description: p.description||'', price: p.price||'', stock: p.stock||0, images: (p.images && p.images.join(',')) || '' }); setShowForm(true) }

  function handleChange(e){ setForm(prev=>({ ...prev, [e.target.name]: e.target.value })) }

  function getToken(){ return localStorage.getItem('sb_token') }

  async function save(){
    const token = getToken()
    if(!token) { localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    const payload = { name: form.name, slug: form.slug, description: form.description, price: Number(form.price), stock: Number(form.stock), images: form.images ? form.images.split(',').map(s=>s.trim()) : [] }
    try{
      const url = editing ? `${API_BASE}/api/products/${editing.id}` : `${API_BASE}/api/products`
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const js = await res.json()
      if(res.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
      if(js && js.ok){ setShowForm(false); fetchProducts(); }
      else alert('Erro ao salvar produto')
    }catch(err){ console.error(err); alert('Erro de rede') }
  }

  async function removeProduct(p){
    if(!confirm('Remover este produto?')) return
    const token = getToken()
    if(!token) { localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    try{
      const res = await fetch(`${API_BASE}/api/products/${p.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if(res.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
      const js = await res.json()
      if(js && js.ok) fetchProducts(); else alert('Erro ao remover')
    }catch(err){ console.error(err); alert('Erro de rede') }
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Produtos (Admin)</h1>
          <div>
            <button onClick={openCreate} className="px-4 py-2 bg-[#1F6B45] text-white rounded">Novo produto</button>
          </div>
        </div>

        {loading ? <div>Carregando...</div> : (
          <div className="grid grid-cols-1 gap-3">
            {products.map(p=> (
              <div key={p.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">R$ {p.price}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>openEdit(p)} className="px-3 py-1 border rounded">Editar</button>
                  <button onClick={()=>removeProduct(p)} className="px-3 py-1 border rounded text-red-500">Remover</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-2xl">
              <h2 className="text-lg font-semibold mb-3">{editing ? 'Editar produto' : 'Novo produto'}</h2>
              <div className="grid grid-cols-2 gap-2">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="p-2 border rounded" />
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="p-2 border rounded" />
                <input name="price" value={form.price} onChange={handleChange} placeholder="Preço" className="p-2 border rounded" />
                <input name="stock" value={form.stock} onChange={handleChange} placeholder="Estoque" className="p-2 border rounded" />
                <input name="images" value={form.images} onChange={handleChange} placeholder="Imagens (separadas por ,)" className="p-2 border rounded col-span-2" />
                <div className="col-span-2 flex items-center gap-2">
                  <input type="file" id="fileUpload" className="" />
                  <button onClick={async ()=>{
                    const fileInput = document.getElementById('fileUpload')
                    if(!fileInput || !fileInput.files || fileInput.files.length===0) return alert('Selecione um arquivo')
                    const fd = new FormData(); fd.append('file', fileInput.files[0])
                    const token = localStorage.getItem('sb_token')
                    try{
                      const resp = await fetch(`${API_BASE}/api/uploads`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
                      const js = await resp.json()
                      if(resp.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
                      if(js && js.ok && js.url){
                        const full = `${API_BASE}${js.url}`
                        const imgs = form.images ? form.images + ',' + full : full
                        setForm(prev=>({ ...prev, images: imgs }))
                        fileInput.value = ''
                        alert('Upload realizado')
                      } else { alert('Upload falhou') }
                    }catch(err){ console.error(err); alert('Erro no upload') }
                  }} className="px-3 py-1 border rounded">Upload imagem</button>
                </div>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" className="p-2 border rounded col-span-2" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={()=>setShowForm(false)} className="px-3 py-2 border rounded">Cancelar</button>
                <button onClick={save} className="px-3 py-2 bg-[#1F6B45] text-white rounded">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
