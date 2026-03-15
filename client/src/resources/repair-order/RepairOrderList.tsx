import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  ReferenceField,
} from 'react-admin';

const repairKindChoices = [
  { id: 'TO', name: 'Техническое обслуживание' },
  { id: 'TR', name: 'Текущий ремонт' },
  { id: 'TRE', name: 'Текущий расширенный ремонт' },
  { id: 'KR', name: 'Капитальный ремонт' },
  { id: 'AR', name: 'Аварийный ремонт' },
  { id: 'MP', name: 'Метрологическая поверка' },
];

const statusChoices = [
  { id: 'Draft', name: 'Черновик' },
  { id: 'Approved', name: 'Утверждена' },
  { id: 'InWork', name: 'В работе' },
  { id: 'Done', name: 'Выполнена' },
  { id: 'Cancelled', name: 'Отменена' },
];

export const RepairOrderList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="number" label="Номер" />
      <ReferenceField source="equipmentId" reference="equipment" label="Оборудование" link="show">
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="repairKind" label="Вид ремонта" choices={repairKindChoices} />
      <SelectField source="status" label="Статус" choices={statusChoices} />
      <DateField source="plannedAt" label="Плановая дата" />
      <TextField source="contractor" label="Подрядчик" />
    </Datagrid>
  </List>
);
