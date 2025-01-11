const { serialize } = require('cookie');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const parsedBody = new URLSearchParams(body);
    const password = parsedBody.get('password');
    const APP_PASSWORD = process.env.APP_PASSWORD;

    if (password === APP_PASSWORD) {
      const cookie = serialize('loggedIn', 'true', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
      });
      res.setHeader('Set-Cookie', cookie);
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  });
};
