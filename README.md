# Linked Schedular

Self-hosted LinkedIn post scheduler. Free to run, you own everything.

## Why

I got tired of paying for tools that do too much and ask for too many permissions. I just wanted to write a post, pick a time, and have it go out. So I built this.

It also gave me a real project to dig into OAuth token management, background job processing, presigned S3 uploads, and external API integration all at once.

## What it does

You sign in once with LinkedIn. After that you can write posts, attach images, set a publish time, and forget about it. The worker picks up the job and publishes at the right time. If something goes wrong it retries a few times before marking the post as failed.

Posts go through four states: draft when you are still working on it, scheduled once you set a time, published after the worker runs it, and failed if all retries are exhausted.

There is a calendar view to see what is going out and when, and a post editor with image upload support (up to 20 images per post via S3).

## Stack

Frontend is Next.js 15 with Tailwind, React Query, Framer Motion, and Lenis. The design is retro/neobrutalist.

Backend is Bun with Express 5, Prisma 7, and PostgreSQL. Job scheduling goes through BullMQ and Redis. Sessions also live in Redis. Images are uploaded directly to S3 via presigned URLs so the server never touches the file bytes. LinkedIn tokens are stored with field-level encryption.

## Architecture

There are two backend processes that run independently.

The API handles OAuth, post CRUD, image presigning, and enqueuing jobs. The worker is a separate long-running process that watches the BullMQ queue and publishes posts when their time arrives.

```
Browser (Next.js)
      |
      v
Express API (Bun) ──> PostgreSQL
      |                   ^
      v                   |
Redis (Queue + Sessions)  |
      |                   |
      v                   |
BullMQ Worker ────────────
      |
      v
LinkedIn API
```

## Prerequisites

You need Bun, Node.js, PostgreSQL, Redis, a LinkedIn developer app with OAuth configured, and an AWS S3 bucket for images.

## Local Setup

Clone the repo:

```bash
git clone https://github.com/patelajay745/linkedIn-Scheduler.git
cd linked-schedular
```

Set up the backend:

```bash
cd backend
bun install
cp .env.example .env
bunx prisma migrate dev
```

Start the API:

```bash
bun run dev
```

**Start the worker in a separate terminal. This is not optional.** Without the worker running, scheduled posts will never be published. They just sit in the queue.

```bash
bun run src/workers/postWorker.ts
```

Set up the frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`, sign in with LinkedIn, and you are good to go.

## Environment Variables

Backend (`backend/.env`):

```
PORT                      defaults to 8080
NODE_ENV                  development or production
APP_NAME                  prefix for Redis keys, e.g. LINKEDIN_SCHEDULER

DATABASE_URL              PostgreSQL connection string
PRISMA_FIELD_ENCRYPTION_KEY   generate with: openssl rand -base64 32

REDIS_URL                 defaults to redis://localhost:6379
SESSION_SECRET            any long random string

LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URI     http://localhost:8080/api/v1/auth/linkedin/callback
LINKEDIN_API_VERSION      e.g. 202502
ALLOWED_LINKEDIN_ID       your LinkedIn member ID, only this account can log in

AWS_ACCESS_KEY
AWS_SECRET_KEY
AWS_REGION
AWS_BUCKET_NAME

FRONTEND_URL              where to redirect after OAuth, e.g. http://localhost:3000
```

To find your LinkedIn member ID, do a first login attempt and check the callback response, or look at your profile URL.

Frontend (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL       http://localhost:8080/api/v1
```

## Access control

Single-user only. The `ALLOWED_LINKEDIN_ID` check runs at the OAuth callback. Any account other than yours gets a 403. There is no registration or multi-tenancy by design.
