export default async (req, res) => {
  const { username, password } = req.body;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/user.json`, {
      headers: { Authorization: `token ${token}` }
    });
    if (!response.ok) return res.status(500).json({ success: false, message: 'User data not found' });

    const data = await response.json();
    const users = JSON.parse(Buffer.from(data.content, 'base64').toString());
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying login' });
  }
};
