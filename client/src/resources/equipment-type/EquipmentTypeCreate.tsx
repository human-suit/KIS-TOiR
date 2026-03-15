import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const EquipmentTypeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="code" label="Код" isRequired />
      <TextInput source="name" label="Наименование" isRequired />
      <TextInput source="manufacturer" label="Производитель" />
      <NumberInput source="maintenanceIntervalHours" label="Периодичность ТО (ч)" />
      <NumberInput source="overhaulIntervalHours" label="Периодичность КР (ч)" />
    </SimpleForm>
  </Create>
);
