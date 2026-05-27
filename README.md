# LinkedIn Post Scheduler

A self-hosted backend for writing and scheduling LinkedIn posts in advance. Built as a personal project to go deeper into production backend patterns: OAuth 2.0 token management, background job processing, S3 presigned uploads, and external API integration.

## What it does

You authenticate once with LinkedIn. After that, you can create posts with text and images, optionally set a future publish time, and the system handles publishing automatically. Posts go through a clear lifecycle: draft while you are working on them, scheduled when a time is set, published after the worker processes them, or failed if all retry attempts are exhausted.

Publishing is handled by a background worker that runs completely independently of the API. This matters because the API is deployed on Cloud Run which scales to zero — if the API instance shuts down, jobs already in the queue are unaffected.

## Architecture

The system is split into two independently deployed services.

The **API** is a stateless Express server running on Google Cloud Run. It handles OAuth, post management, image uploads, and enqueuing scheduled jobs. It scales to zero when idle.

The **Worker** runs on a DigitalOcean Droplet as a persistent process. It connects to the same Redis instance and processes BullMQ jobs as their scheduled time arrives. It runs 24/7 regardless of API traffic.

```
Client
  |
  v
Express API (Cloud Run) -----> PostgreSQL
  |
  v
Redis (BullMQ Queue)
  |
  v
BullMQ Worker (DigitalOcean Droplet) -----> LinkedIn API
```

Both services share PostgreSQL (posts, users, tokens) and Redis (job queue and API sessions).

## Tech Stack

* Bun as the runtime
* Express 5 for HTTP
* TypeScript throughout
* Prisma 7 with PostgreSQL
* BullMQ and IORedis for job scheduling
* Redis with connect-redis for session storage
* AWS S3 with presigned URLs for image storage
* Zod v4 for request validation
* LinkedIn REST API for publishing

## How scheduling works

When you create a post with a `scheduledAt` time, the API saves it with `SCHEDULED` status and adds a BullMQ job to Redis. The delay is calculated as the difference between the target time and the current moment in milliseconds. BullMQ stores delayed jobs in a Redis sorted set ordered by their target timestamp and moves them to the active queue when their time is up.

If a job fails due to a transient error (LinkedIn 5xx, network issues), BullMQ retries it up to three times with exponential backoff starting at 2 seconds. Permanent errors (post not found, already published, authentication failure) are wrapped in `UnrecoverableError` so retries are skipped entirely. Once all retries are exhausted, the worker's `failed` event handler marks the post as `FAILED` in the database.

Cancelling or rescheduling a post removes the existing BullMQ job before creating a new one. The `bullJobId` is stored on the post record for this purpose.

## Image uploads

The server never touches image bytes. When you want to upload an image, you first request a presigned S3 URL from the API. The API generates a signed URL with a 5-minute expiry and returns both the upload URL and the public S3 URL. You PUT the image binary directly to S3 from the client. Then you pass the public S3 URL in your post's `imageUrls` field.

LinkedIn supports up to 20 images per post. Single-image posts use the `content.media` structure. Multi-image posts use `content.multiImage`. Text-only posts omit the content field entirely.

## LinkedIn token management

Access tokens are stored in the database and refreshed automatically when they are within 5 minutes of expiry. If a refresh token is not available (LinkedIn does not always issue them), the worker throws a permanent error and the user must re-authenticate. Token storage uses field-level encryption via `prisma-field-encryption`.

## API Reference

All endpoints are prefixed with `/api/v1`. All post and upload endpoints require an active session.

**Authentication**

```
GET  /auth/linkedin           Redirect to LinkedIn OAuth consent screen
GET  /auth/linkedin/callback  OAuth callback, establishes session
GET  /auth/me                 Returns authenticated user profile
```

**Image Upload**

```
POST /upload/presign
```

Request body:
```json
{
  "fileName": "image.jpg",
  "contentType": "image/jpeg"
}
```

Response:
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "publicUrl": "https://your-bucket.s3.region.amazonaws.com/uuid-image.jpg"
}
```

PUT the image binary to `uploadUrl`. Store `publicUrl` in your post's `imageUrls` array.

**Posts**

```
POST   /posts                  Create a post
GET    /posts                  List posts
GET    /posts/:id              Get a single post
PATCH  /posts/:id              Update a post
DELETE /posts/:id              Delete a post
POST   /posts/:id/publish-now  Publish immediately
```

**Creating a post**

```json
{
  "content": "Your post content",
  "imageUrls": ["https://..."],
  "scheduledAt": "2026-05-26T10:00:00.000Z"
}
```

`imageUrls` is optional, maximum 20. `scheduledAt` is optional and must be an ISO 8601 datetime in the future. Omitting it creates a draft.

**Listing posts**

Supports optional query parameters: `status` (DRAFT, SCHEDULED, PUBLISHED, FAILED), `from` and `to` as ISO datetime strings for filtering by scheduled date range.

**Post status values:** `DRAFT` `SCHEDULED` `PUBLISHED` `FAILED`

Only posts in `DRAFT` or `SCHEDULED` status can be updated or deleted. Updating a post's `scheduledAt` cancels the existing job and enqueues a new one atomically.

## Running locally

You need Bun, PostgreSQL, and Redis running locally.

```bash
cd backend
bun install
cp .env.example .env   # fill in your values
bunx prisma migrate dev
```

Start the API and worker in separate terminals:

```bash
# Terminal 1
bun run src/index.ts

# Terminal 2
bun run src/workers/postWorker.ts
```

## Environment variables

```
DATABASE_URL              PostgreSQL connection string
REDIS_URL                 Redis connection string
SESSION_SECRET            Secret for signing session cookies
LINKEDIN_CLIENT_ID        LinkedIn OAuth app client ID
LINKEDIN_CLIENT_SECRET    LinkedIn OAuth app client secret
LINKEDIN_REDIRECT_URI     OAuth callback URL registered in your LinkedIn app
LINKEDIN_API_VERSION      LinkedIn API version date (e.g. 202502)
ALLOWED_LINKEDIN_ID       Your LinkedIn member ID — only this account can authenticate
AWS_REGION                S3 bucket region
AWS_ACCESS_KEY            AWS access key with S3 put permissions
AWS_SECRET_KEY            AWS secret key
AWS_BUCKET_NAME           S3 bucket name
APP_NAME                  Prefix for Redis session keys
FRONTEND_URL              Where to redirect after successful OAuth
NODE_ENV                  development or production
PORT                      Server port, defaults to 8080
```

## Access control

This is a single-user tool. The `ALLOWED_LINKEDIN_ID` variable is checked at the OAuth callback — anyone who authenticates with a different LinkedIn account gets a 403. There is no registration, no invite system, and no multi-tenancy.

## Deployment

The API is containerized and deployed to Google Cloud Run. It is stateless: no local state, session data lives in Redis, all persistence goes to PostgreSQL.

The worker is deployed to a DigitalOcean Droplet and kept alive with pm2. It must be always running — it cannot be on a platform that scales to zero.

Both services use the same PostgreSQL and Redis instances. The only shared configuration is the `REDIS_URL` and `DATABASE_URL`.
