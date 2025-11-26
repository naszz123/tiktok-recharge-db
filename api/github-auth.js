export default async (req, res) => {
  const { code } = req.body;
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`
  });
  const data = await response.json();
  if (data.access_token) {
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${data.access_token}` }
    });
    const user = await userRes.json();
    res.status(200).json({ user });
  } else {
    res.status(400).json({ error: 'Auth failed' });
  }
};
