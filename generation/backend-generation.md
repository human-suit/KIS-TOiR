# Backend Generation Process

Backend generation follows a pipeline aligned with runtime and validation docs:

DSL
↓
CLI scaffolding
↓
code generation
↓
runtime infrastructure
↓
database runtime
↓
migration
↓
seed
↓
validation

Follow **backend/runtime-rules.md**, **backend/prisma-rules.md**, **backend/prisma-service.md**, **backend/database-runtime.md**, **backend/seed-rules.md**, and **backend/service-rules.md**.

---

# Step 1 — Parse DSL

Read DSL inputs and extract:

- entities
- attributes (including primary key attribute name per entity)
- enums
- foreign keys

---

# Step 2 — CLI scaffolding

Use official CLIs before generating backend code:

- NestJS project scaffold in `server/` (see `generation/scaffolding-rules.md`)
- Install backend dependencies (`@prisma/client`, `prisma`, `@nestjs/config`, and seed runner when needed)

---

# Step 3 — Code generation

Generate backend source artifacts:

1. **Prisma schema** (`server/prisma/schema.prisma`) from domain DSL:
   - attributes
   - primary keys
   - relations
   - enums
2. **NestJS modules** per entity:
   - module
   - controller (path params use actual PK name: `:id`, `:code`, etc.)
   - service (must sanitize update payload before Prisma — see **backend/service-rules.md**)
3. **DTO files**:
   - `create-entity.dto.ts`
   - `update-entity.dto.ts`
   - `entity.response.dto.ts` (or equivalent)
4. **PrismaService**:
   - `OnModuleInit` + `await this.$connect()`
   - no `beforeExit` hook
5. **Service update methods**: Sanitize update payload before passing to Prisma (remove `id`, primary key, and readonly attributes from `data`). Do not pass the raw request body as `data` to `prisma.*.update()`.

Use mapping rules from `backend/prisma-rules.md`:
- DSL `decimal` -> DTO `string`
- DSL `date` -> DTO `string` (ISO)

---

# Step 4 — Runtime infrastructure

Generate runtime config files:

- `server/.env`
- `server/.env.example`
- `server/package.json` lifecycle:
  - `"postinstall": "prisma generate"`
- `server/package.json` Prisma seed:
  - `"prisma": { "seed": "ts-node prisma/seed.ts" }` (or `tsx` variant by project standard)

Commands that must be supported/documented:

- `npx prisma generate`
- `npx prisma migrate dev`
- `npx prisma db seed`

---

# Step 5 — Database runtime

Generator must create `docker-compose.yml` at the **project root** with PostgreSQL.

Minimum required compose characteristics:

- `services.postgres`
- `image: postgres:16`
- `ports: ["5432:5432"]`

Credentials/database in compose must match `DATABASE_URL`.

---

# Step 6 — Migration

Apply schema to development database:

```bash
cd server
npx prisma migrate dev
```

---

# Step 7 — Seed

Run development seed:

```bash
cd server
npx prisma db seed
```

Seed file location: `server/prisma/seed.ts`.

---

# Step 8 — Validation

Run runtime and contract checks from `generation/post-generation-validation.md`, including:

- docker-compose exists and DB container starts
- Prisma lifecycle commands succeed
- seed runs
- `/health` responds
- React Admin receives `id` in every record