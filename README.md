This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Auth-Playground

A learning project for understanding authentication with Next.js, Prisma, and PostgreSQL.

## How the parts work together

The browser does not connect directly to PostgreSQL. It sends a request to the Next.js server. Server-side code uses Prisma to read or write database records.

```text
Browser form
    ↓
Next.js page and server action or route handler
    ↓
Authentication helpers and Prisma Client
    ↓
PostgreSQL
```

## Signup flow

1. The user enters a name, email, and password in the signup form.
2. The form calls the `signup` Server Action in `app/actions/auth.ts`.
3. The server validates the submitted values and checks whether the email is already registered.
4. The password is hashed with Argon2.
5. Prisma inserts the user record into PostgreSQL.
6. The server creates a session record and sets a cookie in the browser.
7. The user is redirected to the dashboard.

## Login flow

1. The user submits an email and password.
2. The `login` Server Action looks up the user by email.
3. The server checks the submitted password against the stored password hash.
4. If the password matches, the server creates a session and sets a cookie.
5. The user is redirected to the dashboard.

## How the session works

The browser stores a random session token in an HttpOnly cookie. When the browser requests a protected page, it sends that cookie to the server.

The server hashes the token and looks for a matching session record in PostgreSQL. If the session exists and has not expired, the server can identify the user. The dashboard redirects visitors without a valid session to the login page.

The database stores the **hash** of the session token, not the original token.

## Important future note: password hashing vs. session-token hashing

These values have different security requirements:

- **Password → Argon2.** Passwords are chosen by people and may be guessable. Argon2 is deliberately slow and uses a salt, making password guessing more expensive. Because each hash uses a salt, hashing the same password twice usually produces different stored hashes. Use Argon2's verify function to check a password.
- **Random session token → SHA-256.** Session tokens are generated randomly and have high entropy. Their hash needs to be deterministic: hashing the same token must produce the same result every time, so the server can hash the cookie token and look up the matching database record. SHA-256 provides that deterministic hash.

Do not use a password-hashing algorithm such as Argon2 for session-token lookup. Its salted output is intentionally different each time, which makes direct hash-based lookup inconvenient.

## Where to look in the project

- `app/signup/page.tsx` — signup form
- `app/login/page.tsx` — login form
- `app/dashboard/page.tsx` — protected dashboard
- `app/actions/auth.ts` — signup, login, and logout Server Actions
- `app/api/` — Route Handler versions of register, login, and logout
- `lib/auth.ts` — password and session helpers
- `lib/prisma.ts` — Prisma Client and PostgreSQL adapter setup
- `prisma/schema.prisma` — `User` and `Session` models
- `prisma/migrations/` — versioned database changes
- `prisma.config.ts` — Prisma CLI configuration

The signup and login pages currently call Server Actions. The API routes under `app/api/` are a separate way to handle backend requests and are not the handlers those forms call.

## Database setup

Set `DATABASE_URL` in `.env` to the PostgreSQL database you want to use. Keep `.env` private and do not commit database credentials.

Useful commands:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

Use `migrate dev` while developing to apply schema changes and create migration files. Commit the migration files so the database structure can be recreated elsewhere.

## Authentication concepts

- **Authentication:** checking who the user is.
- **Session management:** remembering the signed-in user across requests.
- **Authorization:** deciding what that user is allowed to access or change.
