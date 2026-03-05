const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Vulnerability 3: IDOR (Insecure Direct Object Reference)
// Returning user profile based purely on the requested 'id' query parameter 
// without checking whether the requesting user is actually that user.
router.get('/', async (req, res) => {
    const userId = req.query.id; // Expecting ?id=1

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const query = 'SELECT id, username, email, role FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, profile: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
