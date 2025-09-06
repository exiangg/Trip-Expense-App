const path = require('path')
const os = require('os')
const fs = require('fs')

// Point DB to a temp file before importing app
const tmpDb = path.join(os.tmpdir(), `trip-expense-test-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`)
process.env.DB_PATH = tmpDb

const request = require('supertest')
const app = require('..')

afterAll(() => {
  try { fs.unlinkSync(tmpDb) } catch {}
})

describe('API basics', () => {
  test('GET / health', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })
})

describe('Trips + Expenses flow', () => {
  let trip
  let expense

  test('POST /trips requires name', async () => {
    const res = await request(app).post('/trips').send({})
    expect(res.status).toBe(400)
  })

  test('POST /trips creates with defaults', async () => {
    const res = await request(app).post('/trips').send({ name: 'Hangzhou' })
    expect(res.status).toBe(201)
    trip = res.body
    expect(trip.name).toBe('Hangzhou')
    expect(trip.base_currency).toBe('SGD')
    expect(trip.spend_currency).toBe('SGD')
    expect(trip.fx_rate).toBe(1)
    expect(trip.p1_name).toBe('Yixiang')
    expect(trip.p2_name).toBe('Tracy')
  })

  test('GET /trips lists with total_base 0', async () => {
    const res = await request(app).get('/trips')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    const found = res.body.find(t => t.id === trip.id)
    expect(found).toBeTruthy()
    expect(Number(found.total_base)).toBe(0)
  })

  test('POST /trips/:id/expenses uses trip defaults', async () => {
    const res = await request(app)
      .post(`/trips/${trip.id}/expenses`)
      .send({ description: 'Lunch', amount: 100 })
    expect(res.status).toBe(201)
    expense = res.body
    expect(expense.currency).toBe('SGD')
    expect(expense.fx_rate).toBe(1)
    expect(Number(expense.amount_base)).toBe(100)
  })

  test('PATCH /trips/:id updates currency/fx and recomputes expenses', async () => {
    const res = await request(app)
      .patch(`/trips/${trip.id}`)
      .send({ spend_currency: 'rmb', fx_rate: 5 })
    expect(res.status).toBe(200)
    expect(res.body.spend_currency).toBe('RMB')
    expect(Number(res.body.fx_rate)).toBe(5)

    const e = await request(app).get(`/trips/${trip.id}/expenses`)
    expect(e.status).toBe(200)
    const updated = e.body.find(x => x.id === expense.id)
    expect(updated.currency).toBe('RMB')
    expect(Number(updated.amount_base)).toBe(500)
  })

  test('GET /trips/:id/summary computes per person share', async () => {
    const res = await request(app).get(`/trips/${trip.id}/summary`)
    expect(res.status).toBe(200)
    expect(res.body.base_currency).toBe('SGD')
    expect(Number(res.body.total_included_base)).toBe(500)
    expect(Number(res.body.per_person_share)).toBe(250)
  })

  test('PUT /expenses/:id toggle excluded', async () => {
    const res = await request(app)
      .put(`/expenses/${expense.id}`)
      .send({ excluded: 1 })
    expect(res.status).toBe(200)
    expect(Number(res.body.excluded)).toBe(1)
  })

  test('DELETE /expenses/:id and /trips/:id', async () => {
    const delE = await request(app).delete(`/expenses/${expense.id}`)
    expect(delE.status).toBe(200)
    const delT = await request(app).delete(`/trips/${trip.id}`)
    expect(delT.status).toBe(200)
  })
})

