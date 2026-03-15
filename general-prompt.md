ROLE

You are a Staff-level Fullstack Platform Engineer.

Your task is to generate a fully runnable fullstack CRUD application from the DSL context of this repository.

Use context7.

Follow official best practices from:

NestJS documentation

Prisma documentation

React Admin documentation

Docker documentation

The generated application must run without manual fixes.

PROJECT CONTEXT

You must read the project documentation in the following strict order:

domain/dsl-spec.md

examples/\*.dsl

backend/architecture.md

backend/prisma-rules.md

backend/prisma-service.md

backend/service-rules.md

backend/runtime-rules.md

backend/database-runtime.md

backend/seed-rules.md

frontend/architecture.md

frontend/react-admin-rules.md

generation/scaffolding-rules.md

generation/backend-generation.md

generation/frontend-generation.md

generation/runtime-bootstrap.md

generation/post-generation-validation.md

Do not ignore any rules defined in these documents.

GOAL

Generate a DSL-driven fullstack CRUD system.

Stack:

Backend

Node.js

NestJS

Prisma ORM

PostgreSQL

Frontend

React

Vite

React Admin

MUI

shadcn/ui

PROJECT STRUCTURE

Root
docker-compose.yml
server/
client/

Backend
server/
src/
modules/{entity}/
prisma/schema.prisma
prisma/seed.ts
.env
.env.example

Frontend
client/src/resources/{entity}/
client/src/App.tsx
client/src/dataProvider.ts

STEP 1 — Parse DSL

Parse all DSL files and extract:

Entities
Attributes
Primary keys
Foreign keys
Enums

Respect the DSL specification.

STEP 2 — CLI scaffolding

Use official CLIs.

Backend
npx @nestjs/cli@10.3.2 new server --package-manager npm --skip-git

Frontend
npm create vite@5.2.0 client -- --template react-ts

STEP 3 — Install dependencies

Backend

@prisma/client
prisma
@nestjs/config

Frontend

react-admin
ra-data-simple-rest
@mui/material
@emotion/react
@emotion/styled

STEP 4 — Generate Prisma schema

From DSL domain generate:

models

enums

relations

primary keys

Type mapping

decimal → Decimal
date → DateTime

DTO mapping

decimal → string
date → ISO string

STEP 5 — Generate NestJS modules

Per entity generate:

module
controller
service
dto

Controller routes

GET /resource
GET /resource/:pk
POST /resource
PATCH /resource/:pk
DELETE /resource/:pk

Path parameter must match the DSL primary key name.

Examples

/equipment/:id
/equipment-types/:code
/repair-orders/:id

STEP 6 — Generate Service Layer

Service layer must follow backend/service-rules.md.

Important rule:

React Admin sends the id field in update payloads even when the primary key is not named id.

Therefore update payload must be sanitized before passing data to Prisma.

Services MUST NOT pass raw request DTO directly into Prisma.

Incorrect:

prisma.entity.update({
where,
data: dto
})

Correct pattern:

const { id, <primaryKey>, ...data } = dto

return prisma.entity.update({
where,
data
})

Example (PK = code)

const { id, code, ...data } = dto

return prisma.equipmentType.update({
where: { code },
data
})

Example (PK = id)

const { id: \_pk, ...data } = dto

return prisma.entity.update({
where: { id },
data
})

Rules

Update payload passed to Prisma must not contain:

id
primary key attribute
readonly attributes

STEP 7 — Generate PrismaService

Requirements

extends PrismaClient
implements OnModuleInit
await this.$connect()

Do NOT use

beforeExit

STEP 8 — Generate runtime infrastructure

Create

server/.env
server/.env.example

DATABASE_URL example

postgresql://postgres:postgres@localhost:5432/toir

Add to package.json

postinstall: prisma generate

STEP 9 — Database runtime

Generate root

docker-compose.yml

PostgreSQL container

postgres:16
port 5432

STEP 10 — Generate seed

Create

server/prisma/seed.ts

Seed minimal data for

EquipmentType
Equipment
RepairOrder

Add to package.json

prisma.seed

STEP 11 — Generate React Admin

For each entity generate

Field mapping

string → TextInput
number → NumberInput
date → DateInput
enum → SelectInput
FK → ReferenceInput

API responses MUST contain

If PK ≠ id, map primary key to id.

Example

{
id: record.code,
code: record.code
}

STEP 12 — Validation

Verify

docker-compose.yml exists
database container starts
prisma migrate dev works
prisma db seed works
API responds /health
React Admin receives id
update services sanitize payload before Prisma

OUTPUT

Provide

FULLSTACK GENERATION REPORT

Include

1 Parsed DSL
2 Prisma models
3 Backend modules
4 API endpoints
5 React Admin resources
6 Runtime configuration
7 Validation results

RUN INSTRUCTIONS

The generated application must run successfully with

docker compose up -d

cd server
npm install
npx prisma migrate dev
npm run start

cd client
npm install
npm run dev
