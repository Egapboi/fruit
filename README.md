# 🌱 Gardening Buddy

A modern full-stack plant care application with AI-powered features, built with React and Node.js.

![Gardening Buddy](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-blue) ![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB) ![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)

## ✨ Features

### 🤖 AI Plant Assistant
- **Gemini 2.5 Flash** powered chatbot for plant care advice
- Supports **markdown formatting** (bold, lists, code blocks)
- Conversation history for context-aware responses
- Suggested questions for new users

### 📸 Plant Identification
- **TensorFlow.js** integration ready for Teachable Machine models
- Upload or capture plant photos
- Intelligent demo mode with 15+ plant predictions
- Shows care info: watering, light, and difficulty level

### 📝 Dynamic Quiz System
- **20 randomized questions** about plants and gardening
- 5 questions per session (different each time)
- Answer feedback with correct/incorrect indicators
- Progress bar and score tracking

### 🏆 Leaderboard
- Top 10 scores ranked by percentage
- Trophy, medal, and award icons for top 3
- Username, score, and date display

### 🔐 Authentication
- Username/password signup and login
- JWT token-based authentication
- Protected routes

### 🎨 UI/UX
- **Liquid Glass Design** with glassmorphism effects
- Animated gradient backgrounds
- Smooth animations with Framer Motion
- Responsive mobile-friendly layout
- Floating glass navigation bar

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Egapboi/fruit.git
   cd fruit
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend**
   ```bash
   cd ../backend
   node server.js
   ```

5. **Start the frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## ⚙️ Configuration

### Gemini AI (Chatbot)
The chatbot uses **Gemini 2.5 Flash**. The API key is configured in:
```
backend/routes/chatRoutes.js
```

To use your own API key:
1. Get a free key from [Google AI Studio](https://aistudio.google.com/)
2. Set environment variable: `GEMINI_API_KEY=your-key-here`

### Plant Identification (Teachable Machine)
To use a custom Teachable Machine model:
1. Train at [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Create `frontend/.env`:
   ```
   VITE_PLANT_MODEL_URL=https://teachablemachine.withgoogle.com/models/YOUR_ID/
   ```
3. Restart the frontend

---

## 📁 Project Structure

```
fruit/
├── backend/
│   ├── server.js           # Express server entry
│   ├── database.js         # SQLite setup
│   ├── routes/
│   │   ├── authRoutes.js   # Login/Signup
│   │   ├── chatRoutes.js   # Gemini AI chat
│   │   ├── plantRoutes.js  # Plant data
│   │   └── quizRoutes.js   # Quiz + Leaderboard
│   └── data/
│       ├── plants.json     # Plant database
│       └── questions.json  # Quiz questions
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── PlantSelector.jsx
│   │   │   ├── CameraUpload.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Chatbot.jsx
│   │   ├── components/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── plantModel.js
│   │   └── index.css       # Liquid Glass styles
│   └── package.json
│
└── README.md
```

---

## ⚠️ Known Issues & Limitations

### May Not Work / Could Break:

1. **Gemini API Rate Limiting**
   - Free tier has rate limits; chatbot may fail if quota exceeded
   - Wait a few minutes and try again

2. **Plant Identification (Demo Mode)**
   - Without a configured Teachable Machine model, uses random predictions
   - Color-based analysis is approximate, not real AI classification

3. **TensorFlow.js Loading**
   - First load may be slow (downloads ~5MB model)
   - May fail on older browsers or low-memory devices

4. **SQLite Database**
   - Data stored in `backend/fruit_app.db`
   - Deleting this file resets all users and scores

5. **CORS Issues**
   - If frontend/backend ports change, update CORS in `server.js`

6. **Authentication**
   - Tokens don't expire (production should add expiration)
   - Passwords hashed but security not production-grade

7. **Browser Compatibility**
   - Glassmorphism effects may not work in older browsers
   - Tested on Chrome, Edge, Firefox (latest versions)

8. **Mobile Camera**
   - Camera capture may not work on all mobile browsers
   - File upload fallback should work

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Framer Motion |
| UI | Vanilla CSS (Liquid Glass design) |
| Backend | Node.js, Express |
| Database | SQLite |
| AI Chat | Google Gemini 2.5 Flash |
| Plant ID | TensorFlow.js, Teachable Machine |
| Auth | JWT, bcryptjs |

---

## 📄 License

MIT License - feel free to use and modify!

---

## 🙌 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

Made with 💚 by Sunil(me) and Jiban
