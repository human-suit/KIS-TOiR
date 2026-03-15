# Frontend Architecture

Frontend stack:

- React
- TypeScript
- Vite
- React Admin
- shadcn/ui

The frontend is generated from the DSL and API specification.

Each entity becomes a React Admin resource.

---

# Project Structure

client/
  src/

    App.tsx

    resources/

      {entity}/
        {entity}List.tsx
        {entity}Create.tsx
        {entity}Edit.tsx
        {entity}Show.tsx

---

# Resource Registration

Each resource must be registered in App.tsx.

Example:

<Resource
  name="equipment"
  list={EquipmentList}
  create={EquipmentCreate}
  edit={EquipmentEdit}
  show={EquipmentShow}
/>

---

# Data Provider

React Admin uses the standard REST provider.

API format must follow:

GET /resource
GET /resource/:id
POST /resource
PATCH /resource/:id
DELETE /resource/:id

List response format:

{
  data: [],
  total: number
}

---

# Foreign Keys

Foreign keys must use ReferenceInput and ReferenceField.

Example:

<ReferenceInput source="equipmentTypeCode" reference="equipment-types" />

---

# Naming Conventions

## React component naming

Components are named after the entity in PascalCase. One entity = one resource with four main views.

- **List:** `{Entity}List.tsx` (e.g. `EquipmentList.tsx`, `RepairOrderList.tsx`)
- **Create:** `{Entity}Create.tsx` (e.g. `EquipmentCreate.tsx`)
- **Edit:** `{Entity}Edit.tsx` (e.g. `EquipmentEdit.tsx`)
- **Show:** `{Entity}Show.tsx` (e.g. `EquipmentShow.tsx`)

Examples:
- Equipment → `EquipmentList.tsx`, `EquipmentCreate.tsx`, `EquipmentEdit.tsx`, `EquipmentShow.tsx`
- EquipmentType → `EquipmentTypeList.tsx`, `EquipmentTypeCreate.tsx`, `EquipmentTypeEdit.tsx`, `EquipmentTypeShow.tsx`
- RepairOrder → `RepairOrderList.tsx`, `RepairOrderCreate.tsx`, `RepairOrderEdit.tsx`, `RepairOrderShow.tsx`

## Resource folder naming

Folder under `resources/` uses kebab-case, matching the React Admin resource name:

- `resources/equipment/`
- `resources/equipment-type/`
- `resources/repair-order/`

---

# Resource Naming Rules

React Admin resource name (used in `<Resource name="..." />` and in `reference` for ReferenceInput) must match the API resource path (no leading slash, same segment string).

1. **Entity → resource name:** PascalCase entity name is converted to kebab-case and pluralized.
2. **Consistency with API:** The resource name must be the same as the backend path segment so that the data provider calls the correct URL.

| Entity (DSL)   | Resource name (React Admin) | API path   |
|----------------|-----------------------------|------------|
| Equipment      | equipment                   | /equipment |
| EquipmentType  | equipment-types             | /equipment-types |
| RepairOrder    | repair-orders               | /repair-orders   |

Examples in App.tsx:
- `<Resource name="equipment" list={EquipmentList} create={EquipmentCreate} edit={EquipmentEdit} show={EquipmentShow} />`
- `<Resource name="equipment-types" list={EquipmentTypeList} ... />`
- `<Resource name="repair-orders" list={RepairOrderList} ... />`