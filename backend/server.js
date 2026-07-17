require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const pdfRoutes = require('./src/routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/pdfs', pdfRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'PDF Manager Server Running!', 
    status: 'OK' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
