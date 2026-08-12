import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom'

export default function AdminCategories(){
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '' })
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const navigate = useNavigate()

  async function fetchCategories(){
    setLoading(true)
    try{
      const res = await fetch(`${API_BASE}/api/categories`)
      const js = await res.json()
      if(js && js.ok) setCategories(js.data)
    }catch(err){ console.error(err) }
    setLoading(false)
  }

  useEffect(()=>{ fetchCategories() }, [])

  function openCreate(){ setEditing(null); setForm({ name: '', slug: '' }); setShowForm(true) }
  function openEdit(c){ setEditing(c); setForm({ name: c.name||'', slug: c.slug||''}); setShowForm(true) }

  function handleChange(e){ setForm(prev=>({ ...prev, [e.target.name]: e.target.value })) }
  function getToken(){ return localStorage.getItem('sb_token') }

  async function save(){
    const token = getToken()
    if(!token){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    try{
      const url = editing ? `${API_BASE}/api/categories/${editing.id}` : `${API_BASE}/api/categories`
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      if(res.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
      const js = await res.json()
      if(js && js.ok){ setShowForm(false); fetchCategories() } else alert('Erro ao salvar categoria')
    }catch(err){ console.error(err); alert('Erro de rede') }
  }

  async function removeCategory(c){
    if(!confirm('Remover esta categoria?')) return
    const token = getToken()
    if(!token){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
    try{
      const res = await fetch(`${API_BASE}/api/categories/${c.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if(res.status === 401){ localStorage.removeItem('sb_token'); navigate('/admin/login'); return }
      const js = await res.json()
      if(js && js.ok) fetchCategories(); else alert('Erro ao remover')
    }catch(err){ console.error(err); alert('Erro de rede') }
  }

  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Categorias (Admin)</h1>
          <div>
            <button onClick={openCreate} className="px-4 py-2 bg-[#1F6B45] text-white rounded">Nova categoria</button>
          </div>
        </div>

        {loading ? <div>Carregando...</div> : (
          <div className="grid gap-2">
            {categories.map(c=> (
              <div key={c.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.slug}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>openEdit(c)} className="px-3 py-1 border rounded">Editar</button>
                  <button onClick={()=>removeCategory(c)} className="px-3 py-1 border rounded text-red-500">Remover</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="text-lg font-semibold mb-3">{editing ? 'Editar categoria' : 'Nova categoria'}</h2>
              <div className="grid gap-2">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="p-2 border rounded" />
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="p-2 border rounded" />
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
