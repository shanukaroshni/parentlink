# 📱 ParentLink

> Help your parents from anywhere — just send them a WhatsApp link.

## How It Works

1. You open the app → tap **Generate Link**
2. Send the link to your parents on WhatsApp
3. They tap it → tap one big **"Allow Help"** button
4. You can now **see their screen live** from your phone!

---

## 🗂️ Folder Structure

```
parentlink/
├── public/
│   ├── index.html      ← YOUR page (control panel)
│   └── parent.html     ← PARENTS' page (big button)
├── server/
│   └── index.js        ← Backend server (Node.js)
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Running Locally (on your laptop)

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Install dependencies
Open Terminal / Command Prompt in the project folder and run:
```bash
npm install
```

### Step 3 — Start the server
```bash
npm start
```

### Step 4 — Open the app
Go to: http://localhost:3000

---

## ☁️ Deploying to Render.com (FREE — so parents can use it anywhere)

1. Push this code to GitHub (see below)
2. Go to https://render.com → Sign up free
3. Click **"New Web Service"**
4. Connect your GitHub repo
5. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Click **Deploy** — done! You get a free URL like `https://parentlink.onrender.com`

---

## 📤 Pushing to GitHub

```bash
# 1. Go into project folder
cd parentlink

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. First commit
git commit -m "Initial commit - ParentLink app"

# 5. Create repo on github.com, then connect it:
git remote add origin https://github.com/YOUR_USERNAME/parentlink.git

# 6. Push!
git push -u origin main
```

---

## 🔮 Future Plans
- [ ] Remote control (not just viewing)
- [ ] Tamil/Kannada/Hindi language support
- [ ] Auto-reconnect if internet drops
- [ ] In-app voice call

---

Made with ❤️ to help parents who didn't grow up with smartphones.
