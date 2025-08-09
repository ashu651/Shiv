# Snapzy - Instagram-like Social App

A modern full-stack social media platform built with React, Node, and MongoDB.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT
- Images: Cloudinary (or local storage with Sharp thumbnails)
- Realtime: Socket.IO

## Features
- Register and Login
- Upload images with captions (+ automatic thumbnail)
- Feed of posts from followed users with pagination
- Like and comment on posts
- Follow/Unfollow users
- User profile with posts, followers, following
- Edit profile (bio, avatar)
- Explore page with hashtags and pagination
- Bookmarks (save/unsave posts)
- Notifications (follow, like, comment) with real-time badge and list

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
   Required keys:
   - `PORT`: API port (default 5000)
   - `MONGO_URI`: MongoDB connection
   - `JWT_SECRET`: strong random secret
   - `CLIENT_URL`: frontend origin for CORS (e.g. http://localhost:5173)
   - `USE_CLOUDINARY`: `true` to use Cloudinary; `false` for local storage
   - If using Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (and optional `CLOUDINARY_FOLDER`)
   - If using local storage: ensure `UPLOAD_DIR` exists or writable
2. Install dependencies:
   ```bash
   cd backend
   npm i
   ```
3. Run in dev mode:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Copy env file (adjust API URL if needed):
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   - `VITE_API_URL`: e.g. `http://localhost:5000/api`
2. Install dependencies:
   ```bash
   cd frontend
   npm i
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

The app runs at `http://localhost:5173` and talks to the API at `http://localhost:5000/api`.

## API Overview
Base URL: `/api`
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/me`, `GET /auth/health`
- Posts:
  - `GET /posts/feed?page=&limit=`
  - `GET /posts/explore?page=&limit=&tag=`
  - `GET /posts/user/:userId?page=&limit=`
  - `GET /posts/bookmarks?page=&limit=`
  - `POST /posts` (multipart: `image`, `caption`)
  - `POST /posts/:postId/like`
  - `POST /posts/:postId/comment`
  - `POST /posts/:postId/bookmark`
  - `PUT /posts/:postId` (update caption/hashtags)
  - `DELETE /posts/:postId`
- Users: `GET /users/:username`, `POST /users/:userId/follow`, `POST /users/:userId/unfollow`, `GET /users/search?q=...`
- Notifications: `GET /notifications`, `POST /notifications/read`

## Realtime
- The frontend connects to the backend Socket.IO server using the JWT token.
- Events emitted to users:
  - `notification`: on like, comment, or follow
  - `new_post`: when someone you follow posts

## Production Notes
- Set strong `JWT_SECRET` and real `CLOUDINARY_*` env vars in production.
- Behind a reverse proxy, set appropriate CORS `CLIENT_URL`.
- Use a process manager (PM2) or container for the backend; enable HTTPS.
- Configure MongoDB indexes, monitoring, and backups.
- Local uploads: ensure `/uploads` and `/uploads/thumbs` are persistent and readable.

## Scripts
- Backend: `npm run dev` (dev), `npm start` (prod)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## License
MIT