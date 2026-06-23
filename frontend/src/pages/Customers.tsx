import { useState, useEffect } from 'react'
import { Search, MessageCircle, Phone, Star, History, Plus, ChevronRight, Gift, Loader2 } from 'lucide-react'
import { api } from '../api'

interface Customer {
  id: number
  name: string
  phone: string
  mobile: string
  balance: number
  points: number
  discountPercent: number
  totalPurchases: number
  lastVisit: string
}

interface Invoice {
  invoiceId: number
  date: string
  totalAmount: number
  discount: number
  netAmount: number
  paymentType: string
}

function getTier(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (points > 3000) return 'platinum'
  if (points > 1000) return 'gold'
  if (points > 500) return 'silver'
  return 'bronze'
}

const tierConfig = {
  bronze: { color: '#cd7f32', bg: 'rgba(205,127,50,0.15)', label: 'Bronze' },
  silver: { color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', label: 'Silver' },
  gold: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Gold' },
  platinum: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', label: 'Platinum' },
}

function sendWhatsApp(mobile: string, name: string) {
  const msg = encodeURIComponent(`مرحباً ${name}! 🌟\nشكراً لتعاملك مع صيدلية ProCare.\nنقاطك الحالية: سارية المفعول\nنتمنى لك دوام الصحة والعافية! 💊`)
  window.open(`https://wa.me/2${mobile.replace(/^0/, '')}?text=${msg}`, '_blank')
}

export default function Customers() {
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const res = await api.customers.search(search)
        setCustomers(res)
      } catch (err) {
        console.error('Failed to fetch customers', err)
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }
    const timeoutId = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    if (selected) {
      const fetchInvoices = async () => {
        setInvoicesLoading(true)
        try {
          const res = await api.customers.getInvoices(selected.id)
          setInvoices(res)
        } catch (err) {
          console.error('Failed to fetch invoices', err)
          setInvoices([])
        } finally {
          setInvoicesLoading(false)
        }
      }
      fetchInvoices()
    } else {
      setInvoices([])
    }
  }, [selected])

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 128px)' }}>
      {/* ---- Left: Customer List ---- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">Customers</h1>
            <p className="page-subtitle">1,197 customers · loyalty · WhatsApp</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Customer
          </button>
        </div>

        <div className="search-bar">
          <Search size={15} style={{ color: '#475569' }} />
          <input placeholder="Search by name, phone, mobile..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" color="#60a5fa" /></div>
          ) : customers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No customers found</div>
          ) : (
            customers.map(c => {
              const tier = getTier(c.points || 0)
              const tc = tierConfig[tier]
              const isSelected = selected?.id === c.id
              return (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  style={{
                    background: isSelected ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                    transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${tc.color}, #0f172a)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1rem', color: '#fff',
                  }}>
                    {c.name ? c.name[0].toUpperCase() : '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                      <span style={{ background: tc.bg, color: tc.color, borderRadius: 6, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{tc.label}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#475569' }}>📱 {c.mobile || c.phone || 'No phone'} · Last Visit {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>⭐ {(c.points || 0).toLocaleString()} pts</p>
                    <p style={{ fontSize: '0.72rem', color: c.balance < 0 ? '#f87171' : c.balance > 0 ? '#34d399' : '#475569', marginTop: 2 }}>
                      {c.balance !== 0 ? `${c.balance > 0 ? '+' : ''}${c.balance} EGP` : 'Settled'}
                    </p>
                  </div>
                  <ChevronRight size={15} color="#334155" />
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ---- Right: Customer Detail ---- */}
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {selected ? (
          <>
            <div className="glass-card" style={{ padding: 22 }}>
              {(() => {
                const tier = getTier(selected.points || 0)
                const tc = tierConfig[tier]
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${tc.color}, #0f172a)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.4rem', color: '#fff',
                        boxShadow: `0 0 20px ${tc.color}44`,
                      }}>{selected.name ? selected.name[0].toUpperCase() : '?'}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{selected.name}</h3>
                        <span style={{ background: tc.bg, color: tc.color, borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                          ⭐ {tc.label} Member
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      {[
                        { label: 'Points', value: (selected.points || 0).toLocaleString(), icon: '⭐', color: '#fbbf24' },
                        { label: 'Discount', value: `${selected.discountPercent || 0}%`, icon: '🏷️', color: '#34d399' },
                        { label: 'Total Spent', value: `${((selected.totalPurchases || 0) / 1000).toFixed(1)}K EGP`, icon: '💰', color: '#60a5fa' },
                        { label: 'Balance', value: `${selected.balance || 0} EGP`, icon: '📊', color: selected.balance < 0 ? '#f87171' : '#34d399' },
                      ].map(s => (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 12px' }}>
                          <p style={{ fontSize: '0.72rem', color: '#475569', marginBottom: 4 }}>{s.icon} {s.label}</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Contact */}
                    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selected.mobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                          <Phone size={14} color="#475569" />
                          <span style={{ fontSize: '0.85rem', color: '#94a3b8', flex: 1 }}>{selected.mobile}</span>
                          <button
                            onClick={() => sendWhatsApp(selected.mobile, selected.name)}
                            style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#25d366', fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            <MessageCircle size={13} /> WhatsApp
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Points Redemption */}
                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Gift size={18} color="#fbbf24" />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>Redeem Points</p>
                        <p style={{ fontSize: '0.72rem', color: '#475569' }}>
                          {selected.points} pts = {(selected.points / 100).toFixed(2)} EGP discount
                        </p>
                      </div>
                      <button className="btn btn-sm" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>Redeem</button>
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Purchase History */}
            <div className="glass-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={16} color="#475569" />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Recent Invoices</h3>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {invoicesLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Loader2 className="spin" color="#60a5fa" /></div>
                ) : invoices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No invoices found</div>
                ) : (
                  invoices.map(h => (
                    <div key={h.invoiceId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <History size={15} color="#60a5fa" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>INV-{h.invoiceId}</p>
                        <p style={{ fontSize: '0.72rem', color: '#475569' }}>{new Date(h.date).toLocaleDateString()} · {h.paymentType}</p>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#60a5fa' }}>{h.netAmount} EGP</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '2rem' }}>👥</p>
            <p style={{ color: '#334155', fontSize: '0.9rem' }}>Select a customer to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
