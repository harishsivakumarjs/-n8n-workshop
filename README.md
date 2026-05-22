# n8n Workshop — Vercel + Google Sheets

A 5-page student workshop site. Ideas submitted on the site save directly to Google Sheets via Vercel serverless functions. No n8n required.

---

## How it works

```
User submits form
      ↓
Vercel serverless function (/api/submit.js)
      ↓
Google Sheets API (Service Account auth)
      ↓
New row appended to your sheet
```

---

## Step 1 — Set up Google Cloud Service Account

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable **Google Sheets API**:
   - Search "Google Sheets API" → Enable
4. Create a Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Name it anything (e.g. `workshop-sheets`)
   - Click through, no special roles needed
5. Create a JSON key:
   - Click the service account → Keys tab → Add Key → JSON
   - Download the JSON file — keep it safe, never commit it

---

## Step 2 — Share your Google Sheet with the Service Account

1. Open your Google Sheet
2. Click Share (top right)
3. Paste the `client_email` from your JSON key (looks like `workshop-sheets@your-project.iam.gserviceaccount.com`)
4. Set permission to **Editor**
5. Click Send

---

## Step 3 — Get your Sheet ID

From your sheet URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit#gid=0
```
Copy the long ID between `/d/` and `/edit`.

---

## Step 4 — Deploy to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm i -g vercel
cd n8n-workshop-vercel
vercel
# Follow prompts: link to your account, create new project
```

### Option B — Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Framework: **Other** (no framework)
4. Click Deploy

---

## Step 5 — Add Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables.
Add ALL of these (copy values from your downloaded JSON key file):

| Variable | Where to find it |
|----------|-----------------|
| `GOOGLE_PROJECT_ID` | `project_id` in JSON |
| `GOOGLE_PRIVATE_KEY_ID` | `private_key_id` in JSON |
| `GOOGLE_PRIVATE_KEY` | `private_key` in JSON (copy the whole `-----BEGIN...-----END-----` block) |
| `GOOGLE_CLIENT_EMAIL` | `client_email` in JSON |
| `GOOGLE_CLIENT_ID` | `client_id` in JSON |
| `GOOGLE_SHEET_ID` | From your sheet URL (Step 3) |

After adding all variables → **Redeploy** the project.

---

## Step 6 — Test it

Open your Vercel URL → go to the Ideas page → submit a form.
Within 2 seconds a new row should appear in your Google Sheet.

---

## Sheet structure

Your sheet must have these headers in row 1 (tab name: `n8n Automation Ideas`):

| A | B | C | D |
|---|---|---|---|
| Timestamp | Name | Idea | Category |

---

## File structure

```
n8n-workshop-vercel/
├── api/
│   ├── submit.js      ← POST: saves idea to Google Sheets
│   └── ideas.js       ← GET: reads all ideas from Google Sheets
├── pages/
│   ├── automation.html
│   ├── n8n.html
│   ├── workflows.html
│   ├── quiz.html
│   └── ideas.html     ← Wall of Ideas (calls /api/submit and /api/ideas)
├── css/style.css
├── js/nav.js
├── index.html
├── vercel.json
├── package.json
├── .env.example       ← Copy this, fill in values, add to Vercel dashboard
└── .gitignore
```
