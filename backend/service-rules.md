# Service Layer Rules

Generated NestJS services must follow these rules so that update operations work correctly with React Admin and Prisma.

---

# Update Payload Sanitization

React Admin (and many REST clients) **always send `id`** in PATCH/PUT request bodies.

Example payload from React Admin:

```json
{
  "id": "003",
  "name": "Pump"
}
```

Some entities use a **different primary key** (e.g. `code`). The API response includes `id` (mapped from the PK) for React Admin compatibility, but the Prisma model may have no `id` field—only `code`. If the service passes the incoming DTO directly to Prisma:

```typescript
// WRONG — causes runtime error
prisma.equipmentType.update({
  where: { code },
  data: dto  // dto contains "id", which is not a Prisma field
});
```

Prisma throws because `id` (and possibly other non-updatable fields) are not on the model or must not be written in `data`.

---

# Rules

1. **Update payload must be sanitized** before passing to the ORM. Do not pass the raw request body as `data` to `prisma.*.update()`.

2. **Remove `id`** from the update payload. React Admin sends `id` for identity; it must not be written to the database as a column (unless the entity actually has an `id` column and it is intended to be immutable on update).

3. **Remove the primary key** field from the update payload. The primary key is used in `where`; it must not appear in `data`. For example, remove `code` from `data` when updating by `code`.

4. **Remove readonly attributes** (e.g. created timestamps, server-generated fields) if they are present in the DTO, so they are not passed to Prisma `data`.

---

# Example Implementation

Destructure identity and primary key (and any other non-updatable fields) out of the DTO, then pass only the rest as `data`:

**Entity with primary key `code` (e.g. EquipmentType):**

```typescript
update(code: string, dto: UpdateEquipmentTypeDto) {
  const { id, code: _pk, ...data } = dto as any;
  return this.prisma.equipmentType.update({
    where: { code },
    data,
  });
}
```

Or, if the DTO type does not include `id` or `code`, explicitly omit only the fields that must not be written:

```typescript
update(code: string, dto: UpdateEquipmentTypeDto) {
  const { id, code: _pk, ...data } = dto as Record<string, unknown>;
  return this.prisma.equipmentType.update({
    where: { code },
    data,
  });
}
```

**Entity with primary key `id` (e.g. Equipment):**

```typescript
update(id: string, dto: UpdateEquipmentDto) {
  const { id: _pk, ...data } = dto as any;
  return this.prisma.equipment.update({
    where: { id },
    data,
  });
}
```

This way, `id` (and the PK) are never passed into `data`, and Prisma does not receive unknown or read-only fields.

---

# Summary

| Rule | Action |
|------|--------|
| Sanitize update payload | Before `prisma.*.update()`, strip non-data fields from the DTO. |
| Remove `id` | Do not pass `id` in `data` unless the entity has an updatable `id` (rare). |
| Remove primary key | Use PK only in `where`; omit from `data`. |
| Remove readonly fields | Omit created_at, server-only fields, etc. from `data`. |
