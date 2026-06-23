import { useState } from 'react'
import { Search, CornerUpLeft, FileText, CheckCircle, AlertTriangle } from 'lucide-react'

const MOCK_INVOICES: any = {
  'INV-8820': {
    date: '2026-06-23',
    customer: 'Ahmed Mohamed',
    total: 120.5,
    items: [
      { id: 1, name: 'Paracetamol 500mg', price: 5, qty: 2, returnedQty: 0 },
      { id: 2, name: 'Augmentin 625mg', price: 28, qty: 1, returnedQty: 0 },
      { id: 3, name: 'Vitamin D3', price: 22, qty: 3, returnedQty: 0 },
    ]
  }
}

export default function SalesReturn() {
  const [search, setSearch] = useState('')
  const [invoice, setInvoice] = useState<any>(null)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (MOCK_INVOICES[search]) {
      setInvoice(MOCK_INVOICES[search])
      setError('')
    } else {
      setInvoice(null)
      setError('Invoice not found. Please check the number.')
    }
  }

  const updateReturnQty = (id: number, returnQty: number) => {
    if (!invoice) return
    const newItems = invoice.items.map((i: any) => {
      if (i.id === id) {
        return { ...i, returnedQty: Math.min(Math.max(0, returnQty), i.qty) }
      }
      return i
    })
    setInvoice({ ...invoice, items: newItems })
  }

  const returnTotal = invoice?.items.reduce((sum: number, i: any) => sum + (i.price * i.returnedQty), 0) || 0

  const handleProcessReturn = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setInvoice(null)
      setSearch('')
    }, 2500)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Return</h1>
          <p className="page-subtitle">Process returns for items sold previously</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
          <div className="search-bar" style={{ flex: 1, margin: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
            <FileText size={16} color="#60a5fa" />
            <input 
              placeholder="Enter Invoice Number (e.g. INV-8820)" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ fontSize: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>Search</button>
        </form>
        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> {error}</p>}
      </div>

      {/* Invoice Details */}
      {invoice && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Invoice: {search}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>Customer: {invoice.customer} · Date: {invoice.date}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 4 }}>Original Total</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa' }}>{invoice.total.toFixed(2)} EGP</p>
            </div>
          </div>

          <table className="data-table" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Purchased Qty</th>
                <th>Return Qty</th>
                <th>Refund Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: '#cbd5e1' }}>{item.name}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.qty}</td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max={item.qty} 
                      value={item.returnedQty} 
                      onChange={e => updateReturnQty(item.id, Number(e.target.value))}
                      style={{ width: 80, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '0.9rem' }}
                    />
                  </td>
                  <td style={{ fontWeight: 700, color: '#ef4444' }}>{(item.price * item.returnedQty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4 }}>Total Refund Due</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{returnTotal.toFixed(2)} EGP</p>
            </div>
            <button className="btn btn-primary" onClick={handleProcessReturn} disabled={returnTotal === 0} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '1rem' }}>
              <CornerUpLeft size={18} /> Process Return
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 300, background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: 16, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 0 40px rgba(16,185,129,0.5)' }}>
          <CheckCircle size={28} color="#fff" />
          <div>
            <p style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Return Processed</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>Stock updated & refund recorded.</p>
          </div>
        </div>
      )}
    </div>
  )
}
