import { getFile, updateFile } from "./_github";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  const role = req.headers["x-user-role"];
  if (role !== "Developer") {
    return res.status(403).json({ error: "Forbidden: Only Developer can delete users" });
  }

  const { username } = req.body;

  const { content, sha } = await getFile();

  const filtered = content.filter(u => u.username !== username);

  await updateFile(filtered, sha);

  res.json({ message: "User deleted successfully" });
}
