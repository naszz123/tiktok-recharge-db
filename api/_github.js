import fetch from "node-fetch";

export async function getFile() {
  const { GITHUB_USERNAME, GITHUB_REPO, GITHUB_FILE, GITHUB_TOKEN } = process.env;

  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  const data = await response.json();

  const fileSHA = data.sha;
  const content = Buffer.from(data.content, "base64").toString("utf8");

  return { content: JSON.parse(content), sha: fileSHA };
}

export async function updateFile(newContent, sha) {
  const { GITHUB_USERNAME, GITHUB_REPO, GITHUB_FILE, GITHUB_TOKEN } = process.env;

  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

  const encoded = Buffer.from(JSON.stringify(newContent, null, 2)).toString("base64");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update user.json from Vercel API",
      content: encoded,
      sha
    })
  });

  return await response.json();
                                                                 }
        
