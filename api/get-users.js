import { getFile } from "./_github";

export default async function handler(req, res) {
  try {

    // Ambil role dari header
    const role = req.headers["x-user-role"];

    // Hanya Admin / Developer boleh membuka daftar user
    if (!role || !["Admin", "Developer"].includes(role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You are not allowed to view users"
      });
    }

    // Baca file user.json dari GitHub
    const { content } = await getFile();

    return res.status(200).json({
      success: true,
      users: content
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to load user data",
      details: error.message,
    });
  }
}
