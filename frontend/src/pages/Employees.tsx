import { useState } from 'react'
import { UserCheck, Clock, Calendar, Phone, Search, Plus, ChevronDown } from 'lucide-react'

const EMPLOYEES = [
  { id: 1, name: 'Ahmed Ibrahim', role: 'Pharmacist', shift: 'Morning', status: 'present', phone: '01012345678', salary: 8500, attendance: 96 },
  { id: 2, name: 'Sara Mostafa', role: 'Cashier', shift: 'Morning', status: 'present', phone: '01198765432', salary: 5200, attendance: 92 },
  { id: 3, name: 'Omar Khaled', role: 'Cashier', shift: 'Evening', status: 'absent', phone: '01234567890', salary: 5200, attendance: 88 },
  { id: 4, name: 'Mona Ali', role: 'Store Keeper', shift: 'Morning', status: 'late', phone: '01556789012', salary: 4800, attendance: 90 },
  { id: 5, name: 'Karim Youssef', role: 'Branch Manager', shift: 'Full Day', status: 'present', phone: '01098765432', salary: 14000, attendance: 99 },
  { id: 6, name: 'Dina Samir', role: 'Pharmacist', shift: 'Evening', status: 'present', phone: '01155443322', salary: 8500, attendance: 94 },
]

const STATUS_CONFIG = {
  present: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: '✓ Present' },
  absent: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: '✗ Absent' },
  late: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: '⏰ Late' },
}

export default function Employees() {
  const [search, setSearch] = useState('')
  const filtered = EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  )

  const presentCount = EMPLOYEES.filter(e => e.status === 'present').length
  const absentCount = EMPLOYEES.filter(e => e.status === 'absent').length
  const lateCount = EMPLOYEES.filter(e => e.status === 'late').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{EMPLOYEES.length} staff · Today's attendance</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Employee</button>
      </div>

      {/* Attendance Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Present', value:presentCount, color:'#10b981', bg:'rgba(16,185,129,0.1)', icon:<UserCheck size={20} color="#10b981" /> },
          { label:'Absent', value:absentCount, color:'#ef4444', bg:'rgba(239,68,68,0.1)', icon:<UserCheck size={20} color="#ef4444" /> },
          { label:'Late', value:lateCount, color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:<Clock size={20} color="#f59e0b" /> },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.color}33`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
            {s.icon}
            <div>
              <p style={{ fontSize:'1.6rem', fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:'0.78rem', color:'#64748b', marginTop:2 }}>{s.label} today</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding:'14px 18px', marginBottom:16, display:'flex', gap:12, alignItems:'center' }}>
        <div className="search-bar" style={{ flex:1 }}>
          <Search size={14} style={{ color:'#475569' }} />
          <input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-ghost btn-sm"><Calendar size={13} /> Shift <ChevronDown size={12} /></button>
        <button className="btn btn-ghost btn-sm"><UserCheck size={13} /> Role <ChevronDown size={12} /></button>
      </div>

      {/* Employee Table */}
      <div className="glass-card" style={{ overflow:'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Attendance %</th>
              <th>Salary</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => {
              const sc = STATUS_CONFIG[emp.status as keyof typeof STATUS_CONFIG]
              return (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:34, height:34, borderRadius:'50%', flexShrink:0,
                        background:'linear-gradient(135deg,#2563eb,#06b6d4)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight:700, fontSize:'0.85rem', color:'#fff',
                      }}>{emp.name[0]}</div>
                      <span style={{ fontWeight:600, color:'#cbd5e1', fontSize:'0.87rem' }}>{emp.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{emp.role}</span></td>
                  <td>{emp.shift}</td>
                  <td>
                    <span style={{ background:sc.bg, color:sc.color, borderRadius:8, padding:'3px 10px', fontSize:'0.75rem', fontWeight:600 }}>{sc.label}</span>
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:6, background:'rgba(255,255,255,0.06)', borderRadius:4 }}>
                        <div style={{ height:'100%', width:`${emp.attendance}%`, background:`linear-gradient(90deg, ${emp.attendance > 93 ? '#10b981' : emp.attendance > 88 ? '#f59e0b' : '#ef4444'}, transparent)`, borderRadius:4 }} />
                      </div>
                      <span style={{ fontSize:'0.78rem', color:'#94a3b8', minWidth:32 }}>{emp.attendance}%</span>
                    </div>
                  </td>
                  <td style={{ color:'#60a5fa', fontWeight:600 }}>{emp.salary.toLocaleString()} EGP</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Phone size={13} color="#475569" />
                      <span style={{ fontSize:'0.78rem' }}>{emp.phone}</span>
                    </div>
                  </td>
                  <td><button className="btn btn-ghost btn-sm" style={{ fontSize:'0.75rem', padding:'4px 10px' }}>Edit</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
