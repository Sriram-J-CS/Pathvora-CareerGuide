# 🌌 Pathvora CareerGuide™ - AI-Powered Career Guidance Platform

Pathvora CareerGuide is an AI-powered Career Guidance Platform designed to guide Indian students in three life stages (12th Standard, Undergraduate, and Postgraduate) through personalized career pathways, interactive 3D roadmaps, ATS resume scans, mock interview simulators, and skills gap upskilling.

---

## 🛠️ Tech Stack
*   **Frontend:** React (Vite), React Three Fiber (Three.js 3D Roadmap), Tailwind CSS, React Router, Recharts, Framer Motion, Lucide Icons.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB / Mongoose ORM (with automatic fallback to local JSON database files when offline).
*   **Auth:** JWT (JSON Web Tokens), BCrypt hashing, HTTP-Only Cookie storage.
*   **AI:** Anthropic Claude API (with mock counseling rules fallback engine when API credits are low).
*   **File Handling:** Multer (in-memory buffer parsing) + pdf-parse + mammoth.
*   **Mail:** Nodemailer SMTP email service (welcome emails on sign-up + contact forms gateway).

---

## 📂 Project Directory Structure
```
Pathvora/
├── client/                     # React (Vite) Frontend
│   ├── src/
│   │   ├── components/         # Shared widgets (Navbar, Logo, 3D Roadmap canvas, Chatbot)
│   │   ├── context/            # AuthContext (JWT + Session)
│   │   ├── pages/              # Onboarding, Dashboard, Landing, Contact form
│   │   ├── App.jsx             # Routing configuration
│   │   └── index.css           # Styling HSL color tokens
│   └── vite.config.js          # API proxy settings
├── server/                     # Express Backend
│   ├── models/                 # Mongoose Schemas (User, Profile, JournalEntry, etc.)
│   ├── routes/                 # Express REST Endpoints (auth, jobs, chatbot, resume, contact)
│   ├── middleware/             # Protected session & error middlewares
│   ├── emailService.js         # Nodemailer mail transport service
│   ├── aiService.js            # Claude API + Mock counselor fallback retry controller
│   ├── db.js                   # Mongoose to JSON database adapter
│   ├── seed.js                 # Seeding script
│   └── index.js                # Server listener
├── data_db/                    # Local JSON fallback databases, emails.log, and error logs (gitignored)
├── package.json                # Root package with Concurrently setup scripts
└── README.md                   # System specifications
```

---

## 🚀 Local Installation & Execution

Follow these steps to run Pathvora CareerGuide locally on your workstation:

### 1. Configure Environment variables
Create a `.env` file in the project root directory (same folder as this README) and input your parameters:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pathvora
JWT_SECRET=pathvora-super-secret-key-2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional AI & Mail Credentials (Mock engines step in if missing)
ANTHROPIC_API_KEY=your-claude-api-key
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 2. Install Project Dependencies
Run the unified setup command to install dependencies across the root, client, and server workspaces:
```bash
npm run setup
```

### 3. Seed the Database
Populate the domain demand database coordinates:
```bash
npm run seed
```

### 4. Boot the Development Environment
Boot both the Express backend API and the Vite React client concurrently:
```bash
npm run dev
```

### 5. Access the Platform
Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ⚡ Production Compiling
To build the optimized client bundle:
```bash
npm run build
```
The compiled files will reside under `client/dist/`, which the Express server serves automatically when running in `production` mode.
