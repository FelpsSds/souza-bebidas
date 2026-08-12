const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { verifyToken } = require('../middleware/auth')

// Public list
router.get('/', async (req, res) => {
  try {
    const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    res.json({ ok: true, data: cats })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Create (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, slug } = req.body
    const c = await prisma.category.create({ data: { name, slug } })
    res.json({ ok: true, data: c })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Update (admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, slug } = req.body
    const c = await prisma.category.update({ where: { id }, data: { name, slug } })
    res.json({ ok: true, data: c })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Delete (admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.category.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
