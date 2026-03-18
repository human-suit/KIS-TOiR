import { Edit, SimpleForm, TextInput, SelectInput, ReferenceInput, AutocompleteInput } from 'react-admin';

const repairKindChoices = [
  { id: 'TO', name: 'TO' },
  { id: 'TR', name: 'TR' },
  { id: 'TRE', name: 'TRE' },
  { id: 'KR', name: 'KR' },
  { id: 'AR', name: 'AR' },
  { id: 'MP', name: 'MP' },
];

const statusChoices = [
  { id: 'Draft', name: 'Draft' },
  { id: 'Approved', name: 'Approved' },
  { id: 'InWork', name: 'InWork' },
  { id: 'Done', name: 'Done' },
  { id: 'Cancelled', name: 'Cancelled' },
];

export const RepairOrderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" label="id" disabled />
      <TextInput source="number" label="number" isRequired />
      <ReferenceInput source="equipmentId" reference="equipment" label="equipmentId">
        <AutocompleteInput optionText={(record) => record.code ? `${record.code} — ${record.name ?? record.code}` : (record.name ?? record.id)} filterToQuery={(searchText) => ({ q: searchText })} />
      </ReferenceInput>
      <SelectInput source="repairKind" label="repairKind" choices={repairKindChoices} emptyText="Не выбрано" />
      <SelectInput source="status" label="status" choices={statusChoices} emptyText="Не выбрано" />
      <TextInput source="plannedAt" label="plannedAt" />
      <TextInput source="startedAt" label="startedAt" />
      <TextInput source="completedAt" label="completedAt" />
      <TextInput source="contractor" label="contractor"  />
      <TextInput source="engineHoursAtRepair" label="engineHoursAtRepair" />
      <TextInput source="description" label="description"  />
      <TextInput source="notes" label="notes"  />
    </SimpleForm>
  </Edit>
);
