import { useState, useEffect } from 'react'
import { Search, Plus, ChevronDown, Tag, Building, Loader2 } from 'lucide-react'
import { api } from '../api'

interface Product {
  id: number
  nameAr: string
  nameEn: string
  sellPrice: number
  buyPrice: number
  stock: number
  barcode: string
  active: boolean
  group?: string
  company?: string
}

export default function Products() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await api.products.search(search, page)
        setProducts(res.data)
      } catch (err) {
        console.error('Failed to fetch products', err)
        // Fallback to empty if DB is unavailable
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    const timeoutId = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [search, page])

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
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spin" style={{ margin: '0 auto', color: '#60a5fa' }} /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No products found</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id}>
                    <td style={{ color:'#334155', fontSize:'0.8rem' }}>{p.id}</td>
                    <td style={{ fontWeight:500, color:'#cbd5e1' }}>{p.nameEn}</td>
                    <td style={{ direction:'rtl', textAlign:'right', color:'#94a3b8' }}>{p.nameAr}</td>
                    <td>{p.company || 'Generic'}</td>
                    <td><span className="badge badge-info">{p.group || 'General'}</span></td>
                    <td style={{ color:'#60a5fa', fontWeight:600 }}>{p.sellPrice.toFixed(2)} EGP</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'0.8rem', color:'#475569' }}>Showing {products.length} products on page {page}</span>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <button className="btn btn-ghost btn-sm" disabled={products.length < 50} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
