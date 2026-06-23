import { useState } from 'react'
import { Search, Plus, ChevronDown, Tag, Building } from 'lucide-react'

const MOCK_PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nameAr: ['باراسيتامول', 'أوجمنتين', 'بروفين', 'أوميجا 3', 'فيتامين د', 'أمبيسلين', 'سيفالوسبورين', 'ميترونيدازول', 'أتورفاستاتين', 'ليزينوبريل'][i % 10],
  nameEn: ['Paracetamol 500mg', 'Augmentin 625mg', 'Brufen 400mg', 'Omega 3 Caps', 'Vitamin D3 1000', 'Ampicillin 500mg', 'Cephalexin 500mg', 'Metronidazole 250mg', 'Atorvastatin 20mg', 'Lisinopril 10mg'][i % 10],
  company: ['Pharco', 'GSK', 'Novartis', 'Amoun', 'EVA Pharma'][i % 5],
  group: ['Analgesic', 'Antibiotic', 'Cardio', 'Vitamin', 'Anti-inflammatory'][i % 5],
  sellPrice: [5, 28, 15, 45, 22, 18, 32, 12, 55, 38][i % 10],
  stock: Math.floor(Math.random() * 200),
  active: i % 7 !== 0,
}))

export default function Products() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_PRODUCTS.filter(p =>
    p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    p.nameAr.includes(search)
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Catalog</h1>
          <p className="page-subtitle">53,474 products · Mashala stock database</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost btn-sm"><Tag size={14} /> Titan Match</button>
          <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Product</button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding:'16px 20px', marginBottom:20, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
        <div className="search-bar" style={{ flex:1, minWidth:240 }}>
          <Search size={15} style={{ color:'#475569' }} />
          <input placeholder="Search by name (EN/AR), barcode..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['Group', 'Company', 'Status'].map(f => (
          <button key={f} className="btn btn-ghost btn-sm">
            <Building size={13} /> {f} <ChevronDown size={13} />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name (EN)</th>
                <th>Arabic Name</th>
                <th>Company</th>
                <th>Group</th>
                <th>Sell Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ color:'#334155', fontSize:'0.8rem' }}>{p.id}</td>
                  <td style={{ fontWeight:500, color:'#cbd5e1' }}>{p.nameEn}</td>
                  <td style={{ direction:'rtl', textAlign:'right', color:'#94a3b8' }}>{p.nameAr}</td>
                  <td>{p.company}</td>
                  <td><span className="badge badge-info">{p.group}</span></td>
                  <td style={{ color:'#60a5fa', fontWeight:600 }}>{p.sellPrice} EGP</td>
                  <td>
                    <span style={{ color: p.stock < 20 ? '#f87171' : '#34d399', fontWeight:600 }}>{p.stock}</span>
                  </td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize:'0.75rem', padding:'4px 10px' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'0.8rem', color:'#475569' }}>Showing {filtered.length} of 53,474 products</span>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost btn-sm">← Prev</button>
            <button className="btn btn-ghost btn-sm">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
