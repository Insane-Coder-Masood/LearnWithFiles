import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUpload, FaList, FaBars, FaTimes, FaFileAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div 
        className={`navbar-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1><FaFileAlt /> LearnWithFiles</h1>
          </Link>
        </div>
        <div className="navbar-right">
          <button 
            className="navbar-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/upload">
              <FaUpload /> Upload
            </Link>
          </li>
          <li>
            <Link to="/pdfs">
              <FaList /> PDFs
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
