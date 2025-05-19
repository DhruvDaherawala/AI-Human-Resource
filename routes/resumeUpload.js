const express = require('express');
const multer = require('multer');
const path = require('path');
const Resume = require('../models/Resume');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    }
});

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const resume = new Resume({
            fileName: req.file.originalname,
            fileUrl: req.file.path,
            fileType: path.extname(req.file.originalname),
            fileSize: req.file.size
        });

        await resume.save();
        res.status(201).json({
            message: 'Resume uploaded successfully',
            resume
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading resume' });
    }
});

module.exports = router;
