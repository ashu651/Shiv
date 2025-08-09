# Snapzy Backend

## Run
- Copy `.env.example` to `.env`
- `npm i`
- `npm run dev`

## Env
- `PORT` - API port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - CORS origin for the frontend
- `USE_CLOUDINARY` - true/false
- `CLOUDINARY_*` - credentials when using Cloudinary
- `UPLOAD_DIR` - local uploads directory when not using Cloudinary

## Routes
- `/api/auth/*`
- `/api/posts/*`
- `/api/users/*`