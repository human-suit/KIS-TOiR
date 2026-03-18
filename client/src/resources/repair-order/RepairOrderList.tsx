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
  SelectInput,
  ReferenceInput,
  AutocompleteInput
} from 'react-admin';

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

const repairOrderFilters = [
  <TextInput key="q" source="q" label="Поиск" alwaysOn />,
  <TextInput key="number" source="number" label="number" />,
  <ReferenceInput key="equipmentId" source="equipmentId" reference="equipment" label="equipmentId">
    <AutocompleteInput optionText={(record) => record.code ? `${record.code} — ${record.name ?? record.code}` : (record.name ?? record.id)} filterToQuery={(searchText) => ({ q: searchText })} />
  </ReferenceInput>,
  <SelectInput key="repairKind" source="repairKind" label="repairKind" choices={repairKindChoices} emptyText="Все" />,
  <SelectArrayInput key="status" source="status" label="status" choices={statusChoices} />,
  <TextInput key="contractor" source="contractor" label="contractor" />,
  <TextInput key="description" source="description" label="description" />,
  <TextInput key="notes" source="notes" label="notes" />
];

const RepairOrderListActions = () => (
  <TopToolbar>
    <FilterButton filters={repairOrderFilters} />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const RepairOrderList = () => (
  <List actions={<RepairOrderListActions />} filters={repairOrderFilters} sort={{ field: 'id', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" label="id" />
      <TextField source="number" label="number" />
      <ReferenceField source="equipmentId" reference="equipment" label="equipmentId" link="show">
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="repairKind" label="repairKind" choices={repairKindChoices} />
      <SelectField source="status" label="status" choices={statusChoices} />
      <DateField source="plannedAt" label="plannedAt" />
      <DateField source="startedAt" label="startedAt" />
      <DateField source="completedAt" label="completedAt" />
      <TextField source="contractor" label="contractor" />
      <NumberField source="engineHoursAtRepair" label="engineHoursAtRepair" />
      <TextField source="description" label="description" />
      <TextField source="notes" label="notes" />
    </Datagrid>
  </List>
);
