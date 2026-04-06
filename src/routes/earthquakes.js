const express = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')
const { cache } = require('../middleware/cache')
const { client } = require('../middleware/cache')

const router = express.Router()

router.get('/', cache, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const take = 20
  const skip = (page - 1) * take

  try {
    const [data, total] = await Promise.all([
      prisma.earthquake.findMany({ skip, take, orderBy: { occurredAt: 'desc' } }),
      prisma.earthquake.count()
    ])

    res.json({ page, total, pages: Math.ceil(total / take), data })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', cache, async (req, res) => {
  try {
    const record = await prisma.earthquake.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!record) return res.status(404).json({ error: 'Not found' })
    res.json(record)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', auth, async (req, res) => {
  const { place, magnitude, depth, latitude, longitude, occurredAt } = req.body

  if (!place || magnitude == null || depth == null || latitude == null || longitude == null || !occurredAt) {
    return res.status(400).json({ error: 'All fields required' })
  }

  try {
    const record = await prisma.earthquake.create({
      data: { place, magnitude, depth, latitude, longitude, occurredAt: new Date(occurredAt) }
    })
    res.status(201).json(record)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', auth, async (req, res) => {
  const { place, magnitude, depth, latitude, longitude, occurredAt } = req.body

  try {
    const record = await prisma.earthquake.update({
      where: { id: parseInt(req.params.id) },
      data: { place, magnitude, depth, latitude, longitude, occurredAt: occurredAt ? new Date(occurredAt) : undefined }
    })
    await client.del(`/api/earthquakes/${req.params.id}`)
    await client.del('/api/earthquakes')
    res.json(record)
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.earthquake.delete({ where: { id: parseInt(req.params.id) } })
    await client.del(`/api/earthquakes/${req.params.id}`)
    await client.del('/api/earthquakes')
    res.json({ message: 'Deleted' })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

module.exports = router