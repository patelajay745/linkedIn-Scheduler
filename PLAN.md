# LinkedIn Post Scheduler — Architecture Plan

## Context

Personal tool for scheduling daily LinkedIn posts. Features: write posts in bulk (weekly batches), attach images, auto-publish at scheduled times, content calendar view, and engagement analytics. Single user, deploying to Google Cloud Run.

---

## Architecture Decisions

### Scheduling — BullMQ + Redis
- **BullMQ** (backed by Redis) handles delayed job scheduling. When a post is saved with a `scheduledAt` time, a BullMQ job is enqueued with the computed delay in milliseconds.
- A **Worker** runs in the same Node.js process as the API server and picks up jobs at the right time to call the LinkedIn publish service.
- Cloud Run is configured with **`min-instances=1`** so the container (and BullMQ worker) is always alive — no jobs lost to cold starts.
- Redis hosted on **Redis Cloud free tier** or **Google Cloud Memorystore**.

### Database — PostgreSQL + Prisma
- **Prisma ORM** over PostgreSQL for all persistence.
- Local dev: Supabase free tier (zero setup). Production: Cloud SQL.

### Image Storage — AWS S3
- Images uploaded via the API are stored in S3.
- The public S3 URL is passed to LinkedIn's Media Upload API when publishing.

### LinkedIn API
- **Auth**: OAuth 2.0 Authorization Code Flow
- **Scopes**: `r_liteprofile`, `w_member_social`
- **Posting**: UGC Posts API — `POST /v2/ugcPosts`
- **Image upload**: Assets API (register upload → upload binary → get asset URN → attach to post)
- **Analytics**: `GET /v2/shareStatistics` — ⚠️ may require LinkedIn partner API access

### Auth (single-user)
- LinkedIn OAuth runs once to obtain access + refresh token, stored as a single row in the DB.
- All API endpoints are protected by a static `API_SECRET` env var checked via middleware.

---

## Project Structure

```
linked-schedular/
├── src/
│   ├── app.js                  # Express app setup, middleware, route mounting
│   ├── server.js               # Entry point — starts Express + BullMQ worker
│   ├── routes/
│   │   ├── auth.js             # GET /auth/linkedin, GET /auth/callback
│   │   └── posts.js            # CRUD + schedule + publish-now + calendar
│   ├── services/
│   │   ├── linkedin.js         # LinkedIn API: publish post, upload image, get analytics
│   │   ├── scheduler.js        # BullMQ: enqueuePost(postId, scheduledAt), cancelPost(jobId)
│   │   └── storage.js          # AWS S3: uploadImage(file) → public URL
│   ├── workers/
│   │   └── postWorker.js       # BullMQ Worker — calls publishPost() per job
│   ├── middleware/
│   │   └── apiAuth.js          # Validates X-API-Secret header
│   └── lib/
│       ├── prisma.js           # Shared PrismaClient singleton
│       └── queue.js            # BullMQ Queue + IORedis connection singleton
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── .env.example
└── package.json
```

---

## Data Models

### Post
```prisma
model Post {
  id             String      @id @default(uuid())
  content        String
  imageUrls      String[]
  scheduledAt    DateTime?
  publishedAt    DateTime?
  status         PostStatus  @default(DRAFT)
  linkedinPostId String?
  bullJobId      String?

  impressions    Int?
  likes          Int?
  comments       Int?
  shares         Int?
  analyticsAt    DateTime?

  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  FAILED
}
```

### LinkedInToken
```prisma
model LinkedInToken {
  id           String   @id @default("singleton")
  accessToken  String
  refreshToken String?
  expiresAt    DateTime
  profileId    String
}
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/auth/linkedin` | Redirect to LinkedIn OAuth |
| GET | `/auth/callback` | Handle callback, exchange code, store token |
| GET | `/posts` | List posts — supports `?status=` and `?from=&to=` filters |
| POST | `/posts` | Create post (draft or scheduled) |
| GET | `/posts/:id` | Get single post |
| PUT | `/posts/:id` | Update content / imageUrls / reschedule |
| DELETE | `/posts/:id` | Delete post (cancels BullMQ job if scheduled) |
| POST | `/posts/:id/schedule` | Schedule a draft post |
| POST | `/posts/:id/publish-now` | Publish immediately |
| POST | `/upload/image` | Upload image → S3, return URL |
| GET | `/analytics/sync` | Pull latest stats from LinkedIn for all published posts |
| GET | `/calendar` | Posts grouped by date |

---

## Environment Variables

```
# Server
PORT=8080
API_SECRET=

# Database
DATABASE_URL=

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=

# Redis (BullMQ)
REDIS_URL=
```

---

## Key Implementation Notes

### Token Refresh
Before every LinkedIn API call, check `LinkedInToken.expiresAt`. If expired (or within 5 min of expiry), call the LinkedIn token refresh endpoint and update the DB row. Never let a publish job fail due to an expired token.

### BullMQ Job Lifecycle
```
POST /posts  (scheduledAt provided)
  → enqueuePost(postId, scheduledAt)        # creates delayed BullMQ job
  → save bullJobId on Post, status=SCHEDULED

[time passes...]

Worker fires
  → publishPost(postId)                     # calls LinkedIn API
  → Post: status=PUBLISHED, publishedAt=now(), linkedinPostId=urn

DELETE /posts/:id  (if SCHEDULED)
  → cancelPost(bullJobId)                   # removes job from queue
  → delete Post from DB

PUT /posts/:id  (new scheduledAt)
  → cancelPost(old bullJobId)
  → enqueuePost(postId, newScheduledAt)
  → update bullJobId on Post
```

### LinkedIn Image Upload Flow
```
1. Download image bytes from the S3 URL
2. POST /v2/assets?action=registerUpload  →  get uploadUrl + asset URN
3. PUT {uploadUrl} with image bytes
4. Include asset URN in the ugcPosts body under "media"
```

### Cloud Run — min-instances=1
Set this flag at deploy time so the BullMQ worker is never killed between requests. Without it, Cloud Run can scale to zero and scheduled jobs would be missed.

---

## Verification Checklist

- [ ] `prisma migrate dev` runs without errors, tables created
- [ ] `/auth/linkedin` → OAuth flow completes → `LinkedInToken` row in DB
- [ ] `POST /posts` with `scheduledAt` 2 min ahead → `bullJobId` saved, status = `SCHEDULED`
- [ ] After 2 min → post appears on LinkedIn, DB status = `PUBLISHED`
- [ ] `DELETE /posts/:id` on a scheduled post → job removed from BullMQ
- [ ] `PUT /posts/:id` with new `scheduledAt` → old job cancelled, new job created
- [ ] `POST /upload/image` → file appears in S3, URL returned
- [ ] `GET /analytics/sync` → impressions/likes updated on published posts
- [ ] `GET /calendar` → posts returned grouped by date
- [ ] Docker image builds and runs locally with `.env` file
- [ ] Deployed to Cloud Run with `min-instances=1` → scheduled post publishes in prod
