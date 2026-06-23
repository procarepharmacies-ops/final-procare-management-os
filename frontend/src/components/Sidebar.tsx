import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Kanban,
  UserCheck, BarChart3, LogOut, Activity, ChevronRight, Pill
} from 'lucide-react'

const navItems = [
  { path: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { path: 'sales',      label: 'POS / Sales',  icon: ShoppingCart },
  { path: 'products',   label: 'Products',     icon: Package },
  { path: 'customers',  label: 'Customers',    icon: Users },
  { path: 'kanban',     label: 'Task Board',   icon: Kanban },
  { path: 'employees',  label: 'Employees',    icon: UserCheck },
  { path: 'analytics',  label: 'Analytics',    icon: BarChart3 },
]

const roleColors: Record<string, string> = {
  admin: '#8b5cf6', manager: '#f59e0b', cashier: '#10b981', pharmacist: '#06b6d4',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'rgba(13,21,48,0.97)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(37,99,235,0.4)',
            flexShrink: 0,
          }}>
            <Activity size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', lineHeight: 1.2 }}>ProCare OS</div>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>Elsanta Branch</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>
          Main Menu
        </div>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={`/${path}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10, marginBottom: 4,
              textDecoration: 'none', transition: 'all 0.18s ease',
              background: isActive ? 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.1))' : 'transparent',
              border: isActive ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
              color: isActive ? '#60a5fa' : '#64748b',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.88rem',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={14} />}
              </>
            )}
          </NavLink>
        ))}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 8px' }} />

        {/* Titan Substitution */}
        <div style={{
          margin: '0 0 8px', padding: '12px', borderRadius: 10,
          background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Pill size={15} color="#a78bfa" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#a78bfa' }}>Titan Drug Engine</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.5 }}>
            Substitution & active ingredient matching active
          </p>
        </div>
      </nav>

      {/* User Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          marginBottom: 8,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${roleColors[user?.role || 'cashier'] || '#60a5fa'}, #0f172a)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, color: '#fff',
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: roleColors[user?.role || 'cashier'] || '#60a5fa', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost btn-full btn-sm" style={{ color: '#64748b', fontSize: '0.82rem' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
