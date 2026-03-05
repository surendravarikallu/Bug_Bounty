const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Vulnerability 5: Broken Authentication / Weak Access Control
// A weak custom header is used to determine admin status
const weakAdminCheck = (req, res, next) => {
    // VULNERABLE: Trusting user input header entirely
    const role = req.header('X-User-Role');
    if (role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }
};

router.get('/users', weakAdminCheck, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, role FROM users');
        res.json({ success: true, users: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/files', weakAdminCheck, async (req, res) => {
    try {
        const query = `
            SELECT f.id, f.filename, f.filepath, u.username as owner
            FROM files f
            JOIN users u ON f.user_id = u.id
        `;
        const result = await pool.query(query);
        res.json({ success: true, files: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
