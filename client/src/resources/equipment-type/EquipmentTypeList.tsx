import {
  List,
  Datagrid,
  TextField,
  TextInput,
  TopToolbar,
  FilterButton,
  CreateButton,
  ExportButton,
  NumberField
} from 'react-admin';


const equipmentTypeFilters = [
  <TextInput key="q" source="q" label="Поиск" alwaysOn />,
  <TextInput key="name" source="name" label="name" />,
  <TextInput key="manufacturer" source="manufacturer" label="manufacturer" />
];

const EquipmentTypeListActions = () => (
  <TopToolbar>
    <FilterButton filters={equipmentTypeFilters} />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const EquipmentTypeList = () => (
  <List actions={<EquipmentTypeListActions />} filters={equipmentTypeFilters} sort={{ field: 'code', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="code" label="code" />
      <TextField source="name" label="name" />
      <TextField source="manufacturer" label="manufacturer" />
      <NumberField source="maintenanceIntervalHours" label="maintenanceIntervalHours" />
      <NumberField source="overhaulIntervalHours" label="overhaulIntervalHours" />
    </Datagrid>
  </List>
);
