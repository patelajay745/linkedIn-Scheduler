# LinkedIn Scheduler — Build Guide

> This is your personal roadmap. Build each phase fully before moving to the next.
> Ask for help on any step — that's what I'm here for.

---

## Phase 1 — Project Foundation

**Goal:** Get a running Express server with a database connection.

### Steps
1. `npm init -y` — initialise the project
2. Install core deps: `express`, `dotenv`, `cors`, `helmet`
3. Install dev deps: `nodemon`
4. Create `src/app.js` (Express setup) and `src/server.js` (entry point, calls `app.listen`)
5. Add a `start` and `dev` script in `package.json`
6. Create `.env` and `.env.example` with a `PORT=8080` entry
7. Test: `npm run dev` → `GET /health` returns `{ ok: true }`

### What you learn
- Express project structure
- Environment variable management with `dotenv`

---

## Phase 2 — Database with Prisma

**Goal:** Define your data models and connect to PostgreSQL.

### Steps
1. Install: `prisma`, `@prisma/client`
2. Run `npx prisma init` — creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env`
3. Set up a local PostgreSQL database (or use [Supabase](https://supabase.com) free tier for zero setup)
4. Define two models in `schema.prisma`:

   **Post**
   - `id` — uuid, primary key
   - `content` — String
   - `imageUrls` — String array
   - `scheduledAt` — DateTime? (nullable)
   - `publishedAt` — DateTime? (nullable)
   - `status` — Enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `FAILED`
   - `linkedinPostId` — String? (filled after publish)
   - `bullJobId` — String? (BullMQ job id for cancellation)
   - `impressions`, `likes`, `comments`, `shares` — Int? (analytics)
   - `analyticsAt` — DateTime?
   - `createdAt`, `updatedAt` — auto timestamps

   **LinkedInToken** (stores your OAuth token — single row)
   - `id` — String, default `"singleton"`
   - `accessToken` — String
   - `refreshToken` — String?
   - `expiresAt` — DateTime
   - `profileId` — String

5. Run `npx prisma migrate dev --name init`
6. Create `src/lib/prisma.js` — export a single shared PrismaClient instance
7. Test: import prisma in `server.js`, call `prisma.post.findMany()`, log the result

### What you learn
- Prisma ORM basics
- Database migrations
- Data modelling with enums and relations

---

## Phase 3 — LinkedIn OAuth

**Goal:** Authenticate with LinkedIn and save your access token to the DB.

### Background
LinkedIn uses **OAuth 2.0 Authorization Code Flow**:
1. You redirect the user to LinkedIn's auth URL with your `client_id` and `scopes`
2. LinkedIn redirects back to your `callback URL` with a `code`
3. You exchange that `code` for an `access_token` + `refresh_token`
4. Store these tokens — every LinkedIn API call needs the `access_token`

### Steps
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/) → create an app
2. Under "Auth", add `http://localhost:8080/auth/callback` as a redirect URL
3. Request these OAuth scopes: `r_liteprofile`, `w_member_social`
4. Note your `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` — add to `.env`
5. Install: `axios` (for HTTP calls to LinkedIn)
6. Create `src/routes/auth.js` with two routes:

   **GET `/auth/linkedin`**
   - Build the LinkedIn auth URL:
     `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...&redirect_uri=...&scope=r_liteprofile%20w_member_social`
   - Redirect the user to it

   **GET `/auth/callback`**
   - Extract `code` from query params
   - POST to `https://www.linkedin.com/oauth/v2/accessToken` with `code`, `client_id`, `client_secret`, `redirect_uri`, `grant_type=authorization_code`
   - LinkedIn returns `{ access_token, expires_in, refresh_token }`
   - Fetch your profile: GET `https://api.linkedin.com/v2/me` with the token
   - Upsert a `LinkedInToken` row in the DB (`id = "singleton"`)
   - Return `{ success: true }`

7. Mount the router in `app.js`: `app.use('/auth', authRouter)`
8. Test: visit `http://localhost:8080/auth/linkedin` in your browser → go through LinkedIn login → token row appears in DB

### What you learn
- OAuth 2.0 flow end-to-end
- Exchanging auth codes for tokens
- Making authenticated API calls

---

## Phase 4 — API Auth Middleware

**Goal:** Protect all non-auth endpoints with a simple secret key.

### Steps
1. Add `API_SECRET=your-random-secret` to `.env`
2. Create `src/middleware/apiAuth.js`:
   - Check for `X-API-Secret` header on every request
   - If it doesn't match `process.env.API_SECRET` → return `401 Unauthorized`
   - If it matches → call `next()`
3. Apply the middleware globally in `app.js` — but exclude `/auth/*` routes
4. Test: `curl -H "X-API-Secret: wrong" http://localhost:8080/health` → 401

### What you learn
- Express middleware pattern
- Simple API key auth for personal tools

---

## Phase 5 — S3 Image Upload

**Goal:** Accept image uploads and store them in AWS S3.

### Steps
1. Create an S3 bucket in the AWS Console — note the bucket name and region
2. Create an IAM user with `AmazonS3FullAccess` — note `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
3. Add all four S3 vars to `.env`
4. Install: `@aws-sdk/client-s3`, `multer`, `multer-s3`
5. Create `src/services/storage.js`:
   - Set up an S3 client using your credentials
   - Export an `uploadImage(file)` function that streams the file to S3 and returns the public URL
6. Create a `POST /upload/image` route:
   - Use `multer` as middleware to handle `multipart/form-data`
   - Call `uploadImage()` → return `{ url: "https://..." }`
7. Test: upload an image with Postman or `curl` → URL returned → visible in S3 console

### What you learn
- AWS SDK v3
- File upload handling with Multer
- Streaming uploads to S3

---

## Phase 6 — LinkedIn Posting Service

**Goal:** A service that can publish a post (with optional images) to LinkedIn.

### Steps
1. Create `src/services/linkedin.js`
2. Write a helper `getToken()` — reads `LinkedInToken` from DB, checks `expiresAt`, refreshes if expired
3. Write `uploadImageToLinkedIn(imageUrl, accessToken)`:
   - Step 1: Register upload — POST to `https://api.linkedin.com/v2/assets?action=registerUpload` with your profile URN and media type
   - Step 2: Upload the binary — PUT to the upload URL LinkedIn returns
   - Returns an `asset URN` (looks like `urn:li:digitalmediaAsset:...`)
4. Write `publishPost(postId)`:
   - Fetch the Post from DB
   - If it has `imageUrls`, call `uploadImageToLinkedIn` for each → collect asset URNs
   - Build the UGC post body (see LinkedIn UGC Posts API docs)
   - POST to `https://api.linkedin.com/v2/ugcPosts`
   - Update the Post in DB: `status = PUBLISHED`, `publishedAt = now()`, `linkedinPostId = urn`
5. Add a `POST /posts/:id/publish-now` route that calls `publishPost(postId)`
6. Test: create a Post row in DB directly → call publish-now → post appears on LinkedIn

### What you learn
- LinkedIn UGC Posts API
- Multi-step image upload flow
- Token management

---

## Phase 7 — Post CRUD API

**Goal:** Full create/read/update/delete for posts via the API.

### Steps
1. Create `src/routes/posts.js`
2. Implement these endpoints:

   | Method | Path | Action |
   |--------|------|--------|
   | GET | `/posts` | List all posts; support `?status=DRAFT` and `?from=&to=` date filters |
   | POST | `/posts` | Create post — body: `{ content, imageUrls?, scheduledAt? }` |
   | GET | `/posts/:id` | Get single post |
   | PUT | `/posts/:id` | Update content / imageUrls / scheduledAt |
   | DELETE | `/posts/:id` | Delete post |
   | GET | `/calendar` | Return posts grouped by date (for calendar UI later) |

3. On `POST /posts`: if `scheduledAt` is provided → set status to `SCHEDULED`; otherwise `DRAFT`
4. Mount in `app.js`
5. Test each endpoint with Postman or Bruno

### What you learn
- RESTful API design
- Prisma queries with filters

---

## Phase 8 — BullMQ Scheduler

**Goal:** Automatically publish posts at the scheduled time using BullMQ.

### Background
**BullMQ** is a Node.js job queue backed by Redis. You add a job with a `delay` (milliseconds), and BullMQ holds it until that delay is up — then a Worker processes it.

### Steps
1. Set up Redis locally — easiest way: `docker run -p 6379:6379 redis`
   Or sign up for [Redis Cloud](https://redis.com/try-free/) free tier (no Docker needed)
2. Add `REDIS_URL=redis://localhost:6379` to `.env`
3. Install: `bullmq`, `ioredis`
4. Create `src/lib/queue.js`:
   - Create an `IORedis` connection from `REDIS_URL`
   - Export a `Queue` named `"posts"` using that connection
5. Create `src/services/scheduler.js`:
   - `enqueuePost(postId, scheduledAt)` — calculate delay in ms, add job `{ postId }` to the queue with that delay, return the job id
   - `cancelPost(bullJobId)` — get the job by id from the queue and remove it
6. Create `src/workers/postWorker.js`:
   - Create a `Worker` for the `"posts"` queue (same Redis connection)
   - In the processor function: call `publishPost(job.data.postId)` from your LinkedIn service
   - Handle errors: update the Post status to `FAILED` on error
7. Wire scheduling into the routes:
   - `POST /posts` with `scheduledAt` → call `enqueuePost()` → save `bullJobId` on the Post
   - `DELETE /posts/:id` → if post has `bullJobId` → call `cancelPost()` first
   - `PUT /posts/:id` with new `scheduledAt` → cancel old job → enqueue new job → update `bullJobId`
8. Start the worker in `src/server.js` (import and instantiate it alongside the Express server)
9. Test: create a post with `scheduledAt` 2 minutes from now → wait → post appears on LinkedIn

### What you learn
- BullMQ delayed jobs
- Worker/queue pattern
- Background job lifecycle (enqueue → process → complete/fail)

---

## Phase 9 — Analytics Sync

**Goal:** Pull engagement data from LinkedIn back into your DB.

### Steps
1. Add `getAnalytics(linkedinPostId, accessToken)` to `src/services/linkedin.js`:
   - GET `https://api.linkedin.com/v2/shareStatistics?q=shares&shares[0]=urn:li:share:{id}`
   - Returns `{ likeCount, commentCount, shareCount, impressionCount }`
   - ⚠️ Note: LinkedIn restricts analytics API access — this may require partner approval. Implement it; if it returns 403, flag it and skip for now.
2. Add `GET /analytics/sync` route:
   - Fetch all posts where `status = PUBLISHED`
   - For each, call `getAnalytics()` → update `impressions`, `likes`, `comments`, `shares`, `analyticsAt` in DB
   - Return a summary of what was updated
3. Test: call the endpoint after a post has been live for a few hours

### What you learn
- LinkedIn Analytics API
- Batch DB updates

---

## Phase 10 — Dockerfile + Cloud Run Deploy

**Goal:** Package the app and deploy it to Google Cloud Run.

### Steps
1. Create a `Dockerfile`:
   ```
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npx prisma generate

   FROM node:20-alpine
   WORKDIR /app
   COPY --from=builder /app .
   EXPOSE 8080
   CMD ["node", "src/server.js"]
   ```
2. Add a `.dockerignore`: `node_modules`, `.env`, `*.log`
3. Test locally: `docker build -t linkedin-scheduler . && docker run -p 8080:8080 --env-file .env linkedin-scheduler`
4. Push to Google Artifact Registry:
   - `gcloud auth configure-docker`
   - `docker tag linkedin-scheduler gcr.io/YOUR_PROJECT/linkedin-scheduler`
   - `docker push gcr.io/YOUR_PROJECT/linkedin-scheduler`
5. Deploy to Cloud Run:
   - Set **min-instances=1** (keeps the BullMQ worker alive)
   - Set all env vars via Cloud Run secrets or `--set-env-vars`
6. Update `LINKEDIN_REDIRECT_URI` in LinkedIn developer portal to your Cloud Run URL
7. Re-run OAuth flow against the live URL

### What you learn
- Docker multi-stage builds
- Google Cloud Run deployment
- Container environment configuration

---

## How to Ask for Help

When you're stuck, just say things like:
- "I'm on Phase 3, the token exchange is returning a 400"
- "How does the UGC post body look for a post with one image?"
- "BullMQ worker isn't picking up jobs — here's my code"

I'll help you debug or explain the concept without writing the code for you (unless you want me to).

---

## Tech Stack Summary

| Layer | Tech |
|-------|------|
| Runtime | Node.js 20 |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL (Cloud SQL / Supabase) |
| Job Queue | BullMQ |
| Queue Store | Redis |
| Image Storage | AWS S3 |
| LinkedIn API | OAuth 2.0, UGC Posts API, Assets API |
| Deploy | Google Cloud Run |
