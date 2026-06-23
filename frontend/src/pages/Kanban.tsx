import { useState } from 'react'
import { Plus, Trash2, MessageCircle } from 'lucide-react'

const COLUMNS = [
  { id: 'todo', label: '📋 To Do', color: '#475569' },
  { id: 'inprogress', label: '⚡ In Progress', color: '#2563eb' },
  { id: 'review', label: '🔍 Review', color: '#f59e0b' },
  { id: 'done', label: '✅ Done', color: '#10b981' },
]

const INIT_TASKS: Record<string, { id: number; title: string; assignee: string; priority: 'high'|'med'|'low'; tag: string }[]> = {
  todo: [
    { id: 1, title: 'Restock Augmentin 625mg — 200 boxes', assignee: 'Ahmed', priority: 'high', tag: 'Inventory' },
    { id: 2, title: 'Call supplier Pharco for monthly order', assignee: 'Sara', priority: 'med', tag: 'Purchasing' },
    { id: 3, title: 'Update expired products list', assignee: 'Omar', priority: 'high', tag: 'Compliance' },
  ],
  inprogress: [
    { id: 4, title: 'Monthly payroll report — June 2026', assignee: 'Mona', priority: 'high', tag: 'HR' },
    { id: 5, title: 'Check Titan substitution for Omega 3 line', assignee: 'Ahmed', priority: 'med', tag: 'Pharmacy' },
  ],
  review: [
    { id: 6, title: 'WhatsApp broadcast for Ramadan offers', assignee: 'Sara', priority: 'low', tag: 'Marketing' },
  ],
  done: [
    { id: 7, title: 'End-of-day cash reconciliation', assignee: 'Cashier 1', priority: 'med', tag: 'Finance' },
    { id: 8, title: 'Backup database — Mashala', assignee: 'IT', priority: 'high', tag: 'IT' },
  ],
}

const priorityColors = { high: '#ef4444', med: '#f59e0b', low: '#10b981' }
const tagColors: Record<string, string> = {
  Inventory:'rgba(37,99,235,0.2)', Purchasing:'rgba(6,182,212,0.2)', Compliance:'rgba(239,68,68,0.2)',
  HR:'rgba(139,92,246,0.2)', Pharmacy:'rgba(16,185,129,0.2)', Marketing:'rgba(245,158,11,0.2)',
  Finance:'rgba(37,99,235,0.2)', IT:'rgba(100,116,139,0.2)',
}

export default function Kanban() {
  const [tasks, setTasks] = useState(INIT_TASKS)
  const [dragging, setDragging] = useState<{id:number; from:string}|null>(null)

  const onDragStart = (id: number, from: string) => setDragging({ id, from })
  const onDrop = (to: string) => {
    if (!dragging || dragging.from === to) return
    const task = tasks[dragging.from].find(t => t.id === dragging.id)!
    setTasks(prev => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter(t => t.id !== dragging.id),
      [to]: [...prev[to], task],
    }))
    setDragging(null)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Board</h1>
          <p className="page-subtitle">Manager-assigned employee operations · Drag to update status</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Task</button>
      </div>

      <div style={{ display:'flex', gap:16, overflowX:'auto', paddingBottom:16 }}>
        {COLUMNS.map(col => (
          <div
            key={col.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
            style={{
              minWidth:280, flex:'0 0 280px',
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:16, padding:16,
              transition:'all 0.2s',
            }}
          >
            {/* Column Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#f8fafc' }}>{col.label}</span>
              </div>
              <span style={{
                background:`${col.color}22`, color:col.color,
                borderRadius:999, padding:'2px 10px', fontSize:'0.72rem', fontWeight:700,
              }}>{tasks[col.id].length}</span>
            </div>

            {/* Cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {tasks[col.id].map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => onDragStart(task.id, col.id)}
                  style={{
                    background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.09)',
                    borderLeft:`3px solid ${priorityColors[task.priority]}`,
                    borderRadius:10, padding:'12px 14px',
                    cursor:'grab', transition:'all 0.18s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform='translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}
                >
                  <p style={{ fontSize:'0.85rem', fontWeight:500, color:'#cbd5e1', lineHeight:1.4, marginBottom:10 }}>{task.title}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{
                      background:tagColors[task.tag]||'rgba(255,255,255,0.1)',
                      color:'#94a3b8', borderRadius:6, padding:'2px 8px', fontSize:'0.7rem', fontWeight:500,
                    }}>{task.tag}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{
                        width:22, height:22, borderRadius:'50%',
                        background:'linear-gradient(135deg, #2563eb, #06b6d4)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'0.65rem', fontWeight:700, color:'#fff', flexShrink:0,
                      }}>{task.assignee[0]}</div>
                      <span style={{ fontSize:'0.72rem', color:'#475569' }}>{task.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add card btn */}
            <button style={{
              width:'100%', marginTop:10, padding:'8px', background:'none',
              border:'1px dashed rgba(255,255,255,0.10)', borderRadius:8,
              color:'#334155', fontSize:'0.8rem', cursor:'pointer',
              transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(37,99,235,0.4)'; e.currentTarget.style.color='#60a5fa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.color='#334155' }}
            >
              <Plus size={13} /> Add task
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
