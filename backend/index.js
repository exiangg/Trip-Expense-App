// index.js
const express = require("express");
const db = require('./db')
const app = express();
const port = 4000;

app.use(express.json());

// Basic CORS so the frontend (5173) can call the API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// simple test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Simple CRUD for trips
app.get('/trips', async (req, res) => {
  try {
    const rows = await db.all(`
      SELECT t.id, t.name, t.base_currency, t.spend_currency, t.fx_rate, t.p1_name, t.p2_name, t.created_at,
             COALESCE(SUM(CASE WHEN e.excluded IS NULL OR e.excluded = 0 THEN e.amount_base ELSE 0 END), 0) AS total_base
      FROM trips t
      LEFT JOIN expenses e ON e.trip_id = t.id
      GROUP BY t.id
      ORDER BY t.id DESC
    `)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch trips' })
  }
})

app.post('/trips', async (req, res) => {
  const { name, base_currency, spend_currency, fx_rate, p1_name, p2_name } = req.body || {}
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' })
  try {
    const base = (base_currency || 'SGD').toUpperCase()
    const spend = (spend_currency || base).toUpperCase()
    const rate = Number(fx_rate || 1)
    const p1 = (p1_name || 'Yixiang')
    const p2 = (p2_name || 'Tracy')
    const result = await db.run('INSERT INTO trips (name, base_currency, spend_currency, fx_rate, p1_name, p2_name) VALUES (?, ?, ?, ?, ?, ?)', [name.trim(), base, spend, rate, p1, p2])
    const trip = await db.get('SELECT id, name, base_currency, spend_currency, fx_rate, p1_name, p2_name, created_at FROM trips WHERE id = ?', [result.id])
    res.status(201).json(trip)
  } catch (e) {
    res.status(500).json({ error: 'Failed to create trip' })
  }
})

// Delete a trip and its expenses
app.delete('/trips/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const existing = await db.get('SELECT id FROM trips WHERE id = ?', [id])
    if (!existing) return res.status(404).json({ error: 'Trip not found' })
    await db.run('DELETE FROM expenses WHERE trip_id = ?', [id])
    await db.run('DELETE FROM trips WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete trip' })
  }
})

// Update trip settings (currencies / fx)
app.patch('/trips/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, base_currency, spend_currency, fx_rate, p1_name, p2_name } = req.body || {}
  try {
    const existing = await db.get('SELECT * FROM trips WHERE id = ?', [id])
    if (!existing) return res.status(404).json({ error: 'Trip not found' })
    const newName = (name ?? existing.name)
    const base = (base_currency ?? existing.base_currency).toUpperCase()
    const spend = (spend_currency ?? existing.spend_currency).toUpperCase()
    const rate = Number(fx_rate ?? existing.fx_rate)
    const p1 = (p1_name ?? existing.p1_name)
    const p2 = (p2_name ?? existing.p2_name)
    await db.run('UPDATE trips SET name = ?, base_currency = ?, spend_currency = ?, fx_rate = ?, p1_name = ?, p2_name = ? WHERE id = ?', [newName, base, spend, rate, p1, p2, id])
    // Recompute existing expenses to reflect new currency/rate
    await db.run('UPDATE expenses SET currency = ?, fx_rate = ?, amount_base = amount * ? WHERE trip_id = ?', [spend, rate, rate, id])
    const updated = await db.get('SELECT id, name, base_currency, spend_currency, fx_rate, p1_name, p2_name, created_at FROM trips WHERE id = ?', [id])
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: 'Failed to update trip' })
  }
})

// Expenses scoped to a trip
app.get('/trips/:id/expenses', async (req, res) => {
  const tripId = Number(req.params.id)
  try {
    const rows = await db.all('SELECT id, trip_id, description, amount, paid_by, currency, fx_rate, amount_base, excluded, created_at FROM expenses WHERE trip_id = ? ORDER BY id DESC', [tripId])
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch expenses' })
  }
})

app.post('/trips/:id/expenses', async (req, res) => {
  const tripId = Number(req.params.id)
  const { description, amount, paid_by, currency, fx_rate } = req.body || {}
  if (!description || !description.trim() || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Description and numeric amount are required' })
  }
  try {
    // If currency/fx not provided, use trip defaults
    const trip = await db.get('SELECT spend_currency, fx_rate FROM trips WHERE id = ?', [tripId])
    const cur = (currency || trip?.spend_currency || 'USD').toUpperCase()
    const rate = Number(fx_rate || trip?.fx_rate || 1)
    const amt = Number(amount)
    const baseAmt = amt * rate
    const result = await db.run(
      'INSERT INTO expenses (trip_id, description, amount, paid_by, currency, fx_rate, amount_base, excluded) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [tripId, description.trim(), amt, paid_by || null, cur, rate, baseAmt]
    )
    const expense = await db.get('SELECT id, trip_id, description, amount, paid_by, currency, fx_rate, amount_base, excluded, created_at FROM expenses WHERE id = ?', [result.id])
    res.status(201).json(expense)
  } catch (e) {
    res.status(500).json({ error: 'Failed to create expense' })
  }
})

// Update an expense
app.put('/expenses/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { description, amount, paid_by, currency, fx_rate, excluded } = req.body || {}
  try {
    const existing = await db.get('SELECT * FROM expenses WHERE id = ?', [id])
    if (!existing) return res.status(404).json({ error: 'Expense not found' })
    const trip = await db.get('SELECT spend_currency, fx_rate FROM trips WHERE id = ?', [existing.trip_id])
    const desc = (description ?? existing.description)
    const amt = Number(amount ?? existing.amount)
    const cur = (currency ?? existing.currency ?? trip?.spend_currency ?? 'USD').toUpperCase()
    const rate = Number(fx_rate ?? existing.fx_rate ?? trip?.fx_rate ?? 1)
    const baseAmt = amt * rate
    const ex = (excluded === undefined ? existing.excluded : (excluded ? 1 : 0))
    await db.run('UPDATE expenses SET description = ?, amount = ?, paid_by = ?, currency = ?, fx_rate = ?, amount_base = ?, excluded = ? WHERE id = ?', [desc, amt, paid_by ?? existing.paid_by, cur, rate, baseAmt, ex, id])
    const updated = await db.get('SELECT id, trip_id, description, amount, paid_by, currency, fx_rate, amount_base, excluded, created_at FROM expenses WHERE id = ?', [id])
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: 'Failed to update expense' })
  }
})

// Delete an expense
app.delete('/expenses/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const existing = await db.get('SELECT id FROM expenses WHERE id = ?', [id])
    if (!existing) return res.status(404).json({ error: 'Expense not found' })
    await db.run('DELETE FROM expenses WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete expense' })
  }
})

// Trip settlement summary (two participants, equal split). Returns base currency amounts.
app.get('/trips/:id/summary', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const t = await db.get('SELECT id, base_currency, p1_name, p2_name FROM trips WHERE id = ?', [id])
    if (!t) return res.status(404).json({ error: 'Trip not found' })
    const rows = await db.all('SELECT amount_base, paid_by, excluded FROM expenses WHERE trip_id = ?', [id])
    let total = 0
    let p1Paid = 0
    let p2Paid = 0
    let otherPaid = 0
    const p1 = (t.p1_name || 'Me')
    const p2 = (t.p2_name || 'Wife')
    for (const r of rows) {
      const included = !(r.excluded && Number(r.excluded) !== 0)
      if (!included) continue
      const amt = Number(r.amount_base || 0)
      total += amt
      const who = (r.paid_by || '').toString().trim().toLowerCase()
      if (who && who === p1.toLowerCase()) p1Paid += amt
      else if (who && who === p2.toLowerCase()) p2Paid += amt
      else otherPaid += amt
    }
    const share = total / 2
    const p1Delta = p1Paid - share
    const p2Delta = p2Paid - share
    let settlement
    if (p1Delta > 0 && p2Delta < 0) {
      settlement = { from: p2, to: p1, amount: Math.min(p1Delta, -p2Delta) }
    } else if (p2Delta > 0 && p1Delta < 0) {
      settlement = { from: p1, to: p2, amount: Math.min(p2Delta, -p1Delta) }
    } else {
      settlement = { from: null, to: null, amount: 0 }
    }
    res.json({
      base_currency: t.base_currency,
      total_included_base: total,
      per_person_share: share,
      by_person: { [p1]: p1Paid, [p2]: p2Paid, other: otherPaid },
      deltas: { [p1]: p1Delta, [p2]: p2Delta },
      settlement
    })
  } catch (e) {
    res.status(500).json({ error: 'Failed to compute summary' })
  }
})

// Ensure DB is migrated before serving
db.migrate()

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
}

module.exports = app
