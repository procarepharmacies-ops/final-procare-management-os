import { useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import { Bell, Search, Calendar } from 'lucide-react'

const pageTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: 'Overview of all operations' },
  sales:     { title: 'Point of Sale', sub: 'New invoices & transaction history' },
  products:  { title: 'Products', sub: 'Inventory & drug catalog' },
  customers: { title: 'Customers', sub: 'Customer profiles & loyalty' },
  kanban:    { title: 'Task Board', sub: 'Employee tasks & operations' },
  employees: { title: 'Employees', sub: 'HR & payroll management' },
  analytics: { title: 'Analytics', sub: 'AI-powered insights & forecasting' },
}

export default function Topbar() {
  const { user } = useAuth()
  const location = useLocation()
  const page = location.pathname.split('/')[1] || 'dashboard'
  const info = pageTitles[page] || { title: 'ProCare OS', sub: '' }
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <header style={{
      position: 'fixed', top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--topbar-height)',
      background: 'rgba(8,13,26,0.90)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 16,
      zIndex: 90,
    }}>
      {/* Page Title */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1 }}>{info.title}</h2>
        <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 2 }}>{info.sub}</p>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ minWidth: 220 }}>
        <Search size={15} style={{ color: '#475569', flexShrink: 0 }} />
        <input placeholder="Search products, invoices..." />
      </div>

      {/* Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: '0.8rem' }}>
        <Calendar size={14} />
        <span>{dateStr}</span>
      </div>

      {/* Notifications */}
      <button style={{
        position: 'relative', background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
        padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        transition: 'all 0.2s ease',
      }}>
        <Bell size={17} color="#64748b" />
        <span className="notif-dot" />
      </button>

      {/* User Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.9rem', color: '#fff',
        cursor: 'pointer', flexShrink: 0,
        boxShadow: '0 0 12px rgba(37,99,235,0.4)',
      }}>
        {user?.name?.[0] || 'U'}
      </div>
    </header>
  )
}
