const express = require('express');
const router = express.Router();

// Vulnerability 6: Sensitive Information Disclosure
// Exposing environment variables and configuration details

router.get('/', (req, res) => {
    // VULNERABLE: Sending entire environment back to client
    const configData = {
        nodeVersion: process.version,
        platform: process.platform,
        environmentVariables: process.env, // Exposes DB_USER, DB_PASSWORD, DATABASE_URL, etc.
        serverTime: new Date().toISOString()
    };

    res.json({ success: true, debug: configData });
});

module.exports = router;
