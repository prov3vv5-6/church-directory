# Church Directory — Setup Commands

## Preview the App in the Browser

```
cd C:\Users\morit\MyCProjects\Church_Directory\client
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Preview the Server

```
cd C:\Users\morit\MyCProjects\Church_Directory\server
npm run dev
```

Run these in order from inside: C:\Users\morit\MyCProjects\Church_Directory

---

## Run in terminal to install plugin available for Claude, Cursor, and Codex

npx plugins add vercel/vercel-plugin

## Phase 1 — Project Setup

### Step 1: Create the React frontend (Vite)

```
npm create vite@latest client -- --template react
```

- When prompted, select: React → JavaScript

### Step 2: Install frontend dependencies

```
cd client
npm install
cd ..
```

### Step 3: Create the server folder and initialize it

```
mkdir server
cd server
npm init -y
cd ..
```

### Step 4: Install backend packages

```
cd server
npm install express pg bcryptjs jsonwebtoken multer cloudinary cors dotenv
npm install --save-dev nodemon
cd ..
```

### Step 5: Install frontend packages

```
cd client
npm install react-router-dom axios react-hook-form
cd ..
```

---

## Running the App (once built)

### Start the backend

```
cd server
npm run dev
```

### Start the frontend (in a separate terminal)

```
cd client
npm run dev
```

---

## Notes

- Run each command one at a time and wait for it to finish before running the next
- If you see "added X packages" it worked
- If you see errors, copy and paste them and we'll fix them together
