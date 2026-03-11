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

// Vulnerability 8: Command Injection
// Executing system commands using user input without sanitization
const { exec } = require('child_process');
router.post('/ping', (req, res) => {
    const ip = req.body.ip;

    // VULNERABLE: Direct concatenation of user input into a shell command!
    const countFlag = process.platform === 'win32' ? '-n' : '-c';
    const command = `ping ${countFlag} 3 ${ip}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, output: stderr || error.message });
        }
        res.json({ success: true, output: stdout });
    });
});

// Vulnerability 9: Directory Traversal / Local File Inclusion (LFI)
// Reading arbitrary files from the filesystem using user-supplied path
const fs = require('fs');
const path = require('path');
router.get('/read-file', (req, res) => {
    const filename = req.query.file;

    // VULNERABLE: Not validating the path. Allows "cat c:\windows\win.ini" or "../../etc/passwd" equivalents
    const filePath = path.join(__dirname, '../../', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not read file' });
        }
        res.send(data);
    });
});

module.exports = router;
