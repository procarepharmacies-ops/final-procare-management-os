import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react'

const monthlySales = [
  { month: 'Jan', revenue: 142000, target: 130000 },
  { month: 'Feb', revenue: 128000, target: 130000 },
  { month: 'Mar', revenue: 168000, target: 150000 },
  { month: 'Apr', revenue: 154000, target: 150000 },
  { month: 'May', revenue: 192000, target: 170000 },
  { month: 'Jun', revenue: 175000, target: 180000 },
]

const categoryBreakdown = [
  { name: 'Antibiotics', value: 32, color: '#2563eb' },
  { name: 'Vitamins', value: 24, color: '#10b981' },
  { name: 'Analgesics', value: 18, color: '#f59e0b' },
  { name: 'Cardio', value: 14, color: '#8b5cf6' },
  { name: 'Diabetes', value: 12, color: '#06b6d4' },
]

const forecast = [
  { month: 'Jul', predicted: 198000, lower: 182000, upper: 214000 },
  { month: 'Aug', predicted: 211000, lower: 193000, upper: 229000 },
  { month: 'Sep', predicted: 224000, lower: 204000, upper: 244000 },
]

const aiInsights = [
  { icon: <TrendingUp size={18} color="#10b981" />, type: 'opportunity', text: 'Augmentin 625mg demand up 34% — consider stocking 150 extra boxes before next week' },
  { icon: <AlertTriangle size={18} color="#f59e0b" />, type: 'warning', text: '14 products expire within 30 days — estimated loss 4,200 EGP if not sold' },
  { icon: <TrendingDown size={18} color="#ef4444" />, type: 'risk', text: 'Vitamin D3 sales down 18% — 3 competitors nearby may be offering lower price' },
  { icon: <Zap size={18} color="#8b5cf6" />, type: 'action', text: 'Friday peak hours 5PM–8PM — schedule 2 extra staff for optimal coverage' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background:'rgba(15,23,42,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px', fontSize:'0.8rem' }}>
        <p style={{ color:'#94a3b8', marginBottom:6, fontWeight:600 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color || p.stroke, fontWeight:600, marginBottom:2 }}>
            {p.name}: {Number(p.value).toLocaleString()} EGP
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Analytics</h1>
          <p className="page-subtitle">Predictive insights powered by your live Mashala database</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:10, padding:'8px 14px' }}>
          <Brain size={16} color="#a78bfa" />
          <span style={{ fontSize:'0.82rem', color:'#a78bfa', fontWeight:600 }}>Gemini AI Active</span>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ marginBottom:24 }}>
        <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#94a3b8', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.06em' }}>🤖 AI Insights</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
          {aiInsights.map((ins, i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12,
              transition:'all 0.2s',
            }}>
              <div style={{ flexShrink:0, marginTop:2 }}>{ins.icon}</div>
              <p style={{ fontSize:'0.82rem', color:'#94a3b8', lineHeight:1.5 }}>{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom:24 }}>
        {/* Revenue Chart */}
        <div className="glass-card" style={{ padding:24 }}>
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#f8fafc', marginBottom:4 }}>Monthly Revenue vs Target</h3>
          <p style={{ fontSize:'0.75rem', color:'#475569', marginBottom:20 }}>2026 performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#334155" tick={{ fill:'#475569', fontSize:11 }} />
              <YAxis stroke="#334155" tick={{ fill:'#475569', fontSize:10 }} tickFormatter={v => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:'0.75rem', color:'#94a3b8' }} />
              <Bar dataKey="revenue" fill="url(#barGrad)" radius={[4,4,0,0]} name="Revenue">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </Bar>
              <Bar dataKey="target" fill="rgba(255,255,255,0.06)" radius={[4,4,0,0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card" style={{ padding:24 }}>
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#f8fafc', marginBottom:4 }}>Sales by Category</h3>
          <p style={{ fontSize:'0.75rem', color:'#475569', marginBottom:16 }}>% of total revenue</p>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
              {categoryBreakdown.map(c => (
                <div key={c.name} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:c.color, flexShrink:0 }} />
                  <span style={{ fontSize:'0.78rem', color:'#94a3b8', flex:1 }}>{c.name}</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:'#f8fafc' }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Forecast */}
      <div className="glass-card" style={{ padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <Brain size={18} color="#8b5cf6" />
          <div>
            <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#f8fafc' }}>3-Month Revenue Forecast</h3>
            <p style={{ fontSize:'0.75rem', color:'#475569' }}>AI prediction based on historical trends & seasonal patterns</p>
          </div>
          <span className="badge badge-purple" style={{ marginLeft:'auto' }}>95% Confidence</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {forecast.map(f => (
            <div key={f.month} style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:12, padding:'16px 18px' }}>
              <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#a78bfa', marginBottom:8 }}>{f.month} 2026</p>
              <p style={{ fontSize:'1.4rem', fontWeight:800, color:'#f8fafc', marginBottom:6 }}>
                {(f.predicted/1000).toFixed(0)}K <span style={{ fontSize:'0.75rem', fontWeight:400, color:'#475569' }}>EGP</span>
              </p>
              <p style={{ fontSize:'0.72rem', color:'#475569' }}>
                Range: {(f.lower/1000).toFixed(0)}K – {(f.upper/1000).toFixed(0)}K EGP
              </p>
              <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4, marginTop:10 }}>
                <div style={{ height:'100%', width:`${(f.predicted-f.lower)/(f.upper-f.lower)*100}%`, background:'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius:4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
