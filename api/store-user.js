export default async (req, res) => {
  const { user } = req.body;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  // Fetch existing users.json
  const existingRes = await fetch(`https://api.github.com/repos/${repo}/contents/users.json`, {
    headers: { Authorization: `token ${token}` }
  });
  let users = [];
  if (existingRes.ok) {
    const existingData = await existingRes.json();
    users = JSON.parse(Buffer.from(existingData.content, 'base64').toString());
  }

  // Add/update user
  users = users.filter(u => u.id !== user.id);
  users.push(user);

  // Update file
  const content = Buffer.from(JSON.stringify(users)).toString('base64');
  await fetch(`https://api.github.com/repos/${repo}/contents/users.json`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update users',
      content,
      sha: existingRes.ok ? existingData.sha : undefined
    })
  });

  res.status(200).json({ success: true });
};
