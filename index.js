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

// Simple health
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
    { id: 2, provider: 'Esaad', title: 'Buy 1 Get 1 Pizza', description: 'Selected outlets', price: 35, discount_pct: 50, city: 'Abu Dhabi', updated_at: new Date() }
  ];
  res.json({ source: 'sample', offers: sample });
});

// Placeholder: trigger a refresh (scraper or cron would normally do this)
app.post('/api/refresh', async (req, res) => {
  // In production: enqueue jobs, call scraper microservices, or trigger webhooks
  res.json({ ok: true, message: 'Refresh triggered (placeholder)' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Backend listening on', port));
