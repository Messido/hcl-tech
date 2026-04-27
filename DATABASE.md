# Database Reference — SQLite + Prisma

This project uses **SQLite** via **Prisma ORM** (v7) for persistent data storage. The database file lives at `prisma/dev.db`.

---

## Quick Reference

| Command | Purpose |
|---|---|
| `npx prisma migrate dev --name <name>` | Create & apply a new migration |
| `npx prisma generate` | Regenerate the Prisma client after schema changes |
| `npx prisma studio` | Open a GUI to browse/edit the database |
| `npx prisma db push` | Push schema changes without creating a migration file |
| `npx prisma migrate reset` | Reset the database (wipes all data) |

---

## Current Schema

### User

| Column | Type | Notes |
|---|---|---|
| `id` | `String` | UUID, primary key |
| `name` | `String` | User's display name |
| `email` | `String` | Unique, case-insensitive |
| `password` | `String` | bcrypt hash |
| `createdAt` | `DateTime` | Auto-set on creation |

---

## How to Add a New Model (e.g., Asset)

### 1. Edit `prisma/schema.prisma`

Add your new model below the existing `User` model:

```prisma
model Asset {
  id          String   @id @default(uuid())
  name        String
  type        String
  location    String?
  status      String   @default("active")
  assignedTo  User?    @relation(fields: [userId], references: [id])
  userId      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

If adding a relation to `User`, also add the reverse relation in the `User` model:

```prisma
model User {
  // ... existing fields ...
  assets Asset[]
}
```

### 2. Create & Apply the Migration

```bash
npx prisma migrate dev --name add-assets
```

### 3. Regenerate the Client

```bash
npx prisma generate
```

### 4. Use in Code

```typescript
import { prisma } from "@/lib/prisma";

// Create an asset
const asset = await prisma.asset.create({
  data: {
    name: "MacBook Pro 16",
    type: "Laptop",
    location: "Office A",
    userId: "some-user-id",
  },
});

// List all assets
const assets = await prisma.asset.findMany({
  include: { assignedTo: true },
});

// Find by ID
const asset = await prisma.asset.findUnique({
  where: { id: "some-id" },
});

// Update
await prisma.asset.update({
  where: { id: "some-id" },
  data: { status: "retired" },
});

// Delete
await prisma.asset.delete({
  where: { id: "some-id" },
});
```

---

## Project Structure

```
auth-app/
├── prisma/
│   ├── schema.prisma      ← Database schema (edit this to add models)
│   ├── migrations/         ← Migration history (auto-generated)
│   └── dev.db              ← SQLite database file (gitignored)
├── prisma.config.ts        ← Prisma config (datasource URL)
├── src/
│   ├── generated/prisma/   ← Auto-generated Prisma client (gitignored)
│   └── lib/
│       ├── prisma.ts       ← Prisma client singleton
│       └── users.ts        ← User queries (uses prisma)
└── .env                    ← DATABASE_URL
```

---

## Migrating to Hosted PostgreSQL

When ready to deploy, switch to a hosted database in 3 steps:

### 1. Update `prisma/schema.prisma`

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
 }
```

### 2. Update `.env`

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### 3. Update `src/lib/prisma.ts`

Replace the SQLite adapter with the PostgreSQL adapter:

```bash
npm install @prisma/adapter-pg
npm uninstall @prisma/adapter-better-sqlite3
```

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
```

### 4. Run migration

```bash
npx prisma migrate dev
```

### Recommended Hosted Providers (Free Tier)

- **Neon** — Serverless PostgreSQL, 0.5 GB free
- **Supabase** — PostgreSQL + extras, 500 MB free
- **Railway** — PostgreSQL, $5 credit/month
