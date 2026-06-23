export default function Customers() {
  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Customers</h1><p className="page-subtitle">1,197 customer profiles · Loyalty & WhatsApp</p></div>
        <button className="btn btn-primary">+ Add Customer</button>
      </div>
      <div className="glass-card" style={{ padding:40, textAlign:'center' }}>
        <p style={{ color:'#475569', fontSize:'1.1rem' }}>👥 Customer CRM — Coming in next sprint</p>
        <p style={{ color:'#334155', fontSize:'0.85rem', marginTop:8 }}>Points balance, purchase history, WhatsApp message sender</p>
      </div>
    </div>
  )
}
