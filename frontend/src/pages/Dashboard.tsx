import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, ShoppingCart, Package, Users, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const salesData = [
  { day: 'Mon', sales: 12400, purchases: 4200 },
  { day: 'Tue', sales: 15800, purchases: 5100 },
  { day: 'Wed', sales: 11200, purchases: 3800 },
  { day: 'Thu', sales: 18900, purchases: 6200 },
  { day: 'Fri', sales: 22100, purchases: 7400 },
  { day: 'Sat', sales: 29400, purchases: 9100 },
  { day: 'Sun', sales: 16700, purchases: 5600 },
]

const topProducts = [
  { name: 'Panadol 500mg', sales: 842, revenue: '4,210 EGP' },
  { name: 'Augmentin 625mg', sales: 634, revenue: '12,680 EGP' },
  { name: 'Brufen 400mg', sales: 521, revenue: '3,126 EGP' },
  { name: 'Omega 3 Caps', sales: 487, revenue: '9,740 EGP' },
  { name: 'Vitamin D3 1000', sales: 413, revenue: '6,195 EGP' },
]

const alerts = [
  { type: 'danger', msg: '14 products near expiry (< 30 days)' },
  { type: 'warning', msg: '8 products below minimum stock level' },
  { type: 'info', msg: 'Inter-branch order #4821 pending approval' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background:'rgba(15,23,42,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px', fontSize:'0.82rem' }}>
        <p style={{ color:'#94a3b8', marginBottom:6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontWeight:600 }}>
            {p.name === 'sales' ? '💰' : '📦'} {p.name}: {Number(p.value).toLocaleString()} EGP
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, Admin 👋</h1>
          <p className="page-subtitle">Here's what's happening at Elsanta branch today</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <ShoppingCart size={15} /> New Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Today's Revenue", value: "29,400", unit: "EGP", change: "+18.2%", up: true, color: "blue", icon: <TrendingUp size={48} /> },
          { label: "Invoices Today", value: "184", unit: "bills", change: "+12 vs yesterday", up: true, color: "green", icon: <ShoppingCart size={48} /> },
          { label: "Products Sold", value: "1,247", unit: "units", change: "-3.1%", up: false, color: "amber", icon: <Package size={48} /> },
          { label: "Active Customers", value: "1,197", unit: "total", change: "+5 this week", up: true, color: "purple", icon: <Users size={48} /> },
        ].map(c => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <div className="stat-icon">{c.icon}</div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value} <span style={{ fontSize:'0.9rem', fontWeight:400, color:'var(--text-muted)' }}>{c.unit}</span></div>
            <div className={`stat-change ${c.up ? 'up' : 'down'}`}>
              {c.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {c.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Sales Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#f8fafc' }}>Weekly Sales Overview</h3>
              <p style={{ fontSize:'0.78rem', color:'#475569', marginTop:2 }}>Sales vs Purchases this week</p>
            </div>
            <span className="badge badge-success">↑ Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="url(#colorSales)" strokeWidth={2} />
              <Area type="monotone" dataKey="purchases" stroke="#06b6d4" fill="url(#colorPurch)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#f8fafc', marginBottom:20 }}>Top Selling Products</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {topProducts.map((p, i) => (
              <div key={p.name} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:28, height:28, borderRadius:8, flexShrink:0,
                  background:`linear-gradient(135deg, ${['#2563eb','#06b6d4','#10b981','#f59e0b','#8b5cf6'][i]}, transparent)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.75rem', fontWeight:700, color:'#fff',
                }}>{i + 1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'0.85rem', fontWeight:500, color:'#cbd5e1', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize:'0.72rem', color:'#475569' }}>{p.sales} units sold</p>
                </div>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'#60a5fa', flexShrink:0 }}>{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <AlertCircle size={18} color="#f59e0b" />
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#f8fafc' }}>System Alerts</h3>
          <span className="badge badge-warning" style={{ marginLeft:'auto' }}>{alerts.length} alerts</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
              borderRadius:8, fontSize:'0.85rem',
              background: a.type==='danger' ? 'rgba(239,68,68,0.08)' : a.type==='warning' ? 'rgba(245,158,11,0.08)' : 'rgba(37,99,235,0.08)',
              border: `1px solid ${a.type==='danger' ? 'rgba(239,68,68,0.2)' : a.type==='warning' ? 'rgba(245,158,11,0.2)' : 'rgba(37,99,235,0.2)'}`,
              color: a.type==='danger' ? '#f87171' : a.type==='warning' ? '#fbbf24' : '#60a5fa',
            }}>
              <AlertCircle size={15} /> {a.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
