# Samandar Portfolio — Full Stack

A complete portfolio with React frontend, Node.js serverless API, MongoDB database, admin panel, blog, contact form with email, and analytics.

---

## 🗂 Project Structure

```
portfolio-fullstack/
├── frontend/          ← React + Vite app (your portfolio UI)
│   └── src/
│       ├── pages/     ← Portfolio, Blog, BlogPost, Admin
│       ├── components/ ← Navbar, Hero, About, Services, MyWork, Contact, Footer
│       └── lib/       ← api.js (fetch wrapper), useAnalytics.js
├── api/               ← Vercel Serverless Functions (Node.js)
│   ├── contact/       ← POST /api/contact
│   ├── projects/      ← GET/POST /api/projects, PUT/DELETE /api/projects/[id]
│   ├── blog/          ← GET/POST /api/blog, GET/PUT/DELETE /api/blog/[slug]
│   ├── analytics/     ← POST/GET /api/analytics
│   ├── admin/         ← POST /api/admin/login, GET/PUT/DELETE /api/admin/messages
│   └── _lib/          ← db.js (MongoDB), auth.js (JWT)
├── vercel.json        ← Deployment config
├── .env.example       ← All required environment variables
└── README.md
```

---

## 🚀 Setup Guide

### Step 1 — MongoDB Atlas (free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **free cluster** (M0)
3. Create a database user (Database Access → Add New User)
4. Allow all IPs (Network Access → Add IP Address → Allow from Anywhere: `0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<password>` with your user's password

### Step 2 — Gmail App Password (for email notifications)

1. Go to [myaccount.google.com](https://myaccount.google.com) → Security
2. Enable **2-Step Verification** if not already on
3. Search for **App Passwords** → create one for "Mail"
4. Copy the 16-character password (it's shown only once)

### Step 3 — Deploy to Vercel (free)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. In **Environment Variables**, add all variables from `.env.example`:
   - `MONGODB_URI`
   - `JWT_SECRET` (run `openssl rand -base64 32` to generate one)
   - `ADMIN_PASSWORD` (choose a strong password)
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `NOTIFY_EMAIL`
   - `FRONTEND_URL` (your Vercel URL — add after first deploy)
4. Click **Deploy** ✓

### Step 4 — Local Development

```bash
# Install all deps
cd frontend && npm install
cd ../api && npm install

# Run frontend (Vite dev server)
cd frontend && npm run dev

# The API works in production via Vercel.
# For local API testing, install Vercel CLI:
npm install -g vercel
vercel dev  # runs both frontend and API locally
```

---

## 🔐 Admin Panel

Visit `/admin` on your deployed site (or `localhost:3000/admin` locally).

Log in with your `ADMIN_PASSWORD` environment variable.

**What you can do:**
- **Projects** — Add/edit/delete portfolio projects with images, live links, GitHub links
- **Blog** — Write and publish articles (supports HTML in content)
- **Messages** — Read all contact form submissions, reply by email, delete
- **Analytics** — View page views, most-visited sections, top referrers, daily chart

---

## 📝 Adding Your Real Projects

1. Go to `/admin` → Projects tab
2. For images, upload screenshots to [imgbb.com](https://imgbb.com) or [cloudinary.com](https://cloudinary.com) (both free) and paste the URL
3. Add your live URL and GitHub URL
4. Hit "Add Project" — it appears instantly on your portfolio

---

## 📬 How the Contact Form Works

1. Visitor fills out the form
2. Message is saved to MongoDB (visible in admin panel)
3. You receive an email notification at `NOTIFY_EMAIL`
4. Reply directly from your email app (reply-to is set to the visitor's email)

---

## 🌐 Routes

| Route | Description |
|-------|-------------|
| `/` | Main portfolio page |
| `/blog` | Blog listing |
| `/blog/:slug` | Individual blog post |
| `/admin` | Admin panel (password protected) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | — | List all projects |
| POST | `/api/projects` | Admin | Create project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| GET | `/api/blog` | — | List published posts |
| GET | `/api/blog/:slug` | — | Get single post |
| POST | `/api/blog` | Admin | Create post |
| PUT | `/api/blog/:slug` | Admin | Update post |
| DELETE | `/api/blog/:slug` | Admin | Delete post |
| POST | `/api/contact` | — | Send message |
| GET | `/api/admin/messages` | Admin | Get all messages |
| PUT | `/api/admin/messages?id=x` | Admin | Mark as read |
| DELETE | `/api/admin/messages?id=x` | Admin | Delete message |
| POST | `/api/analytics` | — | Track event |
| GET | `/api/analytics` | Admin | Get stats |
| POST | `/api/admin/login` | — | Get JWT token |
