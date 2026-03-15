import {
  List,
  Datagrid,
  TextField,
  NumberField,
  SelectField,
  ReferenceField,
} from 'react-admin';

const statusChoices = [
  { id: 'Active', name: 'В эксплуатации' },
  { id: 'Repair', name: 'В ремонте' },
  { id: 'Reserve', name: 'В резерве' },
  { id: 'WriteOff', name: 'Списано' },
];

export const EquipmentList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="inventoryNumber" label="Инвентарный номер" />
      <TextField source="name" label="Наименование" />
      <ReferenceField source="equipmentTypeCode" reference="equipment-types" label="Вид оборудования" link="show">
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="status" label="Статус" choices={statusChoices} />
      <TextField source="location" label="Место эксплуатации" />
      <NumberField source="totalEngineHours" label="Наработка (ч)" />
    </Datagrid>
  </List>
);
