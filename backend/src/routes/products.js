const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// List products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true } })
    res.json({ ok: true, data: products })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
