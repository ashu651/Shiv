# Snapzy - Instagram-like Social App

A modern full-stack social media platform built with React, Node, and MongoDB.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT
- Images: Cloudinary (or local storage)

## Features
- Register and Login
- Upload images with captions
- Feed of posts from followed users
- Like and comment on posts
- Follow/Unfollow users
- User profile with posts, followers, following
- Edit profile (bio, avatar)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)
- Cloudinary account (optional; set `USE_CLOUDINARY=false` to store locally)

### Backend Setup
1. Copy env file and edit values:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Install dependencies:
   ```bash
   cd backend
   npm i
   ```
3. Run in dev mode:
   ```bash
   npm run dev
   ```

The API runs at `http://localhost:5000`.

### Frontend Setup
1. Copy env file (adjust API URL if needed):
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Install dependencies:
   ```bash
   cd frontend
   npm i
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

The app runs at `http://localhost:5173`.

## API Overview
Base URL: `/api`
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/me`
- Posts: `GET /posts/feed`, `GET /posts/user/:userId`, `POST /posts` (multipart: image, caption), `POST /posts/:postId/like`, `POST /posts/:postId/comment`, `PUT /posts/:postId`, `DELETE /posts/:postId`
- Users: `GET /users/:username`, `POST /users/:userId/follow`, `POST /users/:userId/unfollow`, `GET /users/search?q=...`

## Production Notes
- Set strong `JWT_SECRET` and real `CLOUDINARY_*` env vars in production.
- Behind a reverse proxy, set appropriate CORS `CLIENT_URL`.
- Use a process manager (PM2) or container for the backend.
- Configure MongoDB indexes and backup.
- For local storage, ensure `/uploads` is writable.

## License
MIT