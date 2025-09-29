// Simple Express backend for offers aggregator (MVP)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://agg:aggpass@localhost:5432/aggregator';
const pool = new Pool({ connectionString: DATABASE_URL });

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// List offers (from DB if available, otherwise sample)
app.get('/api/offers', async (req, res) => {
  try {
    const q = 'SELECT id, provider, title, description, price, discount_pct, city, updated_at FROM offers ORDER BY updated_at DESC LIMIT 200';
    const result = await pool.query(q).catch(() => null);
    if (result && result.rows && result.rows.length) {
      return res.json({ source: 'db', offers: result.rows });
    }
  } catch (e) {
    console.error('DB read error', e.message);
  }

  // fallback sample data
  const sample = [
    { id: 1, provider: 'Fazaa', title: '50% off Dinner for Two', description: 'Valid weekdays', price: 120, discount_pct: 50, city: 'Dubai', updated_at: new Date() },
    { id: 2, provider: 'Esaad', title: 'Buy 1 Get 1 Pizza', description: 'Selected outlets', price: 35, discount_pct: 50, city: 'Abu Dhabi', updated_at: new Date() },
    { id: 3, provider: 'Entertainer', title: 'Free Dessert with Lunch', description: 'Valid every Friday', price: 0, discount_pct: 100, city: 'Dubai', updated_at: new Date() },
    { id: 4, provider: 'Fazaa', title: '20% off Spa', description: 'Valid all month', price: 200, discount_pct: 20, city: 'Abu Dhabi', updated_at: new Date() },
    { id: 5, provider: 'Esaad', title: 'Free Coffee', description: 'Buy any breakfast', price: 0, discount_pct: 100, city: 'Sharjah', updated_at: new Date() },
    { id: 6, provider: 'Entertainer', title: '30% off Movie Tickets', description: 'Valid on weekends', price: 50, discount_pct: 30, city: 'Dubai', updated_at: new Date() },
    { id: 7, provider: 'Fazaa', title: 'Buy 1 Get 1 Ice Cream', description: 'All outlets', price: 15, discount_pct: 50, city: 'Abu Dhabi', updated_at: new Date() },
    { id: 8, provider: 'Esaad', title: 'Free Smoothie', description: 'With any lunch combo', price: 0, discount_pct: 100, city: 'Dubai', updated_at: new Date() }
  ];

  res.json({ source: 'sample', offers: sample });
});

// Placeholder: trigger a refresh (scraper or cron would normally do this)
app.post('/api/refresh', async (req, res) => {
  res.json({ ok: true, message: 'Refresh triggered (placeholder)' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Backend listening on', port));


// To run locally: DATABASE_URL=postgres://agg:aggpass@localhost:5432/aggregator node index.js
// Make sure to create the Postgres DB and table first:
// CREATE TABLE offers (id SERIAL PRIMARY KEY, provider VARCHAR(50), title VARCHAR(100), description TEXT, price NUMERIC, discount_pct INTEGER, city VARCHAR(50), updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);


