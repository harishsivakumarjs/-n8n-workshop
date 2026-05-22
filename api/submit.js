const { google } = require("googleapis");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  const { name, idea, tag } = req.body || {};

  if (!name || !idea) {
    return res.status(400).json({ error: "Name and idea are required" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id:   process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key:  (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id:    process.env.GOOGLE_CLIENT_ID,
        auth_uri:     "https://accounts.google.com/o/oauth2/auth",
        token_uri:    "https://oauth2.googleapis.com/token",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone:  "Asia/Kolkata",
      year:      "numeric",
      month:     "short",
      day:       "2-digit",
      hour:      "2-digit",
      minute:    "2-digit",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId:   process.env.GOOGLE_SHEET_ID,
      range:           "n8n Automation Ideas!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name.trim(), idea.trim(), tag || "General"]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Sheets write error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};