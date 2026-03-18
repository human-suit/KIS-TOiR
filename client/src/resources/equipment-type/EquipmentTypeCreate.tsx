import { Create, SimpleForm, TextInput } from 'react-admin';


export const EquipmentTypeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="code" label="code" isRequired />
      <TextInput source="name" label="name" isRequired />
      <TextInput source="manufacturer" label="manufacturer"  />
      <TextInput source="maintenanceIntervalHours" label="maintenanceIntervalHours" />
      <TextInput source="overhaulIntervalHours" label="overhaulIntervalHours" />
    </SimpleForm>
  </Create>
);
