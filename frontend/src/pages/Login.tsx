import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { Lock, User, Eye, EyeOff, Activity, Shield } from 'lucide-react'

// Predefined users mapped to eStock Employee table roles
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
  { username: 'cashier', password: 'cashier123', role: 'cashier', name: 'Cashier' },
  { username: 'pharmacist', password: 'pharma123', role: 'pharmacist', name: 'Pharmacist' },
  { username: 'manager', password: 'manager123', role: 'manager', name: 'Branch Manager' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // Simulate auth
    const user = USERS.find(u => u.username === username && u.password === password)
    if (user) {
      login({ username: user.username, role: user.role, name: user.name })
      navigate('/dashboard')
    } else {
      setError('Invalid username or password')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.10) 0%, transparent 60%), #080d1a',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background orbs */}
      <div style={{ position:'absolute', top:'10%', left:'5%', width:400, height:400, borderRadius:'50%', background:'rgba(37,99,235,0.06)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'15%', right:'8%', width:300, height:300, borderRadius:'50%', background:'rgba(6,182,212,0.07)', filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'rgba(139,92,246,0.03)', filter:'blur(100px)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:440, animation:'fadeIn 0.5s ease' }}>
        {/* Logo / Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:72, height:72, borderRadius:20,
            background:'linear-gradient(135deg, #2563eb, #06b6d4)',
            boxShadow:'0 0 40px rgba(37,99,235,0.5)',
            marginBottom:20,
          }}>
            <Activity size={36} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize:'1.9rem', fontWeight:800, color:'#f8fafc', marginBottom:6 }}>
            ProCare OS
          </h1>
          <p style={{ color:'#64748b', fontSize:'0.9rem' }}>Pharmacy Management System</p>
        </div>

        {/* Login Card */}
        <div style={{
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.10)',
          borderRadius:20,
          padding:'36px 32px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'#f8fafc', marginBottom:6 }}>Sign in to your account</h2>
          <p style={{ color:'#475569', fontSize:'0.85rem', marginBottom:28 }}>Enter your credentials to access the dashboard</p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Username */}
            <div className="input-group">
              <label className="input-label">Username</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="login-username"
                  className="input-field"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-with-icon" style={{ position:'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#475569', cursor:'pointer', display:'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)',
                borderRadius:8, padding:'10px 14px', color:'#f87171', fontSize:'0.85rem',
                display:'flex', alignItems:'center', gap:8,
              }}>
                <Shield size={15} /> {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop:4 }}
            >
              {loading ? <><div className="spinner" style={{ width:18,height:18 }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Role hints */}
          <div style={{ marginTop:24, padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize:'0.75rem', color:'#475569', marginBottom:8, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Demo Accounts</p>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {[
                { r:'Admin', u:'admin', p:'admin123' },
                { r:'Manager', u:'manager', p:'manager123' },
                { r:'Cashier', u:'cashier', p:'cashier123' },
              ].map(d => (
                <div key={d.r} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'#475569' }}>
                  <span style={{ color:'#60a5fa', fontWeight:500 }}>{d.r}</span>
                  <span>{d.u} / {d.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign:'center', color:'#334155', fontSize:'0.78rem', marginTop:20 }}>
          ProCare Management OS © 2026 — Elsanta Branch
        </p>
      </div>
    </div>
  )
}
