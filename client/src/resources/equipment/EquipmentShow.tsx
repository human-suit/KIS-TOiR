import { Show, SimpleShowLayout, TextField } from 'react-admin';

export const EquipmentShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="id" />
      <TextField source="inventoryNumber" label="inventoryNumber" />
      <TextField source="serialNumber" label="serialNumber" />
      <TextField source="name" label="name" />
      <TextField source="equipmentTypeCode" label="equipmentTypeCode" />
      <TextField source="status" label="status" />
      <TextField source="location" label="location" />
      <TextField source="commissionedAt" label="commissionedAt" />
      <TextField source="totalEngineHours" label="totalEngineHours" />
      <TextField source="engineHoursSinceLastRepair" label="engineHoursSinceLastRepair" />
      <TextField source="lastRepairAt" label="lastRepairAt" />
      <TextField source="notes" label="notes" />
    </SimpleShowLayout>
  </Show>
);
