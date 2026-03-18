import { Create, SimpleForm, TextInput, SelectInput, ReferenceInput, AutocompleteInput } from 'react-admin';

const statusChoices = [
  { id: 'Active', name: 'Active' },
  { id: 'Repair', name: 'Repair' },
  { id: 'Reserve', name: 'Reserve' },
  { id: 'WriteOff', name: 'WriteOff' },
];

export const EquipmentCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="inventoryNumber" label="inventoryNumber" isRequired />
      <TextInput source="serialNumber" label="serialNumber"  />
      <TextInput source="name" label="name" isRequired />
      <ReferenceInput source="equipmentTypeCode" reference="equipment-types" label="equipmentTypeCode">
        <AutocompleteInput optionText={(record) => record.code ? `${record.code} — ${record.name ?? record.code}` : (record.name ?? record.id)} filterToQuery={(searchText) => ({ q: searchText })} />
      </ReferenceInput>
      <SelectInput source="status" label="status" choices={statusChoices} emptyText="Не выбрано" />
      <TextInput source="location" label="location"  />
      <TextInput source="commissionedAt" label="commissionedAt" />
      <TextInput source="totalEngineHours" label="totalEngineHours" />
      <TextInput source="engineHoursSinceLastRepair" label="engineHoursSinceLastRepair" />
      <TextInput source="lastRepairAt" label="lastRepairAt" />
      <TextInput source="notes" label="notes"  />
    </SimpleForm>
  </Create>
);
