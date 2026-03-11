const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const debugRoutes = require('./routes/debug');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/debug', debugRoutes);

// Vulnerability 10: Security Misconfiguration (Verbose Errors)
// Exposing detailed stack traces to the client
app.get('/api/debug/crash', (req, res) => {
    // Intentionally throwing an error to see if the server leaks the stack trace
    throw new Error("Database connection unexpectedly dropped. Query failed at line 42 in User.findById: SELECT * FROM system_users");
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for frontend React application
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
