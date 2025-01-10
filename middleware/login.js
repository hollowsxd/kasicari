const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// Serve login page for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.APP_PASSWORD) {
        res.cookie('auth', 'true', { httpOnly: true });
        res.redirect('/index');
    } else {
        res.status(401).send('Invalid password. Please try again.');
    }
});

// Serve index.html if logged in
app.get('/index', (req, res) => {
    if (req.cookies.auth === 'true') {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } else {
        res.redirect('/');
    }
});

// Export app for Vercel
module.exports = app;
