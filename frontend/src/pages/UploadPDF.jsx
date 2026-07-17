import { useState } from 'react'
import { FaUpload, FaCheckCircle, FaExclamationTriangle, FaFilePdf, FaWeight } from 'react-icons/fa'
import './UploadPDF.css'

const UploadPDF = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) {
      setFile(null)
      setStatus(null)
      return
    }
    
    if (selectedFile.type !== 'application/pdf') {
      setStatus('error')
      setStatusMessage('Please select a valid PDF file')
      setFile(null)
      return
    }
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      setStatus('error')
      setStatusMessage('File size exceeds 10MB limit')
      setFile(null)
      return
    }
    
    setFile(selectedFile)
    setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setStatus('error')
      setStatusMessage('Please select a PDF file')
      return
    }
    
    if (!title.trim()) {
      setStatus('error')
      setStatusMessage('Please enter a title')
      return
    }

    setIsUploading(true)
    setStatus(null)

    const formData = new FormData()
    formData.append('pdfFile', file)
    formData.append('title', title)
    formData.append('caption', caption)

    try {
      const response = await fetch('http://learn-with-files.vercel.app/api/pdfs/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setStatus('success')
      setStatusMessage('PDF uploaded successfully!')
      setFile(null)
      setTitle('')
      setCaption('')
      e.target.reset()
    } catch (error) {
      let msg = 'Error uploading PDF. Please try again.'
      if (error.message.includes('Only PDF')) {
        msg = error.message
      } else if (error.message.includes('file too large') || error.message.includes('10MB')) {
        msg = 'File size exceeds 10MB limit'
      }
      setStatus('error')
      setStatusMessage(msg)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-content animate-fade-in">
        <h1 className="upload-title">Upload PDF</h1>
        <p className="upload-subtitle">Add your PDF file with a descriptive caption</p>
        
        <div className="instructions-box">
          <div className="instruction-item">
            <FaFilePdf className="instruction-icon-small" />
            <span>Only PDF files are accepted</span>
          </div>
          <div className="instruction-item">
            <FaWeight className="instruction-icon-small" />
            <span> please upload a PDF file with a size of up to 10MB</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-upload-area">
            <input
              type="file"
              id="pdfFile"
              accept="application/pdf"
              onChange={handleFileChange}
              className="file-input"
              disabled={isUploading}
            />
            <label htmlFor="pdfFile" className="file-label">
              {file ? (
                <div className="file-selected">
                  <FaCheckCircle size={48} color="#10b981" />
                  <p>{file.name}</p>
                </div>
              ) : (
                <div className="file-placeholder">
                  <FaUpload size={48} />
                  <p>Click to select PDF file or drag here</p>
                </div>
              )}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your file"
              className="form-input"
              disabled={isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="caption" className="form-label">Caption (Optional)</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Give information about the file (optional)"
              className="form-input"
              disabled={isUploading}
            />
          </div>

          {status && (
            <div className={`status-message status-${status}`}>
              {status === 'success' ? (
                <FaCheckCircle className="status-icon" />
              ) : (
                <FaExclamationTriangle className="status-icon" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className={`upload-btn ${isUploading ? 'uploading' : ''}`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="spinner"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload />
                Upload PDF
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadPDF
