# Developer Workflow

This document describes the **developer workflow** for running a generated fullstack application locally. The generator must produce a project that supports this workflow so the app is **fully runnable** after generation.

## Regenerating code from DSL

If the domain DSL changes (e.g. a new entity is added), regenerate backend + frontend artifacts from `examples/TOiR.domain.dsl`:

```bash
cd server
npm run generate:from-dsl
```

Then apply the updated schema and seed data:

```bash
cd server
npx prisma db push
npx prisma db seed
```

---

# Prerequisites

- **Node.js** (LTS, e.g. 18+)
- **npm**
- **Docker** and **Docker Compose** (for the development database)

---

# Workflow Steps

## 1. Start the database

From the **project root**:

```bash
docker compose up -d
```

This starts the PostgreSQL container defined in `docker-compose.yml`. Wait a few seconds for the database to accept connections.

Verify (optional):

```bash
docker compose ps
```

---

## 2. Backend setup and start

From the **server** directory:

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start
```

- `npm install` — installs dependencies and runs `postinstall` (for example `prisma generate`).
- `npx prisma generate` — explicitly generates Prisma client.
- `npx prisma migrate dev` — creates/applies migrations.
- `npx prisma db seed` — inserts minimal development data.
- `npm run start` — starts NestJS backend.

The API should be available at the configured port (e.g. `http://localhost:3000`). Verify with:

```bash
curl http://localhost:3000/health
```

Expected: `{ "status": "ok" }` (or equivalent).

---

## 3. Frontend setup and start

In a **separate terminal**, from the **project root**:

```bash
cd client
npm install
npm run dev
```

- `npm install` — installs frontend dependencies.
- `npm run dev` — starts the Vite dev server (e.g. `http://localhost:5173`).

Open the Vite URL in a browser; the React Admin app should load and use the backend API.

---

## Optional: api-format → OpenAPI 3.0

Experimental tooling lives in `tools/api-format-to-openapi/`: a sample **domain api-format** JSON, a **prompt** for LLM conversion, and `convert.mjs` (**deterministic** mapping for `apiFormatVersion: "1"` or **`--mode llm`** via OpenAI). See `tools/api-format-to-openapi/README.md`.

```bash
cd tools/api-format-to-openapi
node convert.mjs --in examples/api-format.example.json --out ../../openapi.generated.json
```

**AID / HTTP:** Nest exposes `POST /aid/export/openapi` and `POST /aid/export/app` (see `server/src/aid-export/README.md`). CLI bundle: `node generation/generate.mjs --print-bundle-json --dsl <file.dsl>`.

---

# Summary

| Step | Command / location |
|------|---------------------|
| Start database | From root: `docker compose up -d` |
| Backend setup/start | `cd server && npm install && npx prisma generate && npx prisma migrate dev && npx prisma db seed && npm run start` |
| Frontend setup/start | `cd client && npm install && npm run dev` |

The generator must produce all required artifacts (docker-compose, env, schema, migrations, seed, health endpoint) so that this workflow succeeds and the development environment is fully runnable.
