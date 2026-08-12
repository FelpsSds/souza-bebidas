const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  // categories
  const bebidas = await prisma.category.upsert({
    where: { slug: 'bebidas' },
    update: {},
    create: { name: 'Bebidas', slug: 'bebidas' }
  })

  const utilitarios = await prisma.category.upsert({
    where: { slug: 'utilitarios' },
    update: {},
    create: { name: 'Utilitários', slug: 'utilitarios' }
  })

  // products
  const products = [
    { name: 'Coca-Cola 2L', slug: 'coca-cola-2l', description: 'Refrigerante Coca-Cola 2 litros.', price: 10.0, stock: 37, images: ['/images/products/cocacola.jpg'], categoryId: bebidas.id },
    { name: 'Água Mineral 1.5L', slug: 'agua-1-5l', description: 'Água mineral sem gás.', price: 3.0, stock: 120, images: ['/images/products/agua.jpg'], categoryId: bebidas.id },
    { name: 'Copos Descartáveis 100un', slug: 'copos-100un', description: 'Pacote de copos descartáveis.', price: 8.0, stock: 50, images: ['/images/products/copos.jpg'], categoryId: utilitarios.id },
    { name: 'Cerveja Lata 350ml', slug: 'cerveja-lata-350ml', description: 'Cerveja gelada.', price: 5.5, stock: 200, images: ['/images/products/cerveja.jpg'], categoryId: bebidas.id }
  ]

  for (const p of products){
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price, stock: p.stock },
      create: p
    })
  }

  console.log('Seed completed')
}

main()
  .catch(e=>{ console.error(e); process.exit(1) })
  .finally(()=>prisma.$disconnect())
