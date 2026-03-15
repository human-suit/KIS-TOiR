# DSL → Prisma Mapping Rules

The domain DSL defines the database schema.

Each DSL entity becomes a Prisma model.

---

# Type Mapping (Prisma schema)

| DSL Type | Prisma Type |
|--------|-------------|
| string | String |
| uuid | String @id @default(uuid()) |
| integer | Int |
| decimal | Decimal |
| date | DateTime |
| text | String |

---

# DTO Type Mapping (API / serialization)

For DTOs and API responses, use types that serialize to JSON without errors. Prisma's `Decimal` and `DateTime` do not always serialize predictably; map them as follows in generated DTOs:

| DSL Type | Prisma Type | DTO / API type | Notes |
|----------|-------------|----------------|-------|
| string   | String      | string         | — |
| uuid     | String      | string         | — |
| integer  | Int         | number         | — |
| decimal  | Decimal     | **string**     | Avoid Prisma Decimal in DTO; use string to prevent serialization issues. |
| date     | DateTime    | **string**     | ISO 8601 date string (e.g. `"2025-03-08T00:00:00.000Z"`). |
| text     | String      | string         | — |
| enum     | enum        | string         | Enum value as string. |

**Rules:**
- **decimal** → In create/update/response DTOs, use `string` (or a type that serializes to string). Convert to/from Prisma `Decimal` only in the service layer.
- **date** → In DTOs, use `string` (ISO date). Convert to/from Prisma `DateTime` in the service layer.

---

# Enum Mapping

DSL enum becomes Prisma enum.

Example:

DSL

enum EquipmentStatus {
  Active
  Repair
}

Prisma

enum EquipmentStatus {
  Active
  Repair
}

---

# Foreign Keys

DSL foreign keys become Prisma relations.

Example:

DSL

attribute equipmentTypeCode {
  type string;
  key foreign {
    relates EquipmentType.code;
  }
}

Prisma

equipmentTypeCode String
equipmentType EquipmentType @relation(fields: [equipmentTypeCode], references: [code])

---

# Primary Keys

Primary keys defined in DSL must become Prisma model identifiers.

Example:

attribute id {
  type uuid;
  key primary;
}

Prisma

id String @id @default(uuid())

---

# Prisma Service Rules

Use Prisma v5 compatible service. See **backend/prisma-service.md** for full specification.

- PrismaService MUST implement `OnModuleInit` and call `await this.$connect()` in `onModuleInit()`.
- PrismaService MUST NOT use the deprecated `this.$on('beforeExit', ...)` hook (not supported in Prisma 5).

---

# Prisma Lifecycle Rules

These lifecycle rules must be applied in generated projects so Prisma runtime is reliable after generation and after dependency installation.

## 1) Generate Prisma client after schema changes

Whenever `prisma/schema.prisma` is generated or updated, run:

```bash
npx prisma generate
```

## 2) postinstall lifecycle

Generated `server/package.json` must include:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma client generation after `npm install`.

## 3) Migration lifecycle

Use development migration workflow:

```bash
npx prisma migrate dev
```

Run this after database startup and before starting the backend server.

## 4) Seed lifecycle

If seed is configured (see `backend/seed-rules.md`), run:

```bash
npx prisma db seed
```

Generated `server/package.json` should include:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Use `tsx prisma/seed.ts` if the project standard uses `tsx` instead of `ts-node`.