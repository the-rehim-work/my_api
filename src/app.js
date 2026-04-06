const express = require('express')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const setupSwagger = require('./swagger')
const authRoutes = require('./routes/auth')
const earthquakeRoutes = require('./routes/earthquakes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use('/api/auth', authRoutes)
app.use('/api/earthquakes', earthquakeRoutes)

setupSwagger(app)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

module.exports = app