import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  ReferenceInput,
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

export const RepairOrderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="number" label="Номер заявки" isRequired />
      <ReferenceInput source="equipmentId" reference="equipment" label="Оборудование">
        <SelectInput optionText="name" isRequired />
      </ReferenceInput>
      <SelectInput source="repairKind" label="Вид ремонта" choices={repairKindChoices} isRequired />
      <SelectInput source="status" label="Статус" choices={statusChoices} />
      <DateInput source="plannedAt" label="Плановая дата начала" isRequired />
      <DateInput source="startedAt" label="Фактическая дата начала" />
      <DateInput source="completedAt" label="Фактическая дата завершения" />
      <TextInput source="contractor" label="Подрядная организация" />
      <NumberInput source="engineHoursAtRepair" label="Наработка на момент ремонта (ч)" />
      <TextInput source="description" label="Описание работ / дефекта" multiline />
      <TextInput source="notes" label="Примечания" multiline />
    </SimpleForm>
  </Edit>
);
