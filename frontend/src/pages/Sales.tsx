export default function Sales() {
  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Point of Sale</h1><p className="page-subtitle">New invoice · 95,088 historical transactions</p></div>
        <button className="btn btn-primary">+ New Invoice</button>
      </div>
      <div className="glass-card" style={{ padding:40, textAlign:'center' }}>
        <p style={{ color:'#475569', fontSize:'1.1rem' }}>🛒 POS Terminal — Coming in next sprint</p>
        <p style={{ color:'#334155', fontSize:'0.85rem', marginTop:8 }}>Full barcode scanner, Titan substitution, WhatsApp receipt sender</p>
      </div>
    </div>
  )
}
