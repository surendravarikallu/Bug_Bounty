const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

// Vulnerability 4: File Upload Vulnerability
// No proper validation of file types or extensions

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // VULNERABLE: Keeps the exact original extension, even .js, .php, .exe, etc.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    const userId = req.body.userId;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        const filepath = '/uploads/' + req.file.filename;
        const query = 'INSERT INTO files (user_id, filename, filepath) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [userId || 1, req.file.originalname, filepath]);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            file: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
