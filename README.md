# 🧭 3MTT Compass AI — Personalised Learning Pathfinder

> **AI-powered learning companion for Nigeria's 3MTT program**
> React + TypeScript frontend · Flask + MongoDB backend · Groq Llama 3.3 AI

🔗 **Live:** [3mtt-compass-ai.vercel.app](https://3mtt-compass-ai.vercel.app/)
🤖 **AI:** Groq Llama 3.3 70B (fast, free tier available)

---

## 🚀 What's Inside

| Feature | Status | Notes |
|---|---|---|
| 🤖 Compass AI Chat | ✅ Real AI | Groq Llama 3.3 · context-aware |
| 💡 Smart Recommendations | ✅ Real AI | Track + level personalised |
| 📊 AI Learning Insights | ✅ Real AI | Progress score, strengths, gaps |
| 🔍 Semantic Search | ✅ Real AI | Natural language content search |
| 🎯 Assessment Analysis | ✅ Real AI | AI determines skill level |
| 🌐 Landing Page | ✅ New | Public homepage before login |
| 🔐 JWT Auth | ✅ Live | MongoDB Atlas |
| 📚 12 Learning Tracks | ✅ | All 3MTT tracks covered |
| 🏆 Achievement System | ✅ | Points, badges, milestones |

---

## ⚙️ Environment Variables (Required)

### Backend (`backend/.env`)
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/3mtt_compass
SECRET_KEY=your-long-random-jwt-secret
GROQ_API_KEY=gsk_xxxxxxxxxxxx
FLASK_ENV=production
```

### Frontend (`.env.local`)
```
VITE_API_URL=https://your-backend.onrender.com
```

> ⚠️ **IMPORTANT:** Never commit `.env` files. The `.gitignore` now excludes them.

---

## 🔑 Getting Your Keys

**Groq API Key (free):**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create new key
3. Copy and add to `backend/.env` as `GROQ_API_KEY`

**MongoDB Atlas:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Connect → Drivers → Copy connection string
4. Replace `<username>` and `<password>` in the string
5. Add to `backend/.env` as `MONGO_URI`

> ⚠️ If your old MongoDB credentials were exposed, rotate them now:
> Atlas → Database Access → Edit user → Reset password

---

## 💻 Local Development

```bash
# 1. Clone
git clone https://github.com/Eminence-Pyro/3MTT-Compass-AI.git
cd 3MTT-Compass-AI

# 2. Frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL

# 3. Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your keys

python app.py

# 4. Frontend (separate terminal)
cd ..
npm run dev
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
vercel --prod
```
Add `VITE_API_URL` in Vercel → Project Settings → Environment Variables.

### Backend → Render (or Railway)
1. Connect your GitHub repo
2. Set Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn app:app`
5. Add environment variables: `MONGO_URI`, `SECRET_KEY`, `GROQ_API_KEY`

---

## 🏗️ Architecture

```
3MTT-Compass-AI/
├── src/
│   ├── pages/
│   │   ├── Landing.tsx        ← Public homepage (new)
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Index.tsx          ← Main dashboard
│   ├── components/
│   │   ├── ai/
│   │   │   ├── ConversationalAI.tsx    ← Real Groq chat
│   │   │   ├── SmartRecommendations.tsx← Real AI recs
│   │   │   ├── AutomatedInsights.tsx   ← Real AI insights
│   │   │   ├── SemanticSearch.tsx      ← Real AI search
│   │   │   └── ...others
│   │   └── ...
│   ├── services/
│   │   └── apiService.ts      ← All backend API calls
│   └── ...
├── backend/
│   ├── app.py                 ← Flask + Groq AI routes
│   ├── requirements.txt
│   └── .env.example           ← Template (copy to .env)
├── .env.example               ← Frontend env template
└── .gitignore                 ← Excludes .env files
```

---

## 🗺️ Roadmap

- [ ] Add real 3MTT module URLs and resources
- [ ] Certificate generation on track completion
- [ ] Leaderboard for fellows in the same track
- [ ] Daily streak tracking
- [ ] Offline PWA support
- [ ] Nigerian language support (Yoruba, Igbo, Hausa)

---

*Built with ♥ for Nigerian 3MTT Fellows · Powered by Groq + Flask + React*
