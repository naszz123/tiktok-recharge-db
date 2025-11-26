import { getFile, updateFile } from "./_github";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  // Ambil role dari header oleh Admin/Developer
  const userRole = req.headers["x-user-role"];

  if (!userRole || !["Admin", "Developer"].includes(userRole)) {
    return res.status(403).json({ 
      error: "Only Admin or Developer can add users" 
    });
  }

  const { username, password, role: newRole } = req.body;

  // Validasi input
  if (!username || !password || !newRole) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["Admin", "Developer", "User"].includes(newRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Ambil data dari GitHub
  const { content, sha } = await getFile();

  // Cek username duplikat
  if (content.some(u => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Tambahkan user baru
  content.push({ username, password, role: newRole });

  // Update ke GitHub
  await updateFile(content, sha);

  res.json({
    success: true,
    message: "User added successfully",
    user: { username, role: newRole }
  });
}
