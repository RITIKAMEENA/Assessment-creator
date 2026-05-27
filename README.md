# VedaAI – AI Assessment Creator

A full-stack AI Assessment Creator built for the VedaAI Full Stack Engineering assignment.

## Features

- Assignment creation form inspired by the provided Figma flow
- Optional PDF/text upload
- Due date, question type, number of questions, marks and instructions
- Frontend validation for empty and negative values
- Zustand-ready frontend architecture
- Node.js + Express + TypeScript backend
- MongoDB storage for assignments and generated results
- Redis job-state caching
- BullMQ background worker for AI generation
- WebSocket real-time status updates
- Structured question paper output
- Student info section with input lines
- Difficulty tags and marks display
- Regenerate action
- Proper PDF export using `@react-pdf/renderer`, not raw browser print

## Architecture

```txt
Teacher UI (Next.js)
        |
        | POST /api/assignments
        v
Express API (TypeScript)
        |
        | stores assignment
        v
MongoDB
        |
        | add job
        v
BullMQ Queue ---- Redis job state/cache
        |
        v
Worker generates structured question paper
        |
        | save generated result
        v
MongoDB
        |
        | publish event
        v
WebSocket -> Frontend live update
```

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Zustand
- Socket.IO Client
- React PDF

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Redis
- BullMQ
- Socket.IO
- Gemini API optional / mock AI default

## Folder Structure

```txt
vedaai-assessment-creator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── workers/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo-url>
cd vedaai-assessment-creator
npm install
```

### 2. Start MongoDB and Redis

```bash
docker compose up -d
```

### 3. Environment files

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/vedaai-assessment
REDIS_HOST=localhost
REDIS_PORT=6379
AI_PROVIDER=mock
GEMINI_API_KEY=
```

Create `frontend/.env.local` from `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Run backend API

```bash
npm run dev --workspace backend
```

### 5. Run worker in another terminal

```bash
npm run worker --workspace backend
```

### 6. Run frontend in another terminal

```bash
npm run dev --workspace frontend
```

Open:

```txt
http://localhost:3000
```

## AI Mode

The app works without a paid API using mock generation:

```env
AI_PROVIDER=mock
```

To use Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

The backend converts assignment input into a structured prompt and parses the model output into a controlled JSON schema. The frontend never renders raw LLM text.

## API Endpoints

### Create assignment

```http
POST /api/assignments
Content-Type: multipart/form-data
```

Fields:

- `title`
- `subject`
- `dueDate`
- `questionTypes` JSON string
- `instructions`
- `file` optional PDF/text

### Get assignment

```http
GET /api/assignments/:id
```

### Regenerate

```http
POST /api/assignments/:id/regenerate
```

## WebSocket Events

Client joins assignment room:

```txt
join-assignment -> assignmentId
```

Server emits:

```txt
assignment-update
```

Payload:

```json
{
  "assignmentId": "...",
  "status": "queued | generating | completed | failed"
}
```

## Deployment Suggestion

- Frontend: Vercel
- Backend: Render / Railway
- MongoDB: MongoDB Atlas
- Redis: Upstash / Railway Redis

Update environment variables after deployment:

```env
CLIENT_URL=https://your-frontend-url.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-url
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url
```

## Assignment Checklist

- [x] Assignment creation frontend
- [x] File upload optional
- [x] Due date
- [x] Question types
- [x] Number of questions and marks
- [x] Additional instructions
- [x] Validation
- [x] Zustand state management setup
- [x] WebSocket management
- [x] Structured prompt creation
- [x] Structured parsed output
- [x] Node.js + Express + TypeScript backend
- [x] MongoDB storage
- [x] Redis caching/job state
- [x] BullMQ background jobs
- [x] Worker generation flow
- [x] Real-time frontend updates
- [x] Structured output page
- [x] Student info section
- [x] Section-wise questions
- [x] Difficulty badges
- [x] Marks display
- [x] Mobile responsive layout
- [x] PDF download
- [x] Regenerate action

## Notes

The UI is built to match the assignment expectations: clean, readable, exam-paper style and responsive. For exact pixel-perfect Figma matching, export the Figma assets/screenshots and replace layout tokens/colors accordingly.
