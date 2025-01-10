export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const APP_PASSWORD = process.env.APP_PASSWORD;

  if (password === APP_PASSWORD) {
    res.setHeader('Set-Cookie', 'loggedIn=true; Path=/; HttpOnly');
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
}
