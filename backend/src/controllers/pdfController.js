const PDF = require('../models/PDF');
const { uploadToGoogleDrive } = require('../utils/googleDrive');
const fs = require('fs');

const uploadPDF = async (req, res) => {
  console.log('📤 [POST] Received request to upload PDF');
  console.log('📤 Request body:', req.body);
  console.log('📤 Uploaded file:', req.file ? req.file.originalname : 'No file');
  
  let tempFilePath = null;
  
  try {
    if (!req.file) {
      console.log('❌ [POST] No PDF file provided');
      return res.status(400).json({ error: 'No PDF file provided' });
    }
    if (!req.body || !req.body.title) {
      console.log('❌ [POST] No title provided');
      return res.status(400).json({ error: 'Title is required' });
    }

    tempFilePath = req.file.path;

    // Upload directly to Google Drive
    console.log('📤 Uploading to Google Drive...');
    const uploadResult = await uploadToGoogleDrive(tempFilePath, req.file.originalname);
    const pdfLink = uploadResult.viewUrl;
    const downloadLink = uploadResult.downloadUrl;
    console.log('✅ [POST] Google Drive upload successful:', { pdfLink, downloadLink });

    // Save to MongoDB
    const newPDF = new PDF({
      title: req.body.title,
      caption: req.body.caption,
      pdfLink: pdfLink,
      downloadLink: downloadLink
    });

    const savedPDF = await newPDF.save();
    console.log('✅ [POST] PDF successfully stored in database:', savedPDF);

    // Delete temporary file immediately
    try {
      fs.unlinkSync(tempFilePath);
      console.log('✅ [POST] Temporary file deleted');
    } catch (cleanupError) {
      console.warn('⚠️ [POST] Could not delete temporary file:', cleanupError);
    }

    res.status(201).json({
      message: 'PDF uploaded and stored successfully!',
      pdf: savedPDF
    });
  } catch (error) {
    console.error('❌ [POST] Error uploading PDF:', error);
    
    // Clean up temporary file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn('⚠️ [POST] Could not delete temporary file:', cleanupError);
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllPDFs = async (req, res) => {
  console.log('📥 [GET] Received request to retrieve all PDFs');
  try {
    const pdfs = await PDF.find().sort({ createdAt: -1 });
    // Add downloadLink for existing PDFs if missing
    const processedPDFs = pdfs.map(pdf => {
      const pdfObj = pdf.toObject();
      if (!pdfObj.downloadLink) {
        if (pdfObj.pdfLink.includes('drive.google.com')) {
          // Extract file ID from Google Drive view link
          const match = pdfObj.pdfLink.match(/\/file\/d\/([^/]+)/);
          if (match) {
            pdfObj.downloadLink = `https://drive.google.com/uc?export=download&id=${match[1]}`;
          } else {
            pdfObj.downloadLink = pdfObj.pdfLink;
          }
        } else {
          pdfObj.downloadLink = pdfObj.pdfLink;
        }
      }
      return pdfObj;
    });
    console.log(`✅ [GET] Successfully retrieved ${processedPDFs.length} PDFs from database`);
    res.status(200).json({
      message: 'PDFs retrieved successfully!',
      pdfs: processedPDFs
    });
  } catch (error) {
    console.error('❌ [GET] Error retrieving PDFs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPDFById = async (req, res) => {
  console.log('📥 [GET] Received request to retrieve PDF by ID:', req.params.id);
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      console.log('❌ [GET] PDF not found in database for ID:', req.params.id);
      return res.status(404).json({ error: 'PDF not found' });
    }
    const pdfObj = pdf.toObject();
    if (!pdfObj.downloadLink) {
      if (pdfObj.pdfLink.includes('drive.google.com')) {
        const match = pdfObj.pdfLink.match(/\/file\/d\/([^/]+)/);
        if (match) {
          pdfObj.downloadLink = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        } else {
          pdfObj.downloadLink = pdfObj.pdfLink;
        }
      } else {
        pdfObj.downloadLink = pdfObj.pdfLink;
      }
    }
    console.log('✅ [GET] Successfully retrieved PDF from database:', pdfObj);
    res.status(200).json({
      message: 'PDF retrieved successfully!',
      pdf: pdfObj
    });
  } catch (error) {
    console.error('❌ [GET] Error retrieving PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadPDF,
  getAllPDFs,
  getPDFById,
};