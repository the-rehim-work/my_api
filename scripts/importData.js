const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  const raw = fs.readFileSync(path.join(__dirname, 'earthquakes.csv'), 'utf-8')
  const lines = raw.trim().split('\n')
  const headers = lines[0].split(',')

  const records = lines.slice(1).map(line => {
    const cols = line.split(',')
    return {
      place: cols[headers.indexOf('place')]?.trim() || 'Unknown',
      magnitude: parseFloat(cols[headers.indexOf('mag')]) || 0,
      depth: parseFloat(cols[headers.indexOf('depth')]) || 0,
      latitude: parseFloat(cols[headers.indexOf('latitude')]) || 0,
      longitude: parseFloat(cols[headers.indexOf('longitude')]) || 0,
      occurredAt: new Date(cols[headers.indexOf('time')]?.trim())
    }
  }).filter(r => !isNaN(r.occurredAt.getTime()))

  for (const record of records) {
    await prisma.earthquake.create({ data: record })
  }

  console.log(`Imported ${records.length} records`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())