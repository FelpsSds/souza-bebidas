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
    // paginação: ?page=1&limit=10
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10))
    const skip = (page - 1) * limit

    // busca: ?q=texto (por id, telefone ou nome do cliente)
    const qRaw = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    const statusFilter = typeof req.query.status === 'string' && req.query.status ? req.query.status : null
    const fromRaw = typeof req.query.from === 'string' && req.query.from ? req.query.from : null
    const toRaw = typeof req.query.to === 'string' && req.query.to ? req.query.to : null

    const where = {}
    if (statusFilter) where.status = statusFilter

    const orClauses = []
    if (qRaw) {
      // buscar por id exato quando for número
      if (/^\d+$/.test(qRaw)) {
        orClauses.push({ id: Number(qRaw) })
      }
      orClauses.push({ phone: { contains: qRaw } })
      orClauses.push({ customer: { is: { name: { contains: qRaw, mode: 'insensitive' } } } })
    }
    if (orClauses.length) where.OR = orClauses

    // filtro por intervalo de datas (createdAt)
    if (fromRaw || toRaw) {
      const createdAt = {}
      if (fromRaw) {
        const d = new Date(fromRaw)
        if (!isNaN(d)) createdAt.gte = d
      }
      if (toRaw) {
        const d2 = new Date(toRaw)
        if (!isNaN(d2)) createdAt.lte = d2
      }
      if (Object.keys(createdAt).length) where.createdAt = createdAt
    }

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({ where, include: { items: true, customer: true }, orderBy: { createdAt: 'desc' }, skip, take: limit })
    ])

    const totalPages = Math.ceil(total / limit)
    res.json({ ok: true, data: orders, meta: { total, page, limit, totalPages } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Atualizar status do pedido (admin)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    const updated = await prisma.order.update({ where: { id }, data: { status } })
    res.json({ ok: true, data: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Atualizar status em lote: { ids: [1,2,3], status: 'enviado' }
router.patch('/', verifyToken, async (req, res) => {
  try {
    const { ids, status } = req.body
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' })
    if (!status) return res.status(400).json({ error: 'status required' })

    const updated = await prisma.$transaction(
      ids.map(id => prisma.order.update({ where: { id: Number(id) }, data: { status } }))
    )

    res.json({ ok: true, data: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
