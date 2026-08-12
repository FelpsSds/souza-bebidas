import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }){
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('sb_cart')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('sb_cart', JSON.stringify(items)) } catch {}
  }, [items])

  function addItem(product, qty = 1){
    setItems(prev => {
      const found = prev.find(p => p.id === product.id)
      if (found) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + qty } : p)
      return [...prev, { ...product, quantity: qty }]
    })
  }

  function removeItem(productId){
    setItems(prev => prev.filter(p => p.id !== productId))
  }

  function clearCart(){ setItems([]) }

  const totalItems = items.reduce((s,i) => s + (i.quantity||0), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(){
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export default CartContext
