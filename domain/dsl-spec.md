# DSL Language Specification

This document describes the DSL (Domain Specific Language) used to specify fullstack CRUD applications. The DSL has four layers: Domain, DTO, API, and UI.

---

# DSL Grammar Concepts

## entity

An **entity** is a domain object that becomes a database table and a first-class resource in the backend and frontend.

```
entity Equipment {
  attribute id { type uuid; key primary; }
  attribute name { type string; is required; }
}
```

- **Domain:** Defines the canonical model; one entity = one Prisma model, one NestJS module, one React Admin resource.
- **Naming:** PascalCase (e.g. `Equipment`, `EquipmentType`, `RepairOrder`).

---

## attribute

An **attribute** is a field of an entity. It has a type and optional modifiers.

```
attribute name {
  description "Наименование";
  type string;
  is required;
  is unique;
}
```

**Modifiers:**

- `type` — required; one of: `string`, `uuid`, `integer`, `decimal`, `date`, `text`, or an enum name.
- `key primary` — this attribute is the primary key.
- `key foreign { relates Entity.field }` — foreign key to another entity's field.
- `is required` — non-nullable.
- `is unique` — unique constraint.
- `default Value` — default value (for enums or literals).
- `description "..."` — human-readable description.

---

## enum

An **enum** defines a fixed set of values. Used for attributes that can only take one of these values.

```
enum EquipmentStatus {
  value Active { label "В эксплуатации"; }
  value Repair { label "В ремонте"; }
}
```

- **value** — identifier used in data and code.
- **label** — optional display label for UI.

---

## primary key

Exactly one attribute per entity must be marked as primary key.

```
attribute id {
  type uuid;
  key primary;
}
```

Or for a natural key:

```
attribute code {
  type string;
  key primary;
  is required;
  is unique;
}
```

---

## foreign key

A **foreign key** links to another entity's primary key. The attribute type must match the referenced primary key type.

```
attribute equipmentTypeCode {
  type string;
  key foreign {
    relates EquipmentType.code;
  }
  is required;
}
```

- `relates Entity.attribute` — references `Entity`'s `attribute` (must be primary key).
- FK type must equal referenced PK type (e.g. `string` → `EquipmentType.code`, `uuid` → `Equipment.id`).

---

## required

- **is required** — attribute is non-nullable in domain and (unless overridden) in DTOs.
- Absence of `is required` means the attribute is optional (nullable).

---

## default

- **default Value** — applied when no value is provided (e.g. enum defaults like `default Active`).
- Value must exist in the enum when the attribute type is an enum.

---

## map

Used in **DTO** and **UI** layers to bind a DTO/UI field to a domain entity attribute.

**In DTO:**

```
attribute name {
  type string;
  map Equipment.name;
}
```

- Ensures DTO attribute corresponds to an existing `Entity.attribute` and that types align.

**In UI:**

```
attribute Наименование {
  map Equipment.name;
}
```

- UI label (e.g. "Наименование") maps to domain field `Equipment.name` for correct data binding and generation.

---

# DSL → System Component Mapping

## DSL → Prisma

| DSL Concept  | Prisma Result               |
| ------------ | --------------------------- |
| entity       | model                       |
| attribute    | field                       |
| enum         | enum                        |
| key primary  | @id or @id @default(uuid()) |
| key foreign  | relation + references       |
| type string  | String                      |
| type uuid    | String @id @default(uuid()) |
| type integer | Int                         |
| type decimal | Decimal                     |
| type date    | DateTime                    |
| type text    | String                      |

---

## DSL → NestJS

| DSL Concept    | NestJS Result                         |
| -------------- | ------------------------------------- |
| entity         | One module (e.g. equipment.module.ts) |
| entity         | Controller with CRUD endpoints        |
| entity         | Service with Prisma CRUD              |
| DTO (Create)   | create-{entity}.dto.ts                |
| DTO (Update)   | update-{entity}.dto.ts                |
| DTO (Response) | Used for GET response shape           |

API paths are derived from entity name: PascalCase → kebab-case, pluralized (e.g. `Equipment` → `/equipment`, `RepairOrder` → `/repair-orders`).

---

## DSL → React Admin

| DSL Concept           | React Admin Result                  |
| --------------------- | ----------------------------------- |
| entity                | Resource (name = kebab-case plural) |
| attribute             | Form field / column                 |
| type string           | TextInput, TextField                |
| type integer/decimal  | NumberInput, NumberField            |
| type date             | DateInput, DateField                |
| enum                  | SelectInput with choices            |
| foreign key           | ReferenceInput, ReferenceField      |
| UI attribute with map | Field with correct source           |

---

# DTO Mapping

- **map Entity.attribute** — DTO attribute corresponds to domain attribute; types must match.
- **Create DTO** — must not include generated primary keys (e.g. no `id` for uuid PK).
- **Update DTO** — all fields optional (nullable) for partial updates.
- **List response DTO** — must expose `data` (array) and `total` (integer) for React Admin compatibility.

---

# UI Mapping

- Each UI attribute should have **map Entity.attribute** so it binds to a real domain field.
- UI attribute name is the label (e.g. "Наименование"); **source** in generated components is the domain attribute name (e.g. `name`).
- Enums → SelectInput; foreign keys → ReferenceInput/ReferenceField.
