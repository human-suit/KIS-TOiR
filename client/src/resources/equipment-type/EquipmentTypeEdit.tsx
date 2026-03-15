import { Edit, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const EquipmentTypeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="code" label="Код" disabled />
      <TextInput source="name" label="Наименование" isRequired />
      <TextInput source="manufacturer" label="Производитель" />
      <NumberInput source="maintenanceIntervalHours" label="Периодичность ТО (ч)" />
      <NumberInput source="overhaulIntervalHours" label="Периодичность КР (ч)" />
    </SimpleForm>
  </Edit>
);
