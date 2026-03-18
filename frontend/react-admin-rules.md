# DSL → React Admin Mapping

Entity attributes determine UI fields.

---

# Type Mapping

| DSL Type | React Admin Component |
|---------|-----------------------|
| string | TextInput / TextField |
| integer | NumberInput |
| decimal | NumberInput |
| date | DateInput |
| enum | SelectInput |
| foreign key | ReferenceInput |

---

# Example

DSL

attribute name {
  type string;
}

React Admin

<TextInput source="name" />

---

# Enum Example

DSL

attribute status {
  type EquipmentStatus;
}

React Admin

<SelectInput source="status" choices={statusChoices} />

## List filtering UX rules

- Lists should provide a visible filter UX:
  - Use `List` `filters` prop to define filter inputs.
  - Use an actions toolbar that includes `FilterButton` so users can add/remove non-`alwaysOn` filters.

## Multi-select enum filters

When filtering by enum values where users often need multiple selections (e.g. `status`), use:

`SelectArrayInput` in list filters, and ensure the backend supports repeated query params (e.g. `status=A&status=B`).

## Reference selection UX rules

For foreign keys, prefer `ReferenceInput` + `AutocompleteInput` over `SelectInput`.
Autocomplete search should send `q` to backend using `filterToQuery={(searchText) => ({ q: searchText })}`.

---

# Foreign Key Example

DSL

attribute equipmentTypeCode {
  type string;
}

React Admin

<ReferenceInput source="equipmentTypeCode" reference="equipment-types" />

---

# React Admin ID Field Requirement

React Admin requires every record in list and detail responses to contain a field named **`id`**. It uses this field for resource identity, cache keys, and references.

**Rules:**

1. Every record returned by the API must contain an **`id`** field.
2. If the DSL primary key is not named `id`, the generator must **map** the primary key value to an `id` field in the API response (backend) or in a frontend adapter.
3. The `id` field must contain the **value of the primary key** (e.g. uuid string, or `code` value for EquipmentType).

**Example:**

DSL entity with primary key `code`:

```
entity EquipmentType {
  attribute code {
    key primary;
    type string;
  }
  attribute name { type string; }
}
```

API response must include `id` so React Admin can identify the record:

```json
{
  "id": "pump",
  "code": "pump",
  "name": "Pump"
}
```

If the response only had `{ "code": "pump", "name": "Pump" }`, React Admin would not work correctly because it expects `id`. The backend or frontend adapter must therefore set `id: record.code` (or equivalent) when the primary key is not `id`.

This rule ensures compatibility with React Admin resource identity handling.