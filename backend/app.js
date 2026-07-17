const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const pdfRoutes = require('./src/routes/pdfRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/pdfs', pdfRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  // Handle custom file filter errors
  if (err.message === 'Only PDF files are allowed!') {
    return res.status(400).json({ error: err.message });
  }
  
  // Default error
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the File Site API!' });
});

module.exports = app;
