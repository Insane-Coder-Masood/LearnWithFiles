import { Link } from 'react-router-dom'
import { FaUpload, FaList, FaFilePdf, FaWeight } from 'react-icons/fa'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section animate-fade-in">
          <h1 className="hero-title">Welcome to LearnWithFiles</h1>
          <p className="hero-subtitle">Upload, store, and manage your PDF files with ease</p>
        </div>

        <div className="instructions-section animate-slide-up">
          <div className="instructions-box">
            <div className="instruction-item">
              <FaFilePdf className="instruction-icon-small" />
              <span>Only PDF files are accepted</span>
            </div>
            <div className="instruction-item">
              <FaWeight className="instruction-icon-small" />
              <span>Maximum file size: 10MB</span>
            </div>
          </div>
        </div>

        <div className="features-grid animate-slide-up">
          <Link to="/upload" className="feature-card">
            <div className="feature-icon">
              <FaUpload size={48} />
            </div>
            <h2>Upload PDFs</h2>
            <p>Upload your PDF files and add custom captions</p>
          </Link>

          <Link to="/pdfs" className="feature-card">
            <div className="feature-icon">
              <FaList size={48} />
            </div>
            <h2>View PDFs</h2>
            <p>Browse all your uploaded PDFs with their captions</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
