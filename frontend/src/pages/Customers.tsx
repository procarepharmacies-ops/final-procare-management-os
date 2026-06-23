import { useState } from 'react'
import { Search, MessageCircle, Phone, Star, History, Plus, ChevronRight, Gift } from 'lucide-react'

interface Customer {
  id: number
  name: string
  phone: string
  mobile: string
  balance: number
  points: number
  discPercent: number
  totalSpent: number
  lastVisit: string
  invoices: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Ahmed Mohamed Hassan', phone: '02-27651234', mobile: '01012345678', balance: -250, points: 1840, discPercent: 10, totalSpent: 18400, lastVisit: '2026-06-22', invoices: 84, tier: 'gold' },
  { id: 2, name: 'Sara Ibrahim Ali', phone: '', mobile: '01198765432', balance: 0, points: 620, discPercent: 5, totalSpent: 6200, lastVisit: '2026-06-20', invoices: 31, tier: 'silver' },
  { id: 3, name: 'Omar Khaled Nour', phone: '03-5551234', mobile: '01234567890', balance: 500, points: 4200, discPercent: 15, totalSpent: 42000, lastVisit: '2026-06-23', invoices: 187, tier: 'platinum' },
  { id: 4, name: 'Mona Samir Tawfik', phone: '', mobile: '01556789012', balance: 0, points: 230, discPercent: 0, totalSpent: 2300, lastVisit: '2026-06-10', invoices: 12, tier: 'bronze' },
  { id: 5, name: 'Karim Youssef Farag', phone: '02-38884321', mobile: '01098765432', balance: -150, points: 980, discPercent: 8, totalSpent: 9800, lastVisit: '2026-06-18', invoices: 46, tier: 'silver' },
  { id: 6, name: 'Dina Mostafa Saleh', phone: '', mobile: '01155443322', balance: 200, points: 3100, discPercent: 12, totalSpent: 31000, lastVisit: '2026-06-22', invoices: 142, tier: 'gold' },
]

const MOCK_HISTORY = [
  { id: 'INV-4821', date: '2026-06-22', items: 5, total: 284 },
  { id: 'INV-4756', date: '2026-06-15', items: 3, total: 127 },
  { id: 'INV-4698', date: '2026-06-08', items: 8, total: 412 },
  { id: 'INV-4621', date: '2026-05-30', items: 2, total: 89 },
]

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
  const [selected, setSelected] = useState<Customer | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.phone.includes(search)
  )

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
          {filtered.map(c => {
            const tc = tierConfig[c.tier]
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
                  {c.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <span style={{ background: tc.bg, color: tc.color, borderRadius: 6, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{tc.label}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>📱 {c.mobile} · {c.invoices} invoices</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>⭐ {c.points.toLocaleString()} pts</p>
                  <p style={{ fontSize: '0.72rem', color: c.balance < 0 ? '#f87171' : c.balance > 0 ? '#34d399' : '#475569', marginTop: 2 }}>
                    {c.balance !== 0 ? `${c.balance > 0 ? '+' : ''}${c.balance} EGP` : 'Settled'}
                  </p>
                </div>
                <ChevronRight size={15} color="#334155" />
              </div>
            )
          })}
        </div>
      </div>

      {/* ---- Right: Customer Detail ---- */}
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {selected ? (
          <>
            {/* Profile Card */}
            <div className="glass-card" style={{ padding: 22 }}>
              {(() => {
                const tc = tierConfig[selected.tier]
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${tc.color}, #0f172a)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.4rem', color: '#fff',
                        boxShadow: `0 0 20px ${tc.color}44`,
                      }}>{selected.name[0]}</div>
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
                        { label: 'Points', value: selected.points.toLocaleString(), icon: '⭐', color: '#fbbf24' },
                        { label: 'Discount', value: `${selected.discPercent}%`, icon: '🏷️', color: '#34d399' },
                        { label: 'Total Spent', value: `${(selected.totalSpent / 1000).toFixed(1)}K EGP`, icon: '💰', color: '#60a5fa' },
                        { label: 'Balance', value: `${selected.balance} EGP`, icon: '📊', color: selected.balance < 0 ? '#f87171' : '#34d399' },
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
                {MOCK_HISTORY.map(h => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <History size={15} color="#60a5fa" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>{h.id}</p>
                      <p style={{ fontSize: '0.72rem', color: '#475569' }}>{h.date} · {h.items} items</p>
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#60a5fa' }}>{h.total} EGP</span>
                  </div>
                ))}
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
