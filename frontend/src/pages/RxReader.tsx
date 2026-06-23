import { useState, useRef } from 'react'
import { Upload, ScanLine, FileType, CheckCircle, AlertCircle, RefreshCw, ShoppingCart } from 'lucide-react'

// Mock OCR Extraction Results
const MOCK_EXTRACTION = [
  { id: 1, name: 'Augmentin 1g', confidence: 95, matchFound: true, productId: 2, price: 89 },
  { id: 2, name: 'Panadol Advance', confidence: 88, matchFound: true, productId: 1, price: 25 },
  { id: 3, name: 'Cataflam 50mg', confidence: 72, matchFound: false },
]

export default function RxReader() {
  const [image, setImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage(url)
      setResults(null)
    }
  }

  const startScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setResults(MOCK_EXTRACTION)
    }, 2000)
  }

  const handleReset = () => {
    setImage(null)
    setResults(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 128px)' }}>
      {/* Left: Upload & Image Viewer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">RX Reader (OCR)</h1>
            <p className="page-subtitle">AI-powered prescription transcription</p>
          </div>
        </div>

        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {!image ? (
            <div 
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed rgba(255,255,255,0.1)', margin: 20, borderRadius: 16 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Upload size={28} color="#60a5fa" />
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>Upload Prescription Image</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Supports JPG, PNG, PDF</p>
            </div>
          ) : (
            <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, background: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={image} alt="Prescription" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                {isScanning && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(37,99,235,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                    <ScanLine size={48} color="#60a5fa" className="pulse-animation" style={{ marginBottom: 16 }} />
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem', letterSpacing: 1 }}>ANALYZING HANDWRITING...</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-ghost" onClick={handleReset} style={{ flex: 1 }}><RefreshCw size={16} /> Start Over</button>
                <button className="btn btn-primary" onClick={startScan} disabled={isScanning || results !== null} style={{ flex: 2, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
                  <FileType size={16} /> {isScanning ? 'Scanning...' : 'Extract Drugs (AI)'}
                </button>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
        </div>
      </div>

      {/* Right: Results & Add to Cart */}
      <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Extraction Results</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>{results ? `${results.length} items found` : 'Waiting for scan...'}</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {!results ? (
              <div style={{ textAlign: 'center', color: '#475569', marginTop: 60 }}>
                <ScanLine size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>Upload and scan an image to see results here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map(res => (
                  <div key={res.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0' }}>{res.name}</p>
                        <p style={{ fontSize: '0.75rem', color: res.confidence > 90 ? '#34d399' : '#f59e0b', marginTop: 4 }}>
                          {res.confidence}% confidence
                        </p>
                      </div>
                      {res.matchFound ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : (
                        <AlertCircle size={20} color="#f59e0b" />
                      )}
                    </div>
                    
                    {res.matchFound ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa' }}>{res.price} EGP</span>
                        <button className="btn btn-primary btn-sm" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Add to POS</button>
                      </div>
                    ) : (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8 }}>Not found in catalog. Search manually?</p>
                        <div className="search-bar" style={{ margin: 0 }}>
                          <input placeholder="Search catalog..." style={{ fontSize: '0.8rem', padding: '6px 12px' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {results && (
             <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button className="btn btn-primary btn-full">
                  <ShoppingCart size={16} /> Send All to POS
                </button>
             </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
        .pulse-animation { animation: pulse 1.5s infinite ease-in-out; }
      `}</style>
    </div>
  )
}
