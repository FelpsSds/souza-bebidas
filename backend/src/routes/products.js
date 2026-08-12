const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { verifyToken } = require('../middleware/auth')

// List products (public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true } })
    res.json({ ok: true, data: products })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Create product (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, slug, description, price, stock, images, categoryId } = req.body
    const pPrice = Number(price)
    const pStock = Number(stock)
    if (isNaN(pPrice) || pPrice < 0) return res.status(400).json({ error: 'invalid_price' })
    if (isNaN(pStock) || pStock < 0) return res.status(400).json({ error: 'invalid_stock' })
    const p = await prisma.product.create({ data: { name, slug, description, price: pPrice, stock: pStock || 0, images: images || [], categoryId: categoryId || null } })
    res.json({ ok: true, data: p })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Update product (admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, slug, description, price, stock, images, categoryId } = req.body
    const pPrice = Number(price)
    const pStock = Number(stock)
    if (isNaN(pPrice) || pPrice < 0) return res.status(400).json({ error: 'invalid_price' })
    if (isNaN(pStock) || pStock < 0) return res.status(400).json({ error: 'invalid_stock' })
    const p = await prisma.product.update({ where: { id }, data: { name, slug, description, price: pPrice, stock: pStock, images: images || [], categoryId: categoryId || null } })
    res.json({ ok: true, data: p })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Delete product (admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.product.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
