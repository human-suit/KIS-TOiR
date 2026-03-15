# Project Scaffolding Rules

The generator must use **official CLI tools** to create base project structures.

The AI must **not** manually generate the entire project skeleton (e.g. by writing all config files and folder structure by hand). Using the CLI reduces errors and ensures compatibility with current tool versions.

---

# Backend Scaffolding

Use **NestJS CLI**.

## Command

```bash
npx @nestjs/cli@10.3.2 new server --package-manager npm --skip-git
```

## Rules

- **Project directory** must be `server`.
- **TypeScript** must be used (default for Nest CLI).
- **npm** must be the package manager (`--package-manager npm`).
- **Git** initialization must be skipped (`--skip-git`).

## After scaffolding — install required dependencies

Run from the `server` directory:

```bash
npm install @prisma/client
npm install prisma --save-dev
npm install @nestjs/config
```

---

# Frontend Scaffolding

Use **Vite CLI**.

## Command

```bash
npm create vite@5.2.0 client -- --template react-ts
```

## Rules

- **Project directory** must be `client`.
- **React + TypeScript** template must be used (`--template react-ts`).

## After scaffolding — install required dependencies

Run from the `client` directory:

```bash
npm install react-admin
npm install ra-data-simple-rest
npm install @mui/material @emotion/react @emotion/styled
```

---

# Scaffolding Strategy

Generation pipeline order:

1. **Parse DSL** — Read domain, DTO, API, and UI DSL files.
2. **Run CLI scaffolding** — Create `server` with NestJS CLI and `client` with Vite CLI; install dependencies as above.
3. **Code generation** — Generate Prisma schema, NestJS modules/DTOs/PrismaService, and React Admin resources.
4. **Runtime infrastructure** — Generate `.env`, `.env.example`, package lifecycle scripts, and runtime config files.
5. **Database runtime** — Generate `docker-compose.yml` in project root with PostgreSQL service (`postgres`, image `postgres:16`, port `5432:5432`).
6. **Migration** — Apply schema with `npx prisma migrate dev`.
7. **Seed** — Populate minimal development data with `npx prisma db seed`.
8. **Validation** — Run checks from `generation/post-generation-validation.md`.

Scaffolding (steps 1–2) must be done with the CLI; steps 3–8 are generated from the DSL and project docs.
