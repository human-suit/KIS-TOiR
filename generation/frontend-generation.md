# Frontend Generation Process

Frontend generation uses the DSL and API specification.

---

# Step 1 — Parse DSL

Extract entities and attributes.

---

# Step 2 — Generate React Admin Resources

For each entity create:

EntityList.tsx
EntityCreate.tsx
EntityEdit.tsx
EntityShow.tsx

## List UX requirements (must be generated)

- Lists must include **filtering UI** via `filters` prop on `List` and an explicit actions toolbar with:
  - `FilterButton` (so non-`alwaysOn` filters are discoverable)
  - `CreateButton`
  - `ExportButton`
- Lists must include a **default sort** (`sort={{ field: "...", order: "ASC|DESC" }}`) appropriate for the entity.

## Reference selection UX (must be generated)

- For foreign keys (`ReferenceInput`) in Create/Edit forms, prefer `AutocompleteInput` over `SelectInput` to support search.
- Autocomplete must send search text to backend using `filterToQuery={(searchText) => ({ q: searchText })}`.
- Option text must include a **code** (or business identifier) and a name when available, e.g. `CODE — NAME`.

## Enum filters (must be generated)

- For enum fields in **list filters**, use:
  - `SelectInput` for single-select filters
  - `SelectArrayInput` for multi-select filters when users need to filter by multiple enum values (e.g. Status).

---

# Step 3 — Map Fields

Map DSL attributes to React Admin components.

---

# Step 4 — Register Resources

Register resources in App.tsx.

Example:

<Resource name="equipment" ... />