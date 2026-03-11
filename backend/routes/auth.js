const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Vulnerability 1: SQL Injection
// Using raw string concatenation instead of parameterized queries
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // VULNERABLE CODE (Simplified for 2nd Year CSE):
        // We use string interpolation, and we do NOT wrap the password in quotes
        // if the username is doing the bypassing. Alternatively, the simplest fix is 
        // to just use the classic query and rely on `--` to comment out the rest.
        // However, to make `admin' OR '1'='1` work directly without comments, we can 
        // structure it like this:
        const query = `SELECT * FROM users WHERE username = '${username}' OR password = '${password}'`;
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            // In a real app we'd use JWT, but here we'll just send back basic pseudo-auth details
            // to make it easier for students to manipulate state.
            res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Vulnerability 7: Weak Password Storage
// Storing passwords in plain text without hashing
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // We will parameterize this one just so it actually works normally to register users, 
        // the vulnerability here is the plain text storage of the 'password'.
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, role';
        const result = await pool.query(query, [username, email, password]);

        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
});

module.exports = router;
