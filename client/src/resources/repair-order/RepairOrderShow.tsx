import { Show, SimpleShowLayout, TextField } from 'react-admin';

export const RepairOrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="id" />
      <TextField source="number" label="number" />
      <TextField source="equipmentId" label="equipmentId" />
      <TextField source="repairKind" label="repairKind" />
      <TextField source="status" label="status" />
      <TextField source="plannedAt" label="plannedAt" />
      <TextField source="startedAt" label="startedAt" />
      <TextField source="completedAt" label="completedAt" />
      <TextField source="contractor" label="contractor" />
      <TextField source="engineHoursAtRepair" label="engineHoursAtRepair" />
      <TextField source="description" label="description" />
      <TextField source="notes" label="notes" />
    </SimpleShowLayout>
  </Show>
);
