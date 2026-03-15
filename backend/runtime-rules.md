# Backend Runtime Rules

This document defines runtime configuration requirements for the generated backend. Generators must produce a project that runs without errors when these rules are followed.

---

# Environment Variables

The backend **must** have a `.env` file at the project root (e.g. `server/.env` or backend package root). This file must **not** be committed with real credentials; provide an example instead (e.g. `.env.example`).

## Required variables

| Variable     | Required | Description                             |
| ------------ | -------- | --------------------------------------- |
| DATABASE_URL | Yes      | PostgreSQL connection string for Prisma |

## Example

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/toir"
```

## Generation requirement

When generating the backend, **always** create:

1. **`.env.example`** — with placeholder DATABASE_URL and instructions.
2. **`.env`** — with the same placeholder so the app can start; user replaces with real values.

If the generator does not create `.env`, the first run will fail with:

```
Environment variable not found: DATABASE_URL
```

---

# Prisma Client Generation

After the Prisma schema is generated or modified, the Prisma client must be generated.

## Command

```bash
npx prisma generate
```

## Lifecycle rule

Add to generated `package.json` so that `prisma generate` runs after every `npm install`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

This ensures that after cloning or installing dependencies, the Prisma client is available without a manual step.

**Note:** Path may need to be adjusted if Prisma schema lives in a subfolder (e.g. `prisma generate` is typically run from the package root where `prisma/schema.prisma` exists).

---

# Database Migration

The generation process must document and support database migration.

## Command

```bash
npx prisma migrate dev
```

Run after:

1. Prisma schema has been generated or updated.
2. `npx prisma generate` has been run.

## Generation requirement

1. Include migration in the backend generation pipeline (see `generation/backend-generation.md`).
2. Document in README or post-generation validation that the user must run `npx prisma migrate dev` before first run (or provide a setup script that runs it).

---

# Summary

| Requirement     | Action                                                        |
| --------------- | ------------------------------------------------------------- |
| DATABASE_URL    | Create `.env` and `.env.example` with DATABASE_URL            |
| Prisma client   | Run `npx prisma generate`; add `postinstall` script           |
| Database schema | Document/run `npx prisma migrate dev` after schema generation |
