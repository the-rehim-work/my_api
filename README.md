# Welcome to My Api
***

## Task
Build a production-ready REST API around a real-world dataset. The challenge is not just exposing data through endpoints — it's doing it securely with token-based authentication, efficiently with Redis caching, consistently with pagination, and reliably enough to run in a containerized cloud environment.

## Description
Built a REST API around a USGS earthquake dataset (1000+ records) using Express.js and Prisma ORM with PostgreSQL. Authentication is JWT-based with tokens stored in httpOnly cookies — never exposed to client-side JavaScript. Public GET endpoints are accessible without a token. All write operations require a valid JWT. Redis caches GET responses for 60 seconds and cache is busted on every write. Pagination is enforced at 20 records per page. API documentation is live via Swagger UI. The entire stack runs in Docker with a single command.

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/my_api
cd my_api
cp .env.example .env
docker-compose up --build -d
docker-compose exec api npx prisma migrate deploy
docker-compose exec api node prisma/seed.js
docker-compose exec api node scripts/importData.js
```

## Usage

API runs at `http://localhost:3000`
Swagger UI at `http://localhost:3000/api-docs`

**Auth:**
```
POST /api/auth/register   - create account
POST /api/auth/login      - get token
POST /api/auth/logout     - clear token
```

**Earthquakes (public GET, auth required for write):**
```
GET    /api/earthquakes        - paginated list (?page=1)
GET    /api/earthquakes/:id    - single record
POST   /api/earthquakes        - create (auth)
PUT    /api/earthquakes/:id    - update (auth)
DELETE /api/earthquakes/:id    - delete (auth)
```

**Live API:** `https://my-api-34hd.onrender.com`

**API Documentation:** `https://my-api-34hd.onrender.com/api-docs`

### The Core Team


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>