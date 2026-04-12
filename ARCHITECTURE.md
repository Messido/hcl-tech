# Auth App — Architecture & How It Works

## Overview

A full-stack authentication system built with **Next.js 16**, **TypeScript**, and **NextAuth.js v5 (Auth.js)**. It provides Sign Up, Sign In, and a protected Welcome page — all with JWT-based session management and no external database.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with server components, API routes, and middleware |
| **TypeScript** | Type safety across entire codebase |
| **NextAuth.js v5** (Auth.js) | Authentication library — handles sessions, JWT, and provider abstraction |
| **bcryptjs** | Password hashing (bcrypt algorithm) |
| **Vanilla CSS** | Custom design system with CSS variables, no utility framework |

---

## Project Structure

```
auth-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   ← NextAuth API handler
│   │   │   └── signup/route.ts                ← Sign-up API endpoint
│   │   ├── signin/page.tsx                    ← Sign In page (client component)
│   │   ├── signup/page.tsx                    ← Sign Up page (client component)
│   │   ├── welcome/
│   │   │   ├── page.tsx                       ← Welcome page (server component)
│   │   │   └── sign-out-button.tsx            ← Sign Out button (client component)
│   │   ├── layout.tsx                         ← Root layout
│   │   ├── page.tsx                           ← Root redirect logic
│   │   └── globals.css                        ← Design system & all styles
│   ├── lib/
│   │   ├── auth.ts                            ← NextAuth configuration
│   │   └── users.ts                           ← In-memory user store
│   └── middleware.ts                          ← Route protection middleware
├── .env.local                                 ← Environment variables (AUTH_SECRET)
└── package.json
```

---

## How Authentication Works

### 1. Sign Up Flow

```
User fills form → POST /api/signup → Validate input → Hash password with bcrypt → Store in memory → Auto sign-in → Redirect to /welcome
```

1. User fills in Name, Email, Password, Confirm Password on `/signup`
2. Client-side validation checks password match and minimum length
3. Form submits a `POST` request to `/api/signup`
4. Server validates fields, hashes password using **bcrypt** (10 salt rounds)
5. User is stored in the **in-memory array** (no database)
6. After successful creation, the client automatically calls `signIn("credentials", ...)` to log the user in
7. User is redirected to `/welcome`

### 2. Sign In Flow

```
User enters credentials → NextAuth authorize() → bcrypt.compare() → JWT issued → Session created → Redirect to /welcome
```

1. User enters email and password on `/signin`
2. Client calls `signIn("credentials", { email, password, redirect: false })`
3. NextAuth's `authorize()` function runs:
   - Looks up user by email in the in-memory store
   - Compares submitted password against the stored bcrypt hash
   - Returns user object if valid, `null` if invalid
4. On success, NextAuth creates a **JWT token** containing user ID, name, email
5. JWT is stored as an **HTTP-only cookie** (`authjs.session-token`)
6. Client redirects to `/welcome`

### 3. Session Management (JWT)

- **No database sessions** — everything is in the JWT cookie
- The JWT is signed using `AUTH_SECRET` (from `.env.local`)
- On every request, NextAuth decodes the JWT to restore the session
- The `callbacks.jwt` and `callbacks.session` functions control what data flows from JWT → session

### 4. Route Protection

```
Request to /welcome → middleware.ts → auth() checks JWT cookie → Valid? Allow : Redirect to /signin
```

- `middleware.ts` exports the `auth` function from NextAuth
- The `config.matcher` array specifies which routes are protected: `["/welcome"]`
- If no valid session cookie exists, the user is redirected to `/signin`

### 5. Sign Out

- Clicking "Sign out" calls `signOut({ callbackUrl: "/signin" })`
- NextAuth clears the session cookie
- User is redirected back to `/signin`

---

## Key Design Decisions

### Why In-Memory Storage?
- **No database setup required** — zero configuration
- Users persist as long as the server runs
- Server restart clears all accounts (intentional for demo purposes)
- Easy to swap in MongoDB/PostgreSQL later by replacing `users.ts`

### Why JWT over Database Sessions?
- Stateless — no session storage needed
- Faster — no DB lookup on every request
- Self-contained — user info is encoded in the cookie itself

### Why bcrypt?
- Industry standard for password hashing
- Includes salt to prevent rainbow table attacks
- Configurable cost factor (we use 10 rounds)

---

## Component Architecture

| Component | Type | Renders On | Why |
|---|---|---|---|
| `signin/page.tsx` | Client (`"use client"`) | Browser | Needs `useState`, `signIn()` from next-auth/react |
| `signup/page.tsx` | Client (`"use client"`) | Browser | Needs `useState`, `fetch()`, `signIn()` |
| `welcome/page.tsx` | Server | Server | Uses `auth()` to read session server-side |
| `sign-out-button.tsx` | Client (`"use client"`) | Browser | Needs `signOut()` from next-auth/react |
| `page.tsx` (root) | Server | Server | Uses `auth()` + `redirect()` |

### Server vs Client Components

- **Server components** (`welcome/page.tsx`, root `page.tsx`): Access the session via `auth()` directly on the server. No JavaScript sent to the browser for these.
- **Client components** (`signin`, `signup`, sign-out button): Need browser interactivity — form state, event handlers, and NextAuth's client-side functions.

---

## Security Features

1. **Password Hashing**: All passwords are hashed with bcrypt before storage
2. **JWT Signing**: Session tokens are cryptographically signed with AUTH_SECRET
3. **HTTP-Only Cookies**: Session cookie is not accessible via JavaScript (XSS protection)
4. **CSRF Protection**: NextAuth includes built-in CSRF token verification
5. **Route Protection**: Middleware blocks access to protected routes before the page renders
6. **Input Validation**: Both client-side and server-side validation on all forms

---

## Running Locally

```bash
cd auth-app
npm install
npm run dev
# Open http://localhost:3000
```

No external services or API keys required.

---

## Future Improvements (If Needed)

- **Add a database** (MongoDB/PostgreSQL) to persist users across restarts
- **OAuth providers** (Google, GitHub) for social login
- **Email verification** after sign-up
- **Password reset** flow
- **Rate limiting** on auth endpoints
