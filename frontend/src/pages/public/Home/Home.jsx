import React from 'react'
import Header from '../../../components/Header/Header'
import CategoryCard from '../../../components/CategoryCard/CategoryCard'

export default function Home(){
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#123B2A]">Tudo o que você precisa, em um só lugar.</h1>
            <p className="mt-4 text-gray-700">Bebidas, alimentos, higiene, itens para festas e serviços para o seu evento.</p>
            <div className="mt-6">
              <a href="/produtos" className="px-4 py-2 bg-[#1F6B45] text-white rounded mr-3">Ver produtos</a>
              <a href="https://wa.me/" className="px-4 py-2 border border-[#1F6B45] text-[#1F6B45] rounded">Pedir pelo WhatsApp</a>
            </div>
          </div>
          <div>
            <img src="/images/hero.jpg" alt="Produtos Souza Bebidas" className="rounded shadow" />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">O que você procura?</h2>
          <div className="flex gap-4 flex-wrap">
            <CategoryCard emoji="🥤" title="Bebidas" to="/produtos?categoria=bebidas" />
            <CategoryCard emoji="🍚" title="Alimentos" to="/produtos?categoria=alimentos" />
            <CategoryCard emoji="🧼" title="Higiene" to="/produtos?categoria=higiene" />
            <CategoryCard emoji="🎉" title="Festas" to="/produtos?categoria=festas" />
            <CategoryCard emoji="💧" title="Água" to="/produtos?categoria=agua" />
            <CategoryCard emoji="🔥" title="Gás" to="/produtos?categoria=gas" />
          </div>
        </section>
      </main>
    </div>
  )
}
