import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

export const EquipmentTypeShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="code" label="Код" />
      <TextField source="name" label="Наименование" />
      <TextField source="manufacturer" label="Производитель" />
      <NumberField source="maintenanceIntervalHours" label="Периодичность ТО (ч)" />
      <NumberField source="overhaulIntervalHours" label="Периодичность КР (ч)" />
    </SimpleShowLayout>
  </Show>
);
