const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.APP_PASSWORD) {
    // Set a cookie to indicate successful login
    res.cookie('auth', 'true', { httpOnly: true });
    res.redirect('/index');
  } else {
    res.status(401).send('Invalid password. Please try again.');
  }
});

// Route to serve the index page after successful login
app.get('/index', (req, res) => {
  if (req.cookies.auth === 'true') {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
