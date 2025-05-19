const express = require('express');
const path = require('path');
const fs = require('fs');
const dbConnect = require('./utils/dbConnect');
const resumeRoutes = require('./routes/resumeUpload');

const app = express();

// Connect to MongoDB
dbConnect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure static file serving - place this before your routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/api/resumes', resumeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
