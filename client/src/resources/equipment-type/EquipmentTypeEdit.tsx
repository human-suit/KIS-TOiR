import { Edit, SimpleForm, TextInput } from 'react-admin';


export const EquipmentTypeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="code" label="code" disabled />
      <TextInput source="name" label="name" isRequired />
      <TextInput source="manufacturer" label="manufacturer"  />
      <TextInput source="maintenanceIntervalHours" label="maintenanceIntervalHours" />
      <TextInput source="overhaulIntervalHours" label="overhaulIntervalHours" />
    </SimpleForm>
  </Edit>
);
