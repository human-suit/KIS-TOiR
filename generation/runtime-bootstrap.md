# Runtime Bootstrap

After project generation, the following commands must work in order so that the application runs without manual database provisioning or ad-hoc steps.

The generator must produce a **runnable development environment**: backend, frontend, and database must all be startable via a documented sequence.

---

# Bootstrap Sequence

## 1. Start the database

From the **project root**:

```bash
docker compose up -d
```

This starts the PostgreSQL container. The backend will connect to it using `DATABASE_URL` from `server/.env`.

---

## 2. Backend setup and start

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start
```

- `npm install` — installs dependencies and runs `postinstall` (e.g. `prisma generate`) if configured.
- `npx prisma generate` — ensures Prisma client is generated explicitly after install/schema changes.
- `npx prisma migrate dev` — creates/applies migrations and ensures the database schema exists.
- `npx prisma db seed` — populates minimal development data for immediate UI/API usage.
- `npm run start` — starts the NestJS server (default port e.g. 3000).

---

## 3. Frontend setup and start

In a separate terminal, from the **project root**:

```bash
cd client
npm install
npm run dev
```

- `npm run dev` — starts the Vite dev server (e.g. http://localhost:5173).

---

# Success Criteria

After running the above:

- Database container is running; Prisma can connect.
- Backend responds (e.g. `GET /health` returns `{ "status": "ok" }`).
- Frontend loads and can call the backend API.

The generator is responsible for producing all artifacts (docker-compose, schema, migrations, seed, env, health endpoint) so that this sequence succeeds without additional manual setup.
