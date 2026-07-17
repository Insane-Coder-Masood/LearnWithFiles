console.log('1. Debug server starting...');

console.log('2. Loading dotenv...');
require('dotenv').config();
console.log('dotenv loaded, PORT:', process.env.PORT);

console.log('3. Loading express...');
const express = require('express');
console.log('express loaded');

console.log('4. Loading cors...');
const cors = require('cors');
console.log('cors loaded');

console.log('5. Loading multer...');
const multer = require('multer');
console.log('multer loaded');

console.log('6. Loading mongoose...');
const mongoose = require('mongoose');
console.log('mongoose loaded');

console.log('7. Loading path...');
const path = require('path');
console.log('path loaded');

console.log('8. Loading fs...');
const fs = require('fs');
console.log('fs loaded');

console.log('9. Loading PDF model...');
const PDF = require('./src/models/PDF');
console.log('PDF model loaded');

console.log('10. Loading googleDrive util...');
const { uploadToGoogleDrive } = require('./src/utils/googleDrive');
console.log('googleDrive util loaded');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

console.log('11. Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('12. MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.json({ message: 'Debug server running on port ' + PORT }));

app.post('/api/pdfs/upload', upload.single('pdfFile'), async (req, res) => {
  console.log('📥 [POST] /api/pdfs/upload');
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
  
  try {
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({ error: 'No PDF file provided' });
    }
    if (!req.body.caption) {
      console.log('❌ No caption provided');
      return res.status(400).json({ error: 'Caption is required' });
    }

    const tempFilePath = req.file.path;
    const localPdfLink = `/uploads/${req.file.filename}`;
    let pdfLink, downloadLink;
    let useLocal = true;
    
    // Try Google Drive
    try {
      console.log('📤 Trying Google Drive upload...');
      const uploadResult = await uploadToGoogleDrive(tempFilePath, req.file.originalname);
      pdfLink = uploadResult.viewUrl;
      downloadLink = uploadResult.downloadUrl;
      useLocal = false;
      console.log('✅ Google Drive upload successful');
    } catch (driveError) {
      console.warn('⚠️ Google Drive upload failed, using local storage:', driveError.message);
      pdfLink = localPdfLink;
      downloadLink = `http://localhost:${PORT}${localPdfLink}`;
      useLocal = true;
    }

    const newPDF = new PDF({
      caption: req.body.caption,
      pdfLink: pdfLink,
      downloadLink: downloadLink
    });

    const savedPDF = await newPDF.save();
    console.log('✅ PDF saved to database:', savedPDF._id);

    if (!useLocal) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('✅ Temporary file deleted');
      } catch (cleanupError) {
        console.warn('⚠️ Could not delete temporary file:', cleanupError);
      }
    }

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: savedPDF
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/pdfs/all', async (req, res) => {
  console.log('📥 [GET] /api/pdfs/all');
  try {
    const pdfs = await PDF.find().sort({ createdAt: -1 });
    const processedPDFs = pdfs.map(pdf => {
      const pdfObj = pdf.toObject();
      if (!pdfObj.downloadLink) {
        if (pdfObj.pdfLink.startsWith('/uploads')) {
          pdfObj.downloadLink = `http://localhost:${PORT}${pdfObj.pdfLink}`;
        } else if (pdfObj.pdfLink.includes('drive.google.com')) {
          const match = pdfObj.pdfLink.match(/\/file\/d\/([^/]+)/);
          pdfObj.downloadLink = match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : pdfObj.pdfLink;
        } else {
          pdfObj.downloadLink = pdfObj.pdfLink;
        }
      }
      return pdfObj;
    });
    console.log(`✅ Found ${processedPDFs.length} PDFs`);
    res.status(200).json({ message: 'PDFs retrieved', pdfs: processedPDFs });
  } catch (error) {
    console.error('❌ Get all PDFs error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`13. Debug server running on http://localhost:${PORT}`);
});

server.on('error', (err) => console.error('Server error:', err));

// Keep alive
setInterval(() => {}, 1000);
