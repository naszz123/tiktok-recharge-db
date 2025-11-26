import { getFile, updateFile } from "./_github";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE")
      return res.status(405).json({ error: "Method not allowed" });

    // Validasi role
    const role = req.headers["x-user-role"];
    const currentUser = req.headers["x-user-name"]; // dipakai untuk cegah self-delete

    if (role !== "Developer") {
      return res.status(403).json({
        error: "Forbidden: Only Developer can delete users"
      });
    }

    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Developer tidak boleh menghapus dirinya sendiri
    if (username === currentUser) {
      return res.status(400).json({
        error: "You cannot delete your own account"
      });
    }

    const { content, sha } = await getFile();

    // cek apakah user ada
    const exists = content.find(u => u.username === username);
    if (!exists) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // hapus user
    const updated = content.filter(u => u.username !== username);

    await updateFile(updated, sha);

    res.json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
      details: error.message
    });
  }
}
