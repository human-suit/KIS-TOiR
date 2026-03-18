import {
  List,
  Datagrid,
  TextField,
  TextInput,
  TopToolbar,
  FilterButton,
  CreateButton,
  ExportButton,
  NumberField,
  DateField,
  SelectField,
  ReferenceField,
  SelectArrayInput,
  ReferenceInput,
  AutocompleteInput
} from 'react-admin';

const statusChoices = [
  { id: 'Active', name: 'Active' },
  { id: 'Repair', name: 'Repair' },
  { id: 'Reserve', name: 'Reserve' },
  { id: 'WriteOff', name: 'WriteOff' },
];

const equipmentFilters = [
  <TextInput key="q" source="q" label="Поиск" alwaysOn />,
  <TextInput key="inventoryNumber" source="inventoryNumber" label="inventoryNumber" />,
  <TextInput key="serialNumber" source="serialNumber" label="serialNumber" />,
  <TextInput key="name" source="name" label="name" />,
  <ReferenceInput key="equipmentTypeCode" source="equipmentTypeCode" reference="equipment-types" label="equipmentTypeCode">
    <AutocompleteInput optionText={(record) => record.code ? `${record.code} — ${record.name ?? record.code}` : (record.name ?? record.id)} filterToQuery={(searchText) => ({ q: searchText })} />
  </ReferenceInput>,
  <SelectArrayInput key="status" source="status" label="status" choices={statusChoices} />,
  <TextInput key="location" source="location" label="location" />,
  <TextInput key="notes" source="notes" label="notes" />
];

const EquipmentListActions = () => (
  <TopToolbar>
    <FilterButton filters={equipmentFilters} />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const EquipmentList = () => (
  <List actions={<EquipmentListActions />} filters={equipmentFilters} sort={{ field: 'id', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" label="id" />
      <TextField source="inventoryNumber" label="inventoryNumber" />
      <TextField source="serialNumber" label="serialNumber" />
      <TextField source="name" label="name" />
      <ReferenceField source="equipmentTypeCode" reference="equipment-types" label="equipmentTypeCode" link="show">
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="status" label="status" choices={statusChoices} />
      <TextField source="location" label="location" />
      <DateField source="commissionedAt" label="commissionedAt" />
      <NumberField source="totalEngineHours" label="totalEngineHours" />
      <NumberField source="engineHoursSinceLastRepair" label="engineHoursSinceLastRepair" />
      <DateField source="lastRepairAt" label="lastRepairAt" />
      <TextField source="notes" label="notes" />
    </Datagrid>
  </List>
);
