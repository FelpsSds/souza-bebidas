const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Create order
router.post('/', async (req, res) => {
  try {
    const { items, phone, name, address, deliveryType = 'retirada', notes } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items required' })
    }
    if (!phone) return res.status(400).json({ error: 'phone required' })

    // find or create customer by phone
    let customer = await prisma.customer.findUnique({ where: { phone } }).catch(()=>null)
    if (!customer) {
      customer = await prisma.customer.create({ data: { name: name || 'Cliente', phone, address } })
    }

    const total = items.reduce((s, i) => s + (i.price * i.quantity), 0)

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          total,
          deliveryType,
          address,
          phone,
          notes,
        }
      })

      // create order items and decrement stock
      for (const it of items) {
        await tx.orderItem.create({ data: { orderId: order.id, productId: it.productId, quantity: it.quantity, price: it.price } })
        await tx.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } }).catch(()=>null)
      }

      return order
    })

    res.json({ ok: true, orderId: result.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// List orders (basic) - protected
const { verifyToken } = require('../middleware/auth')
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: true, customer: true }, orderBy: { createdAt: 'desc' } })
    res.json({ ok: true, data: orders })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
