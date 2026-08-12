const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'dev_secret'

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email_password_required' })
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'invalid_credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, secret, { expiresIn: '8h' })
    res.json({ ok: true, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
