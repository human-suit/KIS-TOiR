# Post-Generation Validation

After generating the backend or fullstack application, run these checks to ensure the project will run without runtime errors.

---

# Validation Checklist

## 1. Environment file

- [ ] **`.env` exists** in the backend root (e.g. `server/.env`).
- [ ] **`.env.example` exists** with at least `DATABASE_URL` and a placeholder value.
- [ ] **`DATABASE_URL`** is present in `.env` (or documented in `.env.example` so the user can copy and set it).

**Failure symptom:** `Environment variable not found: DATABASE_URL` at startup.

---

## 2. PrismaService implementation

- [ ] A **PrismaService** (or equivalent) class exists and extends `PrismaClient`.
- [ ] It implements **`OnModuleInit`** and calls **`await this.$connect()`** in `onModuleInit()`.
- [ ] It does **not** use **`this.$on('beforeExit', ...)`** or any `beforeExit` hook.

**Failure symptom:** Deprecation/runtime errors in Prisma 5 when using `beforeExit`.

**Reference:** `backend/prisma-service.md`

---

## 3. Prisma client lifecycle

- [ ] **`package.json`** includes a script that runs Prisma client generation:
  - Either **`"postinstall": "prisma generate"`** (or `npx prisma generate`),
  - Or clear documentation to run **`npx prisma generate`** after install.
- [ ] After schema generation or change, **`npx prisma generate`** has been run (or will run via postinstall).

**Failure symptom:** `Cannot find module '@prisma/client'` or missing types at build/run.

---

## 4. Database migration

- [ ] **Migration workflow** is documented (e.g. in README or generation docs).
- [ ] Instruction to run **`npx prisma migrate dev`** (or `prisma migrate deploy` for production) after first generation or schema change.
- [ ] Generation pipeline (see `generation/backend-generation.md`) includes or documents the migration step.

**Failure symptom:** Tables do not exist; Prisma errors on first query.

---

## 5. REST route parameters

- [ ] For each entity, path parameters use the **correct primary key name** from the DSL.
- [ ] **Entity with PK `id` (uuid):** routes use **`/:id`** (e.g. `GET /equipment/:id`, `PATCH /equipment/:id`).
- [ ] **Entity with non-`id` primary key (e.g. `code`):** routes use **`/:code`** (or the actual PK attribute name), e.g. `GET /equipment-types/:code`, **not** `GET /equipment-types/:id`.

**Example:**

| Entity        | Primary key | Correct path           | Incorrect path       |
| ------------- | ----------- | ---------------------- | -------------------- |
| Equipment     | id          | /equipment/:id         | —                    |
| EquipmentType | code        | /equipment-types/:code | /equipment-types/:id |
| RepairOrder   | id          | /repair-orders/:id     | —                    |

**Failure symptom:** Controller expects `params.id` but route is defined with `:code`; or vice versa; 404 or wrong resource updated.

**Reference:** `backend/architecture.md` — API path rules for non-id primary keys.

---

## 6. DTO type mapping (serialization)

- [ ] **DSL `decimal`** → In DTO/API response, use **`string`** (or a type that serializes to string), not Prisma `Decimal`, to avoid JSON serialization issues.
- [ ] **DSL `date`** → In DTO/API response, use **`string`** (ISO 8601) or ensure DateTime is serialized to string, so React Admin and JSON consumers receive a string.

**Reference:** `backend/prisma-rules.md` — DTO type mapping table.

---

## 7. React Admin ID field in API responses

- [ ] **Every API response object** (list items and single-resource GET) contains a field named **`id`**.
- [ ] If the entity primary key is **not** named `id`, the response must **map** the primary key to `id`: e.g. `id: record.code` for EquipmentType, so the payload includes both `id` and `code` (or at least `id` with the PK value).
- [ ] The `id` field value must be the **primary key value** (string or uuid as appropriate).

**Failure symptom:** React Admin fails to identify records, breaks cache/references, or throws when expecting `record.id`.

**Reference:** `frontend/react-admin-rules.md` — React Admin ID Field Requirement.

---

## 8. Update payload sanitization (service layer)

- [ ] **Update endpoint must not pass `id` (or primary key) in Prisma `data`.** The service must sanitize the incoming DTO before calling `prisma.*.update({ where, data })`: remove `id`, remove the entity primary key field (e.g. `code`), and remove any readonly attributes. Only updatable fields should be passed as `data`.
- [ ] Generated update methods follow the pattern from **backend/service-rules.md** (e.g. `const { id, code, ...data } = dto` then pass `data` to Prisma).

**Failure symptom:** Prisma throws when `data` contains `id` or another field that is not on the model or not writable (e.g. entity with PK `code` receives body with `id` from React Admin).

**Reference:** `backend/service-rules.md`

---

## 9. Database runtime (docker-compose)

- [ ] **`docker-compose.yml` exists** at the project root (or documented location).
- [ ] It defines a **PostgreSQL** service with image (e.g. `postgres:16`), port `5432`, and credentials/DB name matching `DATABASE_URL` in `server/.env`.
- [ ] **Database container starts:** `docker compose up -d` runs without error and the container is reachable on the configured port.

**Failure symptom:** `PrismaClientInitializationError P1001: Can't reach database server at localhost:5432`.

**Reference:** `backend/database-runtime.md`

---

## 10. Migrations and seed

- [ ] **`npx prisma migrate dev`** runs successfully from `server/` when the database is up (schema is applied or created).
- [ ] **Seed script** exists at `server/prisma/seed.ts` (or equivalent) and creates minimal sample data (e.g. one EquipmentType, one Equipment, one RepairOrder).
- [ ] **`npx prisma db seed`** runs without error (package.json has `prisma.seed` configured and seed runner installed).

**Reference:** `backend/seed-rules.md`, `generation/runtime-bootstrap.md`

---

## 11. Health endpoint

- [ ] Backend exposes **GET /health** (or equivalent health route).
- [ ] **API responds to /health:** With backend running, `GET http://localhost:<port>/health` returns HTTP 200 and a body such as `{ "status": "ok" }`.

**Reference:** `backend/architecture.md` — Health Endpoint

---

# Summary Table

| Check               | Required artifact / rule                       |
| ------------------- | ---------------------------------------------- |
| .env                | File exists with DATABASE_URL                  |
| DATABASE_URL        | Present in .env or .env.example                |
| PrismaService       | OnModuleInit + $connect(); no beforeExit       |
| prisma generate     | postinstall script or documented step          |
| Migration           | Documented step: prisma migrate dev            |
| REST path params    | Use entity PK name (:id or :code, etc.)        |
| Decimal/Date in DTO | Map to string for serialization                |
| API response `id`   | Every record has `id`; if PK ≠ id, map PK → id |
| Update payload      | Service strips `id`, PK, readonly from data before Prisma |
| docker-compose.yml  | Exists at project root; PostgreSQL service     |
| Database container  | Starts with `docker compose up -d`             |
| prisma migrate dev  | Runs successfully from server/                 |
| Seed script         | Exists; prisma db seed runs                    |
| GET /health         | Backend responds with 200 and status payload   |

---

# Integration with generation pipeline

1. **Backend generation** (see `generation/backend-generation.md`) should produce artifacts that satisfy the above by default.
2. After generation, run this checklist manually or via a script that parses generated code and config.
3. If any check fails, the AI context or generator should be updated so that future runs pass.
