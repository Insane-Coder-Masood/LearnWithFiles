const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const { uploadPDF, getAllPDFs, getPDFById } = require('../controllers/pdfController');

const router = express.Router();

// Configure Multer to use OS temp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Use OS temp directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST API to upload PDF and store in database
router.post('/upload', upload.single('pdfFile'), uploadPDF);

// GET API to retrieve all PDFs with their captions
router.get('/all', getAllPDFs);

// GET API to retrieve a single PDF by ID
router.get('/:id', getPDFById);

module.exports = router;
