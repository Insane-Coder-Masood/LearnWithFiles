require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const pdfRoutes = require('./src/routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 3001;




const allowedOrigins = [
  "https://learnwithfiles.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


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
module.exports = app;
