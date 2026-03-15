import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  ReferenceInput,
} from 'react-admin';

const statusChoices = [
  { id: 'Active', name: 'В эксплуатации' },
  { id: 'Repair', name: 'В ремонте' },
  { id: 'Reserve', name: 'В резерве' },
  { id: 'WriteOff', name: 'Списано' },
];

export const EquipmentEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="inventoryNumber" label="Инвентарный номер" isRequired />
      <TextInput source="serialNumber" label="Заводской номер" />
      <TextInput source="name" label="Наименование" isRequired />
      <ReferenceInput source="equipmentTypeCode" reference="equipment-types" label="Вид оборудования">
        <SelectInput optionText="name" optionValue="code" isRequired />
      </ReferenceInput>
      <SelectInput source="status" label="Статус" choices={statusChoices} />
      <TextInput source="location" label="Место эксплуатации" />
      <DateInput source="commissionedAt" label="Дата ввода в эксплуатацию" />
      <NumberInput source="totalEngineHours" label="Общая наработка (ч)" />
      <NumberInput source="engineHoursSinceLastRepair" label="Наработка с последнего ремонта (ч)" />
      <DateInput source="lastRepairAt" label="Дата последнего ремонта" />
      <TextInput source="notes" label="Примечания" multiline />
    </SimpleForm>
  </Edit>
);
