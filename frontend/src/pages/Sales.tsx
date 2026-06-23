import { useState, useRef, useEffect } from 'react'
import { Search, Trash2, Plus, Minus, Printer, MessageCircle, Pill, CreditCard, Banknote, X, CheckCircle } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  nameAr: string
  price: number
  qty: number
  disc: number
  barcode: string
  company: string
}

interface SubstituteSuggestion {
  id: number
  name: string
  nameAr: string
  price: number
  disc: number
  saving: number
  activeIngredient: string
}

const MOCK_PRODUCTS: CartItem[] = [
  { id: 1, name: 'Paracetamol 500mg', nameAr: 'باراسيتامول', price: 5, qty: 1, disc: 0, barcode: '6221064020043', company: 'Pharco' },
  { id: 2, name: 'Augmentin 625mg Tab', nameAr: 'أوجمنتين', price: 28, qty: 1, disc: 0, barcode: '6221064020044', company: 'GSK' },
  { id: 3, name: 'Brufen 400mg', nameAr: 'بروفين', price: 15, qty: 1, disc: 0, barcode: '6221064020045', company: 'Knoll' },
  { id: 4, name: 'Omega 3 Caps 1000mg', nameAr: 'أوميجا 3', price: 45, qty: 1, disc: 0, barcode: '6221064020046', company: 'Amoun' },
  { id: 5, name: 'Vitamin D3 1000 IU', nameAr: 'فيتامين د3', price: 22, qty: 1, disc: 10, barcode: '6221064020047', company: 'EVA' },
  { id: 6, name: 'Amoxicillin 500mg', nameAr: 'أموكسيسيلين', price: 18, qty: 1, disc: 5, barcode: '6221064020048', company: 'Pharco' },
  { id: 7, name: 'Metformin 500mg', nameAr: 'ميتفورمين', price: 12, qty: 1, disc: 0, barcode: '6221064020049', company: 'EPICO' },
]

// Titan substitution suggestions (mocked from parsed .phy data)
const SUBSTITUTES: Record<string, SubstituteSuggestion[]> = {
  '2': [
    { id: 101, name: 'Amoxiclav 625mg', nameAr: 'أموكسيكلاف', price: 18, disc: 20, saving: 11.6, activeIngredient: 'Amoxicillin + Clavulanate' },
    { id: 102, name: 'Clumentin 625mg', nameAr: 'كلومنتين', price: 22, disc: 15, saving: 6.8, activeIngredient: 'Amoxicillin + Clavulanate' },
  ],
  '3': [
    { id: 103, name: 'Ibuprofen 400mg Generic', nameAr: 'إيبوبروفين', price: 8, disc: 25, saving: 9, activeIngredient: 'Ibuprofen' },
  ],
}

export default function Sales() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [search, setSearch] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'card'|'network'>('cash')
  const [cashPaid, setCashPaid] = useState('')
  const [showSubstitute, setShowSubstitute] = useState<SubstituteSuggestion[] | null>(null)
  const [substituteFor, setSubstituteFor] = useState<CartItem | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)

  // Focus barcode on load
  useEffect(() => { barcodeRef.current?.focus() }, [])

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.nameAr.includes(search) ||
    p.barcode.includes(search)
  )

  const addToCart = (product: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      const newItem = { ...product, qty: 1 }
      // Check for Titan substitution suggestions
      const subs = SUBSTITUTES[String(product.id)]
      if (subs) {
        setSubstituteFor(newItem)
        setShowSubstitute(subs)
      }
      return [...prev, newItem]
    })
    setSearch('')
    setBarcodeInput('')
    barcodeRef.current?.focus()
  }

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = MOCK_PRODUCTS.find(p => p.barcode === barcodeInput || p.id === parseInt(barcodeInput))
    if (product) addToCart(product)
    else setBarcodeInput('')
  }

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  const removeItem = (id: number) => setCart(prev => prev.filter(i => i.id !== id))

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty * (1 - i.disc / 100), 0)
  const totalDisc = discountPercent > 0 ? subtotal * discountPercent / 100 : 0
  const total = subtotal - totalDisc
  const change = cashPaid ? Math.max(0, parseFloat(cashPaid) - total) : 0

  const handleCheckout = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setCart([])
      setDiscountPercent(0)
      setCashPaid('')
    }, 2500)
  }

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 128px)' }}>

      {/* ---- Left: Product Finder ---- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">Point of Sale</h1>
            <p className="page-subtitle">Scan barcode or search product</p>
          </div>
        </div>

        {/* Barcode Scanner Input */}
        <form onSubmit={handleBarcodeSubmit}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="input-with-icon" style={{ flex: 1 }}>
              <Search size={16} className="input-icon" />
              <input
                ref={barcodeRef}
                className="input-field"
                placeholder="🔍 Scan barcode or type product ID..."
                value={barcodeInput}
                onChange={e => { setBarcodeInput(e.target.value); setSearch(e.target.value) }}
                style={{ fontSize: '1rem', padding: '13px 14px 13px 44px', borderRadius: 10 }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>

        {/* Product Grid */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {(search ? filteredProducts : MOCK_PRODUCTS).map(p => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '14px 12px', cursor: 'pointer',
                  transition: 'all 0.18s', position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.12)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                {p.disc > 0 && (
                  <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(16,185,129,0.2)', color: '#34d399', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>
                    -{p.disc}%
                  </span>
                )}
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 4, lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ fontSize: '0.72rem', color: '#475569', direction: 'rtl', marginBottom: 8 }}>{p.nameAr}</p>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 6 }}>{p.company}</p>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#60a5fa' }}>{p.price} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>EGP</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Right: Cart & Payment ---- */}
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Cart Items */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>🛒 Cart ({cart.length} items)</h3>
            {cart.length > 0 && <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: '#ef4444' }} onClick={() => setCart([])}>Clear</button>}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#334155' }}>
                <p style={{ fontSize: '2rem', marginBottom: 8 }}>🛍️</p>
                <p>Scan or click a product to add it</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 6px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 600 }}>
                      {(item.price * (1 - item.disc / 100)).toFixed(2)} EGP {item.disc > 0 && <span style={{ color: '#34d399' }}>(-{item.disc}%)</span>}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.07)', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                    <span style={{ width: 24, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.07)', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', minWidth: 52, textAlign: 'right' }}>
                    {(item.price * item.qty * (1 - item.disc / 100)).toFixed(2)}
                  </span>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', padding: 2 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals & Payment */}
        <div className="glass-card" style={{ padding: 16 }}>
          {/* Discount */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', flex: 1 }}>Invoice Discount %</span>
            <input
              type="number" min="0" max="100"
              value={discountPercent || ''}
              onChange={e => setDiscountPercent(Number(e.target.value))}
              className="input-field"
              style={{ width: 70, padding: '6px 10px', textAlign: 'center', fontSize: '0.85rem' }}
            />
          </div>

          {/* Totals */}
          {[
            { label: 'Subtotal', value: subtotal.toFixed(2), color: '#94a3b8' },
            { label: 'Discount', value: `-${totalDisc.toFixed(2)}`, color: '#34d399' },
            { label: 'TOTAL', value: total.toFixed(2), color: '#60a5fa', bold: true },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: r.bold ? '1rem' : '0.82rem', fontWeight: r.bold ? 800 : 400, color: '#475569' }}>{r.label}</span>
              <span style={{ fontSize: r.bold ? '1.2rem' : '0.85rem', fontWeight: r.bold ? 800 : 600, color: r.color }}>{r.value} EGP</span>
            </div>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />

          {/* Payment Method */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[
              { id: 'cash', label: 'Cash', icon: <Banknote size={14} /> },
              { id: 'card', label: 'Card', icon: <CreditCard size={14} /> },
              { id: 'network', label: 'Network', icon: <CreditCard size={14} /> },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as any)}
                className={paymentMethod === m.id ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {/* Cash Paid */}
          {paymentMethod === 'cash' && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cash Paid</span>
                <input
                  type="number"
                  value={cashPaid}
                  onChange={e => setCashPaid(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                  style={{ flex: 1, padding: '7px 12px', fontSize: '0.9rem' }}
                />
              </div>
              {change > 0 && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#34d399' }}>Change</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>{change.toFixed(2)} EGP</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
              <MessageCircle size={14} /> WhatsApp
            </button>
            <button className="btn btn-ghost btn-sm">
              <Printer size={14} />
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              ✓ Checkout {total > 0 ? `(${total.toFixed(0)} EGP)` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Titan Substitution Modal ---- */}
      {showSubstitute && substituteFor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }} onClick={() => setShowSubstitute(null)}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20,
            padding: 28, maxWidth: 460, width: '90%', boxShadow: '0 0 60px rgba(139,92,246,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>💊 Titan Drug Substitution</h3>
                <p style={{ fontSize: '0.78rem', color: '#475569' }}>Cheaper alternatives for <span style={{ color: '#a78bfa' }}>{substituteFor.name}</span></p>
              </div>
              <button onClick={() => setShowSubstitute(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {showSubstitute.map(s => (
              <div key={s.id} style={{
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{s.name}</p>
                  <p style={{ fontSize: '0.72rem', color: '#8b5cf6', marginTop: 2 }}>⚗️ {s.activeIngredient}</p>
                  <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>{s.disc}% discount · Save {s.saving.toFixed(1)} EGP</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#a78bfa' }}>{(s.price * (1 - s.disc / 100)).toFixed(2)}</p>
                  <p style={{ fontSize: '0.7rem', color: '#475569', textDecoration: 'line-through' }}>{s.price} EGP</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  addToCart({ id: s.id, name: s.name, nameAr: s.nameAr, price: s.price, qty: 1, disc: s.disc, barcode: String(s.id), company: 'Generic' })
                  setShowSubstitute(null)
                }}>Use</button>
              </div>
            ))}

            <button className="btn btn-ghost btn-full" style={{ marginTop: 4 }} onClick={() => setShowSubstitute(null)}>
              Keep Original ({substituteFor.name})
            </button>
          </div>
        </div>
      )}

      {/* ---- Success Toast ---- */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 300,
          background: 'linear-gradient(135deg,#059669,#10b981)',
          borderRadius: 16, padding: '20px 28px',
          boxShadow: '0 0 40px rgba(16,185,129,0.5)',
          display: 'flex', alignItems: 'center', gap: 12,
          animation: 'fadeIn 0.3s ease',
        }}>
          <CheckCircle size={28} color="#fff" />
          <div>
            <p style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Invoice Complete!</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>Total: {total.toFixed(2)} EGP · Change: {change.toFixed(2)} EGP</p>
          </div>
        </div>
      )}
    </div>
  )
}
