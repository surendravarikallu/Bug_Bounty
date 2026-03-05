const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Vulnerability 2: Cross Site Scripting (XSS)
// Saving and returning raw user input without any sanitization

router.post('/', async (req, res) => {
    const { userId, comment } = req.body;

    if (!userId || !comment) {
        return res.status(400).json({ success: false, message: 'User ID and comment required' });
    }

    try {
        // Store exactly what the user typed (VULNERABLE)
        const query = 'INSERT INTO comments (user_id, comment) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [userId, comment]);
        res.status(201).json({ success: true, comment: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        // Return exact content (VULNERABLE)
        const query = `
            SELECT c.id, c.comment, c.created_at, u.username as author 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            ORDER BY c.created_at DESC
        `;
        const result = await pool.query(query);
        res.json({ success: true, comments: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
