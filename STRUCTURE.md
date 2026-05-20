# Project Structure

## Root
```
Church_Directory/
  server/       - Express backend (API, database, auth)
  client/       - React frontend (Vite)
```

## Server
```
server/
  src/
    app.js              - Entry point: starts the server, registers routes
    config/
      db.js             - PostgreSQL connection (connects to Supabase)
      cloudinary.js     - Cloudinary connection (for image uploads)
    controllers/
      authController.js - Logic for register and login
      usersController.js- Logic for getting and updating users
    middleware/
      authMiddleware.js  - Checks JWT on protected routes (blocks unauthenticated requests)
      upload.js          - Handles photo uploads (multer + Cloudinary)
    models/
      userModel.js       - All database queries for the users table
    routes/
      authRoutes.js      - Defines /api/auth/register and /api/auth/login
      usersRoutes.js     - Defines /api/users endpoints
```

## Client
```
client/
  src/
    api/          - Functions for making requests to the backend
    components/   - Reusable UI pieces used across multiple pages
    context/      - Global state (stores the logged-in user and JWT)
    pages/        - One file per screen (Login, Register, Directory, etc.)
    assets/       - Images and icons
    App.jsx       - Sets up routes and navigation
    main.jsx      - Entry point: mounts the React app into index.html
```
