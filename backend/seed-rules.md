# Seed Data Rules

The generator must create a **Prisma seed script** so the development database contains minimal sample data. This allows the frontend and API to be used immediately after migration.

---

# Seed Script Location

**File:** `server/prisma/seed.ts`

(Or `server/prisma/seed.js` if the project uses JavaScript; TypeScript is preferred and may require `ts-node` or `tsx` to run.)

---

# Seed Data Requirements

The seed script must create **minimal sample data** for at least one record per main entity, so that:

- List views show data.
- Reference fields (e.g. equipment type, equipment) have valid options.
- The app is demo-ready without manual data entry.

## Example scope (TOiR-style domain)

- **One EquipmentType** (e.g. code `"pump"`, name `"Pump"`).
- **One Equipment** (e.g. linked to that type, with required fields filled).
- **One RepairOrder** (e.g. linked to that equipment, with required fields filled).

Order matters: create EquipmentType first, then Equipment (references type), then RepairOrder (references equipment). Use Prisma `create` with the generated client; respect unique constraints and foreign keys.

---

# Prisma Seed Configuration

The generator must add the following to **`server/package.json`**:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

If the project uses a different runner (e.g. `tsx`), use that instead:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Ensure the seed runner is installed (e.g. `ts-node` as dev dependency) so that:

```bash
npx prisma db seed
```

runs successfully.

---

# Running the Seed

After migrations:

```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

Or document that the user can run `npx prisma db seed` once after the first migration to populate sample data.

---

# Summary

| Requirement        | Action |
|--------------------|--------|
| Seed script        | Create `server/prisma/seed.ts` (or equivalent). |
| Sample data        | At least one EquipmentType, one Equipment, one RepairOrder (or equivalent for the DSL). |
| package.json       | Add `"prisma": { "seed": "ts-node prisma/seed.ts" }` (or tsx). |
| Seed runner        | Ensure ts-node (or tsx) is available so `prisma db seed` works. |
