import React from 'react'

export default function CategoryCard({emoji, title, to='#'}){
  return (
    <a href={to} className="inline-block p-4 bg-white rounded shadow text-center w-40">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-medium">{title}</div>
    </a>
  )
}
