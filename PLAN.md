# Church Directory Web App — Implementation Plan

## Context

The church currently has a Subsplash website and app. We're building a standalone web application — a member directory — that users can link to from both. Members create an account, upload a photo, and can view other members once logged in. The goal is to build this step-by-step as a learning exercise, with clean, well-commented, scalable code.

---

## Tech Stack

| Layer        | Technology                                 | Why                                                        |
| ------------ | ------------------------------------------ | ---------------------------------------------------------- |
| Frontend     | React + Vite                               | Fast dev server, industry standard, great for learning     |
| Backend      | Node.js + Express                          | JavaScript on both sides (easier to learn), huge ecosystem |
| Database     | PostgreSQL                                 | Relational, free on Railway/Supabase, scales well          |
| Auth         | JWT (JSON Web Tokens)                      | Stateless, works great across frontend/backend             |
| File Storage | Cloudinary                                 | Free tier, handles image uploads + optimization            |
| Deployment   | Vercel (frontend) + Railway (backend + DB) | Both have free tiers                                       |

---

## Folder Structure

```
church-directory/
├── client/                        # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI pieces (Button, Input, MemberCard, etc.)
│   │   ├── pages/                 # Full page views (LoginPage, RegisterPage, DirectoryPage)
│   │   ├── context/               # AuthContext — tracks logged-in user across the app
│   │   ├── hooks/                 # Custom hooks (useAuth, useFetch, etc.)
│   │   ├── services/              # API call functions (auth.js, members.js)
│   │   ├── utils/                 # Small helper functions
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # App entry point
│   ├── .env                       # VITE_API_URL=...
│   └── package.json
│
├── server/                        # Node.js + Express backend
│   ├── src/
│   │   ├── config/                # db.js (PostgreSQL pool), cloudinary.js
│   │   ├── controllers/           # authController.js, usersController.js
│   │   ├── middleware/            # authMiddleware.js (JWT verification), errorHandler.js
│   │   ├── models/                # userModel.js (SQL query functions)
│   │   ├── routes/                # authRoutes.js, usersRoutes.js
│   │   └── app.js                 # Express app setup + entry point
│   ├── .env                       # DB_URL, JWT_SECRET, CLOUDINARY_* keys
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Database Schema

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  address       TEXT,                          -- optional
  profile_picture_url TEXT,                    -- stored as Cloudinary URL
  created_at    TIMESTAMP     DEFAULT NOW(),
  updated_at    TIMESTAMP     DEFAULT NOW()
);
```

---

## API Endpoints (REST)

| Method | Route              | Auth Required | Description                  |
| ------ | ------------------ | ------------- | ---------------------------- |
| POST   | /api/auth/register | No            | Create account, returns JWT  |
| POST   | /api/auth/login    | No            | Login, returns JWT           |
| GET    | /api/auth/me       | Yes           | Get logged-in user's profile |
| GET    | /api/users         | Yes           | Get all church members       |
| GET    | /api/users/:id     | Yes           | Get a specific member        |
| PUT    | /api/users/:id     | Yes           | Update own profile           |

---

## Frontend Pages & Routes

| Path            | Page                                  | Protected? |
| --------------- | ------------------------------------- | ---------- |
| `/`             | Redirects to `/login` or `/directory` | No         |
| `/login`        | LoginPage                             | No         |
| `/register`     | RegisterPage                          | No         |
| `/directory`    | DirectoryPage — shows all members     | Yes        |
| `/profile/:id`  | MemberProfilePage                     | Yes        |
| `/profile/edit` | EditProfilePage                       | Yes        |

---

## Auth Flow

1. User registers → password hashed with bcrypt → stored in DB → JWT returned
2. User logs in → password compared with bcrypt → JWT returned
3. JWT stored in browser localStorage
4. `AuthContext` reads JWT on app load, decodes user, provides to all pages
5. Protected routes redirect to `/login` if no valid JWT
6. Backend `authMiddleware` verifies JWT on every protected API call

---

## Build Order (Step-by-Step for Coding Along)

We'll build this in small, explained blocks in this order:

### Phase 1 — Project Setup

1. Create `client/` with Vite + React
2. Create `server/` with Node.js + Express
3. Set up `.gitignore`, folder structure, and initial `package.json` files

### Phase 2 — Backend Foundation

4. Set up PostgreSQL connection (`config/db.js`)
5. Create the `users` table (SQL migration)
6. Set up Express app (`app.js`) with CORS, JSON body parsing

### Phase 3 — Auth Endpoints

7. `userModel.js` — functions to query the DB
8. `authController.js` — register + login logic
9. `authRoutes.js` — wire up routes
10. `authMiddleware.js` — JWT verification

### Phase 4 — Users Endpoints

11. `usersController.js` — get all members, get one, update profile
12. `usersRoutes.js` — protected routes

### Phase 5 — Cloudinary Image Upload

13. Set up Cloudinary account + config
14. Add `multer` middleware for file uploads
15. Add image upload to register + edit profile

### Phase 6 — React Frontend

16. Set up React Router + page scaffolding
17. Build `AuthContext` (login/logout state)
18. Build `LoginPage` and `RegisterPage` (with forms)
19. Build `DirectoryPage` (member grid)
20. Build `MemberProfilePage`
21. Build `EditProfilePage`
22. Wire up all API calls via `services/`

### Phase 7 — Polish & Deploy

23. Add form validation + error messages
24. Style with CSS (or optionally Tailwind CSS)
25. Deploy frontend to Vercel
26. Deploy backend + DB to Railway

---

## Key Packages

**Server:**

- `express` — web framework
- `pg` — PostgreSQL client
- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT creation + verification
- `multer` — file upload handling
- `cloudinary` — image hosting SDK
- `cors` — allow frontend to talk to backend
- `dotenv` — load environment variables

**Client:**

- `react-router-dom` — page routing
- `axios` — HTTP requests to backend
- `react-hook-form` — form handling + validation

---

## Deployment Targets

- **Frontend** → Vercel (connect GitHub repo, auto-deploys)
- **Backend** → Railway (Node.js service)
- **Database** → Railway PostgreSQL (or Supabase free tier)
- **Images** → Cloudinary (free tier: 25 GB storage)

---

## Verification

After each phase, we'll verify by:

1. Running the backend with `node src/app.js` and testing endpoints with a tool like **Bruno** or **Postman**
2. Running the frontend with `npm run dev` and manually clicking through the UI
3. Checking the database to confirm records are saved correctly
4. At the end: registering a test account, logging in, viewing the directory, and uploading a profile photo end-to-end

updates

1. after updating a profile return to directory page
2. make images bigger and better quality
3. show password at login and registeration
4. be able to delete account
5. be able to change password
6. send verification email
