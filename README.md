# 📝 NoteCraft — Private Notes Vault

A secure, minimalist web application for creating and managing private notes. Built with modern authentication, strict data ownership, and a calm, distraction-free UI.

![NoteCraft](https://img.shields.io/badge/NoteCraft-Private%20Notes-blue?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Key Features

### Core Features

| Feature             | Status | Description                              |
| ------------------- | ------ | ---------------------------------------- |
| Email/Password Auth | ✅     | Secure signup and login via Supabase     |
| Google OAuth        | ✅     | One-click authentication with Google     |
| Create Notes        | ✅     | Write and save private notes             |
| View Notes          | ✅     | Browse notes in a clean list             |
| View Single Note    | ✅     | Focused reading/editing view             |
| Delete Notes        | ✅     | Soft delete (Trash) + permanent delete   |
| Row Level Security  | ✅     | Database policies enforce data ownership |

## 🏗️ Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | Vanilla JavaScript, CSS3       |
| Backend  | Hono.js (Edge Framework)       |
| Database | Supabase (PostgreSQL)          |
| Auth     | Supabase Auth (Email + Google) |
| Hosting  | Cloudflare Pages/Workers       |
| Security | Row Level Security (RLS)       |

---

## 📊 Database Schema

```sql
notes
├── id            (UUID, Primary Key)
├── user_id       (UUID → auth.users)
├── title         (Text, required)
├── content       (Text)
├── is_favorite   (Boolean, default: false)
├── is_deleted    (Boolean, default: false)
├── category      (Text, optional)
├── created_at    (Timestamp)
└── updated_at    (Timestamp)
```

---

## 🔐 Security

- ✅ **Row Level Security** — Database-level policy enforcement
- ✅ **JWT Authentication** — Secure session management
- ✅ **Data Isolation** — Users can ONLY access their own notes
- ✅ **HTTPS Encryption** — All data encrypted in transit
- ✅ **Password Hashing** — Bcrypt via Supabase Auth

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### Setup

```bash
# Clone the repository
git clone https://github.com/PushprajPandey/NoteCraft.git
cd NoteCraft

# Install dependencies
npm install
```

### Configure Environment

Create `.dev.vars` file:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Deploy

```bash
npm run build
npm run deploy
```

---

## 📁 Project Structure

```
notecraft/
├── index.html          # Main application
├── src/
│   └── index.ts        # Backend API (Hono.js)
├── public/             # Static assets
├── SETUP_SUPABASE.md   # Database setup guide
├── DEPLOYMENT.md       # Deployment instructions
├── package.json        # Dependencies
├── wrangler.toml       # Cloudflare config
└── README.md           # This file
```

---

## 🛠️ API Endpoints

| Endpoint         | Method | Description     |
| ---------------- | ------ | --------------- |
| `/api/notes`     | GET    | List all notes  |
| `/api/notes`     | POST   | Create note     |
| `/api/notes/:id` | GET    | Get single note |
| `/api/notes/:id` | PUT    | Update note     |
| `/api/notes/:id` | DELETE | Delete note     |

---

## 👤 Author

**Pushpraj Pandey**

---

<p align="center">
  <strong>Made with ❤️ </strong>
  <br><br>
  
</p>
