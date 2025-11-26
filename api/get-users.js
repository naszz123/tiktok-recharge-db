import { getFile } from "./_github";

export default async function handler(req, res) {
  const { content } = await getFile();
  res.status(200).json(content);
}
