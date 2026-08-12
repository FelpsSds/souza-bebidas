import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', stock: '', images: [] })
  const [errors, setErrors] = useState({})
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const navigate = useNavigate()

  function fetchProducts(){
    setLoading(true)
    fetch(`${API_BASE}/api/products`).then(r=>r.json()).then(js=>{ if(js && js.ok) setProducts(js.data) }).catch(err=>console.error(err)).finally(()=>setLoading(false))
  }

  useEffect(()=>{ fetchProducts() }, [])

  function openCreate(){ setEditing(null); setForm({ name:'', slug:'', description:'', price:'', stock:'', images:[]}); setShowForm(true) }

  function openEdit(p){ setEditing(p); setForm({ name: p.name||'', slug: p.slug||'', description: p.description||'', price: p.price||'', stock: p.stock||0, images: p.images || [] }); setShowForm(true) }

  function handleChange(e){ const { name, value } = e.target; setForm(prev=>({ ...prev, [name]: value })) }

  function validateForm(){
    const errs = {}
    const p = Number(form.price)
    const s = Number(form.stock)
    if (isNaN(p) || p < 0) errs.price = 'Preço inválido'
    if (!Number.isInteger(s) || s < 0) errs.stock = 'Estoque inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function removeImageAt(i){ setForm(prev=>({ ...prev, images: prev.images.filter((_,idx)=>idx!==i) })) }
  function moveImage(i, dir){ setForm(prev=>{
    const arr = [...prev.images]
    const j = i + dir
    if(j<0 || j>=arr.length) return prev
    const tmp = arr[j]; arr[j] = arr[i]; arr[i] = tmp
    return { ...prev, images: arr }
  }) }

  function getToken(){ return localStorage.getItem('sb_token') }

  async function save(){
    const token = getToken()
    if(!token) { localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    if(!validateForm()) return alert('Corrija os erros no formulário')
    const payload = { name: form.name, slug: form.slug, description: form.description, price: Number(form.price), stock: Number(form.stock), images: Array.isArray(form.images) ? form.images : (form.images ? String(form.images).split(',').map(s=>s.trim()) : []) }
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
            {products.map(p=> {
              const rawImg = (p.images && p.images[0]) || ''
              let thumb = rawImg
              if (rawImg && rawImg.startsWith('/uploads')) thumb = `${API_BASE}${rawImg}`
              return (
              <div key={p.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={thumb || '/images/products/default.png'} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">R$ {p.price}</div>
                  </div>
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
                {errors.price && <div className="text-sm text-red-500">{errors.price}</div>}
                <input name="stock" value={form.stock} onChange={handleChange} placeholder="Estoque" className="p-2 border rounded" />
                {errors.stock && <div className="text-sm text-red-500">{errors.stock}</div>}
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.images && form.images.length > 0 ? form.images.map((img,idx)=>{
                      const src = img && img.startsWith('/uploads') ? `${API_BASE}${img}` : img
                      return (
                        <div key={idx} className="relative">
                          <img src={src} alt={`img-${idx}`} className="w-20 h-20 object-cover rounded" />
                          <div className="absolute top-0 right-0 flex flex-col">
                            <button onClick={()=>moveImage(idx, -1)} className="bg-white/80 p-1 text-sm">◀</button>
                            <button onClick={()=>removeImageAt(idx)} className="bg-white/80 p-1 text-sm text-red-600">✕</button>
                            <button onClick={()=>moveImage(idx, +1)} className="bg-white/80 p-1 text-sm">▶</button>
                          </div>
                        </div>
                      )
                    }) : <div className="text-sm text-gray-500">Nenhuma imagem</div>}
                  </div>
                  <div className="flex items-center gap-2">
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
                          setForm(prev=>({ ...prev, images: [...(prev.images||[]), full] }))
                          fileInput.value = ''
                          alert('Upload realizado')
                        } else { alert('Upload falhou') }
                      }catch(err){ console.error(err); alert('Erro no upload') }
                    }} className="px-3 py-1 border rounded">Upload imagem</button>
                  </div>
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
