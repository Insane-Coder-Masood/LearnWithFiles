import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} LearnWithFiles. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/upload">Upload</a>
          <a href="/pdfs">List PDFs</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
