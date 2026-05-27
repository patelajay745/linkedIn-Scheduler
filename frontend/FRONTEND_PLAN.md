# Frontend Build Plan

## Page Structure

```
app/
  page.tsx                  ← Login page (public)
  dashboard/
    page.tsx                ← Posts list (protected)
  posts/
    new/
      page.tsx              ← Create post form (protected)
    [id]/
      edit/
        page.tsx            ← Edit post form (protected)
```

---

## Step 1 — Environment variable

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/v1
```

In production on Vercel, change this to your Cloud Run URL. The `NEXT_PUBLIC_` prefix makes it available in browser-side code.

---

## Step 2 — API client

Create `frontend/lib/api.ts`.

A thin wrapper around `fetch` that every page uses. Needs two things:

- Base URL from `process.env.NEXT_PUBLIC_API_URL`
- `credentials: "include"` on every request — this sends the session cookie cross-domain. Without this, the backend never sees the session and every request looks unauthenticated.

Write a typed function (e.g. `apiClient(path, options?)`) that prepends the base URL and merges in `credentials: "include"`. All API calls go through this one function.

---

## Step 3 — Auth check hook

Create `frontend/hooks/useAuth.ts` — a client-side hook that:

1. Calls `GET /auth/me` on mount
2. Returns `{ user, isLoading, isAuthenticated }`

Every protected page uses this hook. If `!isAuthenticated && !isLoading`, redirect to `/` using Next.js `useRouter`.

---

## Step 4 — Login page (`app/page.tsx`)

Replace the default page. Single screen:

- Title + short description
- "Login with LinkedIn" button that does a full page navigation to `${NEXT_PUBLIC_API_URL}/auth/linkedin`

Must be a full navigation (`window.location.href` or a plain `<a>` tag), not `fetch`. The backend redirects to LinkedIn, LinkedIn redirects back to the backend callback, and the backend redirects to `FRONTEND_URL/dashboard`. That redirect chain only works with a real page navigation.

After successful login the backend sets the session cookie and sends the user to `/dashboard`.

---

## Step 5 — Posts list page (`app/dashboard/page.tsx`)

Mark `"use client"`. Needs:

1. Auth check — redirect to `/` if not logged in
2. `GET /posts` on mount → render list of posts
3. Status filter buttons (ALL / DRAFT / SCHEDULED / PUBLISHED / FAILED) — pass `?status=` query param to the API
4. "New Post" button → navigate to `/posts/new`
5. Each post card shows: content preview, status badge, scheduled date if present, edit and delete actions

For delete: call `DELETE /posts/:id`, then refetch the list.

Use `Card` and `Button` retro components.

---

## Step 6 — Create post page (`app/posts/new/page.tsx`)

Mark `"use client"`. Form with:

- `content` — textarea (required)
- `imageUrls` — optional, input where user can add and remove URL strings
- `scheduledAt` — optional, use the `Calendar` retro component. No date picked = post saved as DRAFT.

On submit: `POST /posts` → on success redirect to `/dashboard`.

---

## Step 7 — Edit post page (`app/posts/[id]/edit/page.tsx`)

Same form as create, but:

1. On mount: `GET /posts/:id` → pre-fill all form fields
2. On submit: `PATCH /posts/:id` with only the changed fields
3. If post status is `PUBLISHED` or `FAILED`, redirect to `/dashboard` — those posts cannot be edited

---

## Build order

Do these in sequence — each one builds on the previous:

- [ ] `lib/api.ts`
- [ ] `hooks/useAuth.ts`
- [ ] Login page (`app/page.tsx`)
- [ ] Dashboard (`app/dashboard/page.tsx`)
- [ ] Create post (`app/posts/new/page.tsx`)
- [ ] Edit post (`app/posts/[id]/edit/page.tsx`)

---

## API Reference

All endpoints are prefixed with `/v1`. All post endpoints require an active session (cookie sent automatically if `credentials: "include"` is set).

```
GET    /auth/me               Check if logged in, returns user profile
GET    /auth/linkedin         Start OAuth flow (full page navigation)

GET    /posts                 List posts — optional ?status= filter
POST   /posts                 Create post
GET    /posts/:id             Get single post
PATCH  /posts/:id             Update post
DELETE /posts/:id             Delete post
```

**Create / Update body:**

```json
{
  "content": "Your post text",
  "imageUrls": ["https://..."],
  "scheduledAt": "2026-06-01T10:00:00.000Z"
}
```

`imageUrls` is optional, max 20. `scheduledAt` is optional, must be a future ISO 8601 datetime. Omitting it creates a DRAFT.

**Post status values:** `DRAFT` `SCHEDULED` `PUBLISHED` `FAILED`

Only `DRAFT` and `SCHEDULED` posts can be updated or deleted.
