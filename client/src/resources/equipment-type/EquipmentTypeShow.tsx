import { Show, SimpleShowLayout, TextField } from 'react-admin';

export const EquipmentTypeShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="code" label="code" />
      <TextField source="name" label="name" />
      <TextField source="manufacturer" label="manufacturer" />
      <TextField source="maintenanceIntervalHours" label="maintenanceIntervalHours" />
      <TextField source="overhaulIntervalHours" label="overhaulIntervalHours" />
    </SimpleShowLayout>
  </Show>
);
