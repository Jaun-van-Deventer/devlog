# DevLog

DevLog is a full-stack developer productivity app for tracking projects, issues, coding sessions, and progress.

## Stack

- Frontend: React, TypeScript, Vite, React Router, Axios, TanStack Query, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Zod
- Database: PostgreSQL with Prisma

## Setup

1. Copy environment values:

```bash
cp backend/.env.example backend/.env
```

2. Start PostgreSQL and the backend container:

```bash
docker compose up postgres backend
```

3. Or run locally:

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The API runs on `http://localhost:5000` and the frontend runs on `http://localhost:5173`.

## API

Responses use a consistent shape:

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "message": "Project not found" }
```

### Routes

- `GET /api/dashboard`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/issues`
- `GET /api/issues/:id`
- `POST /api/issues`
- `PUT /api/issues/:id`
- `DELETE /api/issues/:id`
- `GET /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/sessions`
- `DELETE /api/sessions/:id`
