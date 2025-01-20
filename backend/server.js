// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// 1) Create your Express app
const app = express();

// 2) Connect to MongoDB (using your credentials)
mongoose
  .connect(
    'mongodb+srv://vraghavendra743:987654321@cluster0.uixrp.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 3) Middleware: cors + body parsing
app.use(cors());
app.use(express.json());

// 4) Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5) Import routes
const emailRoutes = require('./routes/emailRoutes');
const imageRoutes = require('./routes/imageRoutes');

// 6) Mount routes under /api prefix
app.use('/api', imageRoutes);
app.use('/api', emailRoutes);

// 7) Test route
app.get('/', (req, res) => {
  res.send('Hello from the Email Builder backend!');
});

// 8) Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
