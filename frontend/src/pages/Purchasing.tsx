import { useState } from 'react'
import { Search, Plus, Minus, Trash2, Truck, FileText, CheckCircle } from 'lucide-react'

interface PurchaseItem {
  id: number
  name: string
  nameAr: string
  buyPrice: number
  qty: number
  bonus: number
  expiryDate: string
}

const MOCK_SUPPLIERS = [
  { id: 1, name: 'Ibnsina Pharma' },
  { id: 2, name: 'United Pharmacists' },
  { id: 3, name: 'Multipharma' },
  { id: 4, name: 'PharmaOverseas' },
]

const MOCK_PRODUCTS = [
  { id: 1, name: 'Paracetamol 500mg', nameAr: 'باراسيتامول', buyPrice: 3.5, stock: 45 },
  { id: 2, name: 'Augmentin 625mg Tab', nameAr: 'أوجمنتين', buyPrice: 21.0, stock: 12 },
  { id: 3, name: 'Brufen 400mg', nameAr: 'بروفين', buyPrice: 11.2, stock: 80 },
  { id: 4, name: 'Omega 3 Caps 1000mg', nameAr: 'أوميجا 3', buyPrice: 33.5, stock: 25 },
]

export default function Purchasing() {
  const [cart, setCart] = useState<PurchaseItem[]>([])
  const [search, setSearch] = useState('')
  const [supplierId, setSupplierId] = useState(MOCK_SUPPLIERS[0].id)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredProducts = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search))

  const addToCart = (product: any) => {
    setCart(prev => {
      if (prev.find(i => i.id === product.id)) return prev
      return [...prev, { ...product, qty: 10, bonus: 0, expiryDate: '2027-12-31' }]
    })
    setSearch('')
  }

  const updateItem = (id: number, field: keyof PurchaseItem, value: any) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const removeItem = (id: number) => setCart(prev => prev.filter(i => i.id !== id))

  const total = cart.reduce((sum, item) => sum + (item.buyPrice * item.qty), 0)

  const handleSave = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setCart([])
      setInvoiceNumber('')
    }, 2500)
  }

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 128px)' }}>
      {/* Left: Supplier & Cart */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">Purchasing / Intake</h1>
            <p className="page-subtitle">Record incoming stock from suppliers</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 16, display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Supplier</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px' }}>
              <Truck size={16} color="#60a5fa" />
              <select 
                value={supplierId} 
                onChange={e => setSupplierId(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#f8fafc', width: '100%', outline: 'none', fontSize: '0.9rem' }}
              >
                {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Supplier Invoice #</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px' }}>
              <FileText size={16} color="#60a5fa" />
              <input 
                type="text" 
                placeholder="e.g. INV-84920" 
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#f8fafc', width: '100%', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* Cart Table */}
        <div className="glass-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Buy Price</th>
                  <th>Qty</th>
                  <th>Bonus</th>
                  <th>Expiry</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No items added yet. Search on the right.</td></tr>
                ) : (
                  cart.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.nameAr}</div>
                      </td>
                      <td>
                        <input type="number" value={item.buyPrice} onChange={e => updateItem(item.id, 'buyPrice', Number(e.target.value))} style={{ width: 70, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: 6 }} />
                      </td>
                      <td>
                        <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} style={{ width: 60, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: 6 }} />
                      </td>
                      <td>
                        <input type="number" value={item.bonus} onChange={e => updateItem(item.id, 'bonus', Number(e.target.value))} style={{ width: 60, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: 6 }} />
                      </td>
                      <td>
                        <input type="date" value={item.expiryDate} onChange={e => updateItem(item.id, 'expiryDate', e.target.value)} style={{ width: 120, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: 6 }} />
                      </td>
                      <td style={{ fontWeight: 700, color: '#60a5fa' }}>{(item.buyPrice * item.qty).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Invoice Amount: </span>
              <span style={{ color: '#34d399', fontSize: '1.4rem', fontWeight: 800 }}>{total.toFixed(2)} EGP</span>
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={cart.length === 0}>
              <CheckCircle size={16} /> Save & Update Stock
            </button>
          </div>
        </div>
      </div>

      {/* Right: Product Search */}
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="search-bar">
          <Search size={16} style={{ color: '#475569' }} />
          <input placeholder="Search product to add..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Plus size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{p.name}</p>
                <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Stock: {p.stock} · Buy: {p.buyPrice} EGP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 300, background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: 16, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 0 40px rgba(16,185,129,0.5)' }}>
          <CheckCircle size={28} color="#fff" />
          <div>
            <p style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Stock Intake Saved!</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>Inventory has been updated.</p>
          </div>
        </div>
      )}
    </div>
  )
}
