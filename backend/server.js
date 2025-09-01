const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Import multer
const db = require('./db/database'); // Import the database connection
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Use API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
