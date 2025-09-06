const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite')

function open() {
  return new sqlite3.Database(DB_PATH)
}

function migrate() {
  const db = open()
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      base_currency TEXT DEFAULT 'SGD',
      spend_currency TEXT DEFAULT 'USD',
      fx_rate REAL DEFAULT 1,
      p1_name TEXT DEFAULT 'Yixiang',
      p2_name TEXT DEFAULT 'Tracy',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`)
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      paid_by TEXT,
      currency TEXT DEFAULT 'USD',
      fx_rate REAL DEFAULT 1,
      amount_base REAL DEFAULT 0,
      excluded INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(trip_id) REFERENCES trips(id)
    )`)

    // Try to add new columns if the DB was created before
    db.run(`ALTER TABLE trips ADD COLUMN base_currency TEXT DEFAULT 'SGD'`, () => {})
    db.run(`ALTER TABLE trips ADD COLUMN spend_currency TEXT DEFAULT 'USD'`, () => {})
    db.run(`ALTER TABLE trips ADD COLUMN fx_rate REAL DEFAULT 1`, () => {})
    db.run(`ALTER TABLE trips ADD COLUMN p1_name TEXT DEFAULT 'Yixiang'`, () => {})
    db.run(`ALTER TABLE trips ADD COLUMN p2_name TEXT DEFAULT 'Tracy'`, () => {})
    db.run(`ALTER TABLE expenses ADD COLUMN paid_by TEXT`, () => {})
    db.run(`ALTER TABLE expenses ADD COLUMN currency TEXT DEFAULT 'USD'`, () => {})
    db.run(`ALTER TABLE expenses ADD COLUMN fx_rate REAL DEFAULT 1`, () => {})
    db.run(`ALTER TABLE expenses ADD COLUMN amount_base REAL DEFAULT 0`, () => {})
    db.run(`ALTER TABLE expenses ADD COLUMN excluded INTEGER DEFAULT 0`, () => {})
  })
  db.close()
}

function all(sql, params = []) {
  const db = open()
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      db.close()
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

function get(sql, params = []) {
  const db = open()
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      db.close()
      if (err) return reject(err)
      resolve(row)
    })
  })
}

function run(sql, params = []) {
  const db = open()
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      db.close()
      if (err) return reject(err)
      resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

if (require.main === module) {
  migrate()
  console.log('Database migrated at', DB_PATH)
}

module.exports = { migrate, all, get, run }
