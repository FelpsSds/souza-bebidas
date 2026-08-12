import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [email, setEmail] = useState('admin@local')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
      .then(r=>r.json()).then(js=>{
        setLoading(false)
        if(js && js.ok && js.token){
          localStorage.setItem('sb_token', js.token)
          navigate('/admin')
        } else {
          alert('Falha no login')
        }
      }).catch(err=>{ setLoading(false); alert('Erro de rede') })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input className="w-full p-2 border rounded mb-2" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded mb-4" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-[#1F6B45] text-white rounded" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </div>
      </form>
    </div>
  )
}
