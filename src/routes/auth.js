const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already taken' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hashed } })

    res.status(201).json({ id: user.id, email: user.email })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 86400000 })
    res.json({ message: 'Logged in' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

module.exports = router