import express from 'express'
import cors from 'cors'
import sql from 'mssql'

const app = express()
app.use(cors())
app.use(express.json())

// ─── Mashala DB Config ──────────────────────────────────────────────────────
const dbConfig: sql.config = {
  server: '192.168.1.2',
  database: 'stock',
  user: 'ahmedibrahim',
  password: 'Ahmedibrahim@123',
  options: { encrypt: false, trustServerCertificate: true },
  requestTimeout: 15000,
}

let pool: sql.ConnectionPool | null = null
async function getPool() {
  if (!pool || !pool.connected) {
    pool = await sql.connect(dbConfig)
  }
  return pool
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    const p = await getPool()
    await p.request().query('SELECT 1')
    res.json({ status: 'connected', server: '192.168.1.2', database: 'stock', ts: new Date().toISOString() })
  } catch (e: any) {
    res.status(503).json({ status: 'disconnected', error: e.message })
  }
})

// ─── Products ────────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const p = await getPool()
    const search = req.query.q as string || ''
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    const result = await p.request()
      .input('search', sql.NVarChar, `%${search}%`)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT id, nameAr, nameEn, sellPrice, buyPrice, stock, barcode,
               groupId, companyId, active, discountPercent, minStockLevel,
               expiryDate
        FROM items
        WHERE (nameEn LIKE @search OR nameAr LIKE @search OR barcode LIKE @search)
          AND active = 1
        ORDER BY nameEn
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `)
    res.json({ data: result.recordset, page, limit })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await getPool()
    const result = await p.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM items WHERE id = @id')
    res.json(result.recordset[0] || null)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Customers ───────────────────────────────────────────────────────────────
app.get('/api/customers', async (req, res) => {
  try {
    const p = await getPool()
    const search = req.query.q as string || ''
    const result = await p.request()
      .input('search', sql.NVarChar, `%${search}%`)
      .query(`
        SELECT TOP 100 id, name, phone, mobile, balance,
                       discountPercent, totalPurchases, lastVisit, points
        FROM customers
        WHERE name LIKE @search OR mobile LIKE @search OR phone LIKE @search
        ORDER BY lastVisit DESC
      `)
    res.json(result.recordset)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/customers/:id/invoices', async (req, res) => {
  try {
    const p = await getPool()
    const result = await p.request()
      .input('customerId', sql.Int, req.params.id)
      .query(`
        SELECT TOP 20 invoiceId, date, totalAmount, discount, netAmount, paymentType
        FROM invoices
        WHERE customerId = @customerId
        ORDER BY date DESC
      `)
    res.json(result.recordset)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
app.get('/api/dashboard/stats', async (_req, res) => {
  try {
    const p = await getPool()
    const today = new Date().toISOString().split('T')[0]

    const [todaySales, invoiceCount, lowStock, expiring] = await Promise.all([
      p.request()
        .input('date', sql.Date, today)
        .query(`SELECT ISNULL(SUM(netAmount), 0) AS total FROM invoices WHERE CAST(date AS DATE) = @date`),
      p.request()
        .input('date', sql.Date, today)
        .query(`SELECT COUNT(*) AS cnt FROM invoices WHERE CAST(date AS DATE) = @date`),
      p.request()
        .query(`SELECT COUNT(*) AS cnt FROM items WHERE stock <= minStockLevel AND active = 1`),
      p.request()
        .query(`SELECT COUNT(*) AS cnt FROM items WHERE expiryDate <= DATEADD(day, 30, GETDATE()) AND stock > 0 AND active = 1`),
    ])

    res.json({
      todayRevenue: todaySales.recordset[0]?.total || 0,
      todayInvoices: invoiceCount.recordset[0]?.cnt || 0,
      lowStockCount: lowStock.recordset[0]?.cnt || 0,
      expiringCount: expiring.recordset[0]?.cnt || 0,
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message, fallback: true })
  }
})

// ─── Sales / Invoices ─────────────────────────────────────────────────────────
app.get('/api/invoices', async (req, res) => {
  try {
    const p = await getPool()
    const date = req.query.date as string || new Date().toISOString().split('T')[0]
    const result = await p.request()
      .input('date', sql.Date, date)
      .query(`
        SELECT TOP 100 i.invoiceId, i.date, i.totalAmount, i.discount, i.netAmount,
               i.paymentType, c.name AS customerName
        FROM invoices i
        LEFT JOIN customers c ON c.id = i.customerId
        WHERE CAST(i.date AS DATE) = @date
        ORDER BY i.date DESC
      `)
    res.json(result.recordset)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/invoices', async (req, res) => {
  const { customerId, items, totalAmount, discount, netAmount, paymentType } = req.body
  try {
    const p = await getPool()
    const t = new sql.Transaction(p)
    await t.begin()
    try {
      const inv = await t.request()
        .input('customerId', sql.Int, customerId || null)
        .input('totalAmount', sql.Decimal(18, 2), totalAmount)
        .input('discount', sql.Decimal(18, 2), discount || 0)
        .input('netAmount', sql.Decimal(18, 2), netAmount)
        .input('paymentType', sql.NVarChar, paymentType || 'cash')
        .query(`
          INSERT INTO invoices (customerId, date, totalAmount, discount, netAmount, paymentType)
          OUTPUT INSERTED.invoiceId
          VALUES (@customerId, GETDATE(), @totalAmount, @discount, @netAmount, @paymentType)
        `)
      const invoiceId = inv.recordset[0].invoiceId
      for (const item of items) {
        await t.request()
          .input('invoiceId', sql.Int, invoiceId)
          .input('itemId', sql.Int, item.id)
          .input('qty', sql.Int, item.qty)
          .input('price', sql.Decimal(18, 2), item.price)
          .input('disc', sql.Decimal(5, 2), item.disc || 0)
          .query(`INSERT INTO invoiceDetails (invoiceId, itemId, qty, sellPrice, discount) VALUES (@invoiceId, @itemId, @qty, @price, @disc)`)
        await t.request()
          .input('itemId', sql.Int, item.id)
          .input('qty', sql.Int, item.qty)
          .query(`UPDATE items SET stock = stock - @qty WHERE id = @itemId`)
      }
      await t.commit()
      res.json({ success: true, invoiceId })
    } catch (e) {
      await t.rollback()
      throw e
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── Employees ────────────────────────────────────────────────────────────────
app.get('/api/employees', async (_req, res) => {
  try {
    const p = await getPool()
    const result = await p.request().query(`
      SELECT id, name, role, phone, salary, active, branchId
      FROM employees
      ORDER BY name
    `)
    res.json(result.recordset)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`✅ ProCare API running on http://localhost:${PORT}`))
