import { getFile, updateFile } from "./_github";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method not allowed" });

  const role = req.headers["x-user-role"];
  if (role !== "Developer") {
    return res.status(403).json({ error: "Forbidden: Only Developer can edit users" });
  }

  const { oldUsername, username, password, role: newRole } = req.body;

  const { content, sha } = await getFile();

  const index = content.findIndex(u => u.username === oldUsername);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  content[index] = { username, password, role: newRole };

  await updateFile(content, sha);

  res.json({ message: "User updated successfully" });
         }
