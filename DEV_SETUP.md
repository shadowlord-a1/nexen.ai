# NEXEN.AI Portfolio - Local Development Guide

## 🚀 Quick Start

Your website is now running locally and fully functional!

### Current Status
✅ Server Running on: **http://localhost:8080**
✅ All API endpoints working
✅ Portfolio loading dynamically
✅ Live news feed active

---

## 📋 Setup Instructions

### Prerequisites
- Node.js installed (v14 or higher)
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:8080
   ```

---

## 🔗 Available API Endpoints

### Get News Feed
```bash
GET /api/news
```
Returns array of news items with emoji and headlines.

### Update News Feed
```bash
POST /api/news
Content-Type: application/json

{
  "news": [
    { "emoji": "🤖", "headline": "Your news here" }
  ]
}
```

### Get Portfolio Projects
```bash
GET /api/projects
```
Returns portfolio projects from `data/projects.json`.

---

## 📁 Project Structure

```
shadowlord-repo/
├── public/
│   ├── index.html          (Main website)
│   ├── Agency-logo.png
│   ├── workflow1.png
│   ├── workflow2.png
│   ├── workflow3.png
│   └── images/             (Portfolio images)
├── data/
│   └── projects.json       (Portfolio data)
├── api/
│   └── news.js             (Original Vercel API)
├── server.js               (Local development server)
├── package.json
├── vercel.json             (For Vercel deployment)
└── README.md
```

---

## 🛠 Making Changes

### Edit Website Content
- Edit `public/index.html` for HTML/CSS changes
- Changes will reflect after refreshing the browser

### Update Portfolio Projects
- Edit `data/projects.json` to add/update projects
- Refresh browser to see changes

### Modify News Feed
- Edit news data in `server.js` (line where `newsData` is defined)
- Or use the POST `/api/news` endpoint

---

## ⚡ Features Included

✅ Responsive design (Mobile & Desktop)
✅ Dark theme with lime/cyan accents
✅ Live news feed system
✅ Dynamic portfolio loading
✅ Smooth animations & transitions
✅ 3D workflow cube rotation
✅ Contact form with validation
✅ Social media links
✅ Telegram integration ready
✅ Supabase integration ready

---

## 📞 Contact Information

- **Email**: nagasaireddy0123@gmail.com
- **Phone**: +91 72039 59848
- **Instagram**: @nexen.ai.sr
- **LinkedIn**: Nagasai Reddy (CEO)
- **GitHub**: SaiReddy-Sr

---

## 🚢 Ready to Deploy

Once you've tested locally and everything looks good:

### Deploy to Vercel
```bash
git push origin main
```

The `vercel.json` configuration is already set up for automatic deployment.

---

## ✨ Quick Fixes Made

1. ✅ Moved `index.html` to `/public/index.html`
2. ✅ Created Express.js local server
3. ✅ Fixed API endpoints for local development
4. ✅ Copied all assets to `/public` directory
5. ✅ Updated relative paths in portfolio loading
6. ✅ Added sample news data
7. ✅ Created proper NPM configuration

---

## 🆘 Troubleshooting

**Port 8080 already in use?**
- Edit `server.js` and change PORT to another number (e.g., 3001, 5000)
- Or set environment variable: `PORT=3001 npm start`

**Portfolio not loading?**
- Check browser console for errors
- Verify `data/projects.json` exists
- Check that `/api/projects` endpoint returns data

**Images not showing?**
- Ensure all assets are in `/public` directory
- Check image paths in HTML (should be relative)

---

## 📝 Notes

- The site is fully functional locally
- All animations and interactions work
- Contact form is connected to Supabase (configured in HTML)
- Telegram notifications are ready (bot token in HTML)
- Ready to push to GitHub anytime

