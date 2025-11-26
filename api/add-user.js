import { getFile, updateFile } from "./_github";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const role = req.headers["x-user-role"];
  if (!role || !["Admin", "Developer"].includes(role)) {
    return res.status(403).json({ error: "Forbidden: Only Admin or Developer can add users" });
  }

  const { username, password, role: newRole } = req.body;

  const { content, sha } = await getFile();

  if (content.some(u => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  content.push({ username, password, role: newRole });

  await updateFile(content, sha);

  res.json({ message: "User added successfully" });
    }
