# Furit Backend

Node.js + Express backend for the Furit application.

## Setup

1.  Navigate to `Shinobu-34/test_hack/backend`.
2.  Install dependencies: `npm install`.
3.  Start server: `npm start` (Runs on port 3000).

## API Endpoints

### Auth
- `POST /api/auth/register` - Body: `{ username, password }`
- `POST /api/auth/login` - Body: `{ username, password }`

### Plants
- `GET /api/plants` - List all plants
- `GET /api/plants/search?q=query` - Search plants by name
- `GET /api/plants/:id` - Get specific plant details

### Quiz
- `GET /api/quiz` - Get quiz questions
- `POST /api/quiz/submit` - Body: `{ userId, score }`
- `GET /api/quiz/progress/:userId` - Get progress for a user

### AI (Mock)
- `POST /api/ai/classify` - Form-data: `image` (file). Returns mock classification result.

## Data Persistence
Uses SQLite (`fruit_app.db`). Database tables and file are created automatically on first run.
