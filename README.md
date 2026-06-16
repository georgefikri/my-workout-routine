# 💪 My Workout Routine

A personal mobile-first workout tracker built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** — designed to be used at the gym directly from your phone.

---

## 🌐 Live URL

| Page        | URL                                                                                |
| ----------- | ---------------------------------------------------------------------------------- |
| Tracker     | [my-workout-routine.vercel.app](https://my-workout-routine.vercel.app)             |
| Admin Panel | [my-workout-routine.vercel.app/admin](https://my-workout-routine.vercel.app/admin) |

---

## ✨ Features

### Workout Tracker (`/`)

- 4 fully organized workout plans available as tabs
- Tap any exercise to mark it as done ✅
- Progress bar showing completion percentage per workout
- Reset button to clear a session and start fresh
- Mobile-first UI optimized for gym use

### Admin Panel (`/admin`)

- Password-protected access
- Add, edit, delete exercises in any workout plan
- Reorder exercises with ↑ ↓ buttons
- Changes persist instantly via Upstash Redis
- No need to touch any code to update your plans

---

## 🏋️ Workout Plans

| Plan              | Type      | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| **Upper Regular** | Flat list | Warm-up + full upper body machine & dumbbell work       |
| **Upper Circuit** | Sectioned | Cardio warm-up → 3 circuits targeting chest, back, arms |
| **Lower Regular** | Sectioned | Core activation → legs machines & Romanian deadlifts    |
| **Lower Circuit** | Sectioned | Core warm-up → 2 circuits + leg machine finisher        |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                  # SSR entry point (home tracker)
│   ├── admin/
│   │   └── page.tsx              # Admin panel (password protected)
│   └── api/
│       └── workouts/
│           └── route.ts          # GET + POST API (Upstash Redis)
├── components/
│   ├── WorkoutTracker.tsx        # Main tracker client component
│   ├── WorkoutSection.tsx        # Sectioned workout renderer
│   ├── ExerciseCard.tsx          # Individual exercise card
│   └── ProgressBar.tsx           # Session progress indicator
└── data/
    ├── workouts.ts               # TypeScript types
    └── workouts.json             # Workout data (seed / fallback)
```

---

## 🛠️ Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 15 (App Router, SSR-first) |
| Language  | TypeScript                         |
| Styling   | Tailwind CSS                       |
| Database  | Upstash Redis (serverless)         |
| Hosting   | Vercel                             |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Upstash Redis account

### Local Development

**1. Clone the repo**

```bash
git clone https://github.com/georgefikri/my-workout-routine.git
cd my-workout-routine
```

**2. Install dependencies**

```bash
npm install
```

**3. Pull environment variables**

```bash
vercel env pull .env.local
```

Your `.env.local` should contain:

```dotenv
KV_REST_API_URL="your_upstash_url"
KV_REST_API_TOKEN="your_upstash_token"
```

**4. Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable            | Description              |
| ------------------- | ------------------------ |
| `KV_REST_API_URL`   | Upstash Redis REST URL   |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

Set these in **Vercel Dashboard → Settings → Environment Variables** for production.

---

## 📝 How to Modify Workout Plans

### Option 1 — Admin Panel (recommended)

1. Go to `/admin`
2. Enter password
3. Select a workout tab
4. Add / Edit / Delete exercises
5. Changes save automatically to Redis ✅

### Option 2 — Edit the seed data file

Edit `src/data/workouts.json` directly for bulk changes, then redeploy:

```bash
git add .
git commit -m "feat: update workout plans"
git push
```

> ⚠️ Note: If data already exists in Redis, editing `workouts.json` alone won't update the live app — use the Admin Panel or flush the Redis key first.

---

## 🔐 Admin Panel

The admin panel is protected by a hardcoded password (personal project).

To change the password, update this line in `src/app/admin/page.tsx`:

```typescript
const ADMIN_PASSWORD = 'gym123';
```

---

## 📦 Deployment

The project auto-deploys to Vercel on every `git push` to `main`.

To manually deploy:

```bash
vercel --prod
```

---

## 👤 Author

**George Fikri**

- GitHub: [@georgefikri](https://github.com/georgefikri)

---

_Built for personal gym use — stay consistent 💪_
