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

---

# Step 3 — Map Fields

Map DSL attributes to React Admin components.

---

# Step 4 — Register Resources

Register resources in App.tsx.

Example:

<Resource name="equipment" ... />