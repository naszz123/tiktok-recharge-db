export default async (req, res) => {
  const { username, password } = req.body;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/user.json`,
      {
        headers: { Authorization: `token ${token}` }
      }
    );

    if (!response.ok) {
      return res.status(500).json({ success: false, message: 'User data not found' });
    }

    const data = await response.json();
    const users = JSON.parse(Buffer.from(data.content, 'base64').toString());

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // KIRIM DATA USER LENGKAP (INILAH YANG WAJIB ADA)
      return res.status(200).json({
        success: true,
        user: {
          username: user.username,
          role: user.role
        }
      });
    }

    return res.status(401).json({ success: false, message: "Invalid login" });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying login',
      error: error.message
    });
  }
};
