const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Environment password
const PASSWORD = process.env.APP_PASSWORD

// Middleware to protect `index.html`
function checkPassword(req, res, next) {
    try {
        if (req.cookies.authenticated) {
            return next();
        }
        res.redirect('/login');
    } catch (error) {
        console.error('Error in password middleware:', error.message);
        res.status(500).send('Internal server error. Please try again later.');
    }
}

// Serve login page
app.get('/login', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } catch (error) {
        console.error('Error serving login page:', error.message);
        res.status(500).send('Internal server error. Please try again later.');
    }
});

// Handle login form submission
app.post('/login', (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).send('Password is required.');
        }

        if (password === PASSWORD) {
            res.cookie('authenticated', true, { httpOnly: true, maxAge: 3600000 }); // 1-hour cookie
            return res.redirect('/');
        }

        res.status(401).send(`
            <p>Invalid password. <a href="/login">Try again</a>.</p>
        `);
    } catch (error) {
        console.error('Error handling login form submission:', error.message);
        res.status(500).send('Internal server error. Please try again later.');
    }
});

// Serve index.html only if authenticated
app.get('/', checkPassword, (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error.message);
        res.status(500).send('Internal server error. Please try again later.');
    }
});

// 404 error handler for unknown routes
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Not Found</h1>
        <p>The requested resource could not be found. <a href="/">Go to Home</a></p>
    `);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err.stack || err.message);
    res.status(500).send(`
        <h1>500 - Internal Server Error</h1>
        <p>Something went wrong. Please try again later.</p>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
