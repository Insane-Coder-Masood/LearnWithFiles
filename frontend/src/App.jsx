import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import UploadPDF from './pages/UploadPDF'
import ListPDFs from './pages/ListPDFs'
import './App.css'

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPDF />} />
            <Route path="/pdfs" element={<ListPDFs />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App
