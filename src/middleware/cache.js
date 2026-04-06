const { createClient } = require('redis')

const client = createClient({ url: process.env.REDIS_URL })

client.connect().catch(console.error)

async function cache(req, res, next) {
  const key = req.originalUrl

  try {
    const cached = await client.get(key)
    if (cached) return res.json(JSON.parse(cached))

    res.sendResponse = res.json.bind(res)
    res.json = async (data) => {
      await client.setEx(key, 60, JSON.stringify(data))
      res.sendResponse(data)
    }

    next()
  } catch {
    next()
  }
}

module.exports = { cache, client }