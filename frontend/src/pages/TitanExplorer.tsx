import { useState } from 'react'
import { Search, Database, ChevronRight, Share2, Tag, Percent, ArrowRight } from 'lucide-react'

// Mock Data representing the mapped .phy Titan Database
const TITAN_MAPPINGS = [
  { id: 'T-1001', activeIngredient: 'Amoxicillin + Clavulanate', 
    products: [
      { name: 'Augmentin 625mg', price: 89, discount: 5, inStock: true, type: 'Brand' },
      { name: 'Amoxiclav 625mg', price: 55, discount: 15, inStock: true, type: 'Generic' },
      { name: 'Clumentin 625mg', price: 45, discount: 20, inStock: false, type: 'Generic' },
    ]
  },
  { id: 'T-1002', activeIngredient: 'Paracetamol', 
    products: [
      { name: 'Panadol Advance', price: 25, discount: 0, inStock: true, type: 'Brand' },
      { name: 'Paramol 500mg', price: 12, discount: 10, inStock: true, type: 'Generic' },
      { name: 'Abimol 500mg', price: 10, discount: 12, inStock: true, type: 'Generic' },
    ]
  },
  { id: 'T-1003', activeIngredient: 'Ibuprofen', 
    products: [
      { name: 'Brufen 400mg', price: 35, discount: 0, inStock: true, type: 'Brand' },
      { name: 'Profen 400mg', price: 15, discount: 25, inStock: true, type: 'Generic' },
    ]
  }
]

export default function TitanExplorer() {
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<any>(TITAN_MAPPINGS[0])

  const filteredMappings = TITAN_MAPPINGS.filter(m => 
    m.activeIngredient.toLowerCase().includes(search.toLowerCase()) || 
    m.products.some(p => p.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 128px)' }}>
      {/* Left: Search & Groups */}
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={24} color="#a78bfa" /> Titan Explorer
            </h1>
            <p className="page-subtitle">Deep search active ingredients</p>
          </div>
        </div>

        <div className="search-bar">
          <Search size={16} style={{ color: '#475569' }} />
          <input 
            placeholder="Search active ingredient or drug..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredMappings.map(group => (
            <div 
              key={group.id} 
              onClick={() => setSelectedGroup(group)}
              style={{
                background: selectedGroup?.id === group.id ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedGroup?.id === group.id ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12, padding: '16px', cursor: 'pointer',
                transition: 'all 0.18s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700, marginBottom: 4 }}>{group.id}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.3 }}>{group.activeIngredient}</p>
                </div>
                <ChevronRight size={18} color={selectedGroup?.id === group.id ? '#a78bfa' : '#475569'} />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 10 }}>{group.products.length} linked products</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Detail View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedGroup ? (
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: 12, display: 'inline-block' }}>Active Ingredient Group</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>{selectedGroup.activeIngredient}</h2>
                <p style={{ color: '#94a3b8', marginTop: 8, fontSize: '0.9rem' }}>Titan Reference: {selectedGroup.id}</p>
              </div>
              <button className="btn btn-ghost"><Share2 size={16} /> Export Mappings</button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
              Available Substitutes ({selectedGroup.products.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
              {selectedGroup.products.map((p: any, index: number) => (
                <div key={index} style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, 
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: 12, padding: 20
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: p.type === 'Brand' ? '#f8fafc' : '#a78bfa' }}>{p.name}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: p.type === 'Brand' ? 'rgba(255,255,255,0.1)' : 'rgba(139,92,246,0.15)', color: p.type === 'Brand' ? '#94a3b8' : '#c4b5fd', textTransform: 'uppercase' }}>
                        {p.type}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: p.inStock ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.inStock ? '#10b981' : '#ef4444' }}></span>
                      {p.inStock ? 'In Stock in ProCare' : 'Out of Stock'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa' }}>{p.price} EGP</span>
                    </div>
                    {p.discount > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                        <Percent size={12} /> {p.discount}% Supplier Discount
                      </span>
                    )}
                  </div>

                  <button className="btn btn-ghost" style={{ padding: 12, height: 'auto', alignSelf: 'stretch' }}>
                    <ArrowRight size={20} color="#64748b" />
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(37,99,235,0.08)', borderRadius: 12, border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
               <Tag size={20} color="#60a5fa" />
               <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                 <strong>Profit Optimization Tip:</strong> Selling <span style={{ color: '#a78bfa' }}>Amoxiclav 625mg</span> instead of the brand yields <strong>15%</strong> more gross margin due to higher supplier discount.
               </p>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            Select an active ingredient group to explore Titan substitutes.
          </div>
        )}
      </div>
    </div>
  )
}
