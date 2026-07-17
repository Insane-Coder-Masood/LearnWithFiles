import { useState, useEffect } from 'react'
import { FaFilePdf, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import './ListPDFs.css'

const ListPDFs = () => {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPDFs()
  }, [])

  const fetchPDFs = async () => {
    try {
      const response = await fetch('http://learn-with-files.vercel.app/api/pdfs/all')
      if (!response.ok) throw new Error('Failed to fetch PDFs')
      const data = await response.json()
      setPdfs(data.pdfs || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="list-container">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading PDFs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="list-container">
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchPDFs} className="retry-btn">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="list-container">
      <div className="list-content animate-fade-in">
        <div className="list-header">
          <h1>Your PDFs</h1>
          <p>Total: {pdfs.length} file{pdfs.length !== 1 ? 's' : ''}</p>
        </div>

        {pdfs.length === 0 ? (
          <div className="empty-state">
          <FaFilePdf className="empty-icon" />
          <h2>No PDFs yet</h2>
          <p>Upload your first PDF to get started</p>
          <a href="/upload" className="upload-link">Upload PDF</a>
        </div>
        ) : (
          <div className="pdfs-grid">
            {pdfs.map((pdf, index) => (
            <div 
              key={pdf._id} 
              className="pdf-card animate-slide-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="pdf-icon">
                <FaFilePdf size={40} />
              </div>
              <div className="pdf-info">
                <h3 className="pdf-title">{pdf.title}</h3>
                {pdf.caption && <p className="pdf-caption">{pdf.caption}</p>}
                <p className="pdf-date">{new Date(pdf.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="pdf-buttons">
                <a 
                  href={pdf.pdfLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  View PDF
                </a>
                <a 
                  href={pdf.downloadLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="download-btn"
                  download
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}

export default ListPDFs
