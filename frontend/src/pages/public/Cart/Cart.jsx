import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import { useCart } from '../../../contexts/CartContext'
import CartItem from '../../../components/Cart/CartItem'

export default function Cart(){
  const { items, addItem, removeItem, clearCart } = useCart()
  const [name, setName] = useState('')
  // armazenamos só os dígitos e exibimos formatado
  const [phoneDigits, setPhoneDigits] = useState('')
  const [delivery, setDelivery] = useState('entrega')
  const [address, setAddress] = useState('')

  function onlyDigits(s){ return (s || '').replace(/\D/g,'') }
  function formatPhoneBR(d){
    if(!d) return ''
    if(d.length <= 2) return `(${d}`
    if(d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
    if(d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`
  }
  function isValidPhone(d){
    return d.length === 10 || d.length === 11
  }

  function increase(item){ addItem(item, 1) }
  function decrease(item){ if (item.quantity > 1) addItem(item, -1); else removeItem(item.id) }

  const total = items.reduce((s,i) => s + i.price * i.quantity, 0)

  function sendWhatsApp(){
    if (!isValidPhone(phoneDigits)) return alert('Informe um telefone válido (10 ou 11 dígitos)')
    let lines = []
    lines.push('Olá! Gostaria de fazer um pedido na Souza Bebidas.')
    lines.push('')
    items.forEach(i => lines.push(`• ${i.quantity}x ${i.name} - R$ ${ (i.price * i.quantity).toFixed(2) }`))
    lines.push('')
    lines.push(`Total: R$ ${total.toFixed(2)}`)
    lines.push(`Recebimento: ${delivery}`)
    if (delivery === 'entrega') lines.push(`Endereço: ${address}`)
    if (name) lines.push(`Cliente: ${name}`)
    if (phoneDigits) lines.push(`Telefone: ${formatPhoneBR(phoneDigits)}`)

    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Seu pedido</h1>

        {items.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">Seu carrinho está vazio.</div>
        ) : (
          <div className="space-y-4">
            {items.map(i => (
              <CartItem key={i.id} item={i} onIncrease={increase} onDecrease={decrease} onRemove={removeItem} />
            ))}

            <div className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <div className="font-semibold">Total</div>
                <div className="text-lg font-bold">R$ {total.toFixed(2)}</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded shadow">
              <h2 className="font-semibold mb-2">Dados para contato</h2>
              <div className="grid grid-cols-1 gap-2">
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="p-2 border rounded" />
                <input value={formatPhoneBR(phoneDigits)} onChange={e=>setPhoneDigits(onlyDigits(e.target.value))} placeholder="Telefone (somente números)" className="p-2 border rounded" />
                {!isValidPhone(phoneDigits) && phoneDigits.length>0 && (
                  <div className="text-sm text-red-500">Telefone inválido — deve ter 10 ou 11 dígitos.</div>
                )}
                <div>
                  <label className="mr-3">
                    <input type="radio" checked={delivery==='entrega'} onChange={()=>setDelivery('entrega')} /> Entrega
                  </label>
                  <label>
                    <input type="radio" checked={delivery==='retirada'} onChange={()=>setDelivery('retirada')} /> Retirada
                  </label>
                </div>
                {delivery === 'entrega' && (
                  <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Endereço" className="p-2 border rounded" />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={sendWhatsApp} disabled={!isValidPhone(phoneDigits) || items.length===0} className={`px-4 py-2 text-white rounded ${isValidPhone(phoneDigits) && items.length>0 ? 'bg-[#1F6B45]' : 'bg-gray-300 cursor-not-allowed'}`}>Enviar pedido pelo WhatsApp</button>
              <button onClick={clearCart} className="px-4 py-2 border rounded">Limpar carrinho</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
