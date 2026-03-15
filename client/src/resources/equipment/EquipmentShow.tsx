import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  SelectField,
  ReferenceField,
} from 'react-admin';

const statusChoices = [
  { id: 'Active', name: 'В эксплуатации' },
  { id: 'Repair', name: 'В ремонте' },
  { id: 'Reserve', name: 'В резерве' },
  { id: 'WriteOff', name: 'Списано' },
];

export const EquipmentShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="inventoryNumber" label="Инвентарный номер" />
      <TextField source="serialNumber" label="Заводской номер" />
      <TextField source="name" label="Наименование" />
      <ReferenceField source="equipmentTypeCode" reference="equipment-types" label="Вид оборудования" link="show">
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="status" label="Статус" choices={statusChoices} />
      <TextField source="location" label="Место эксплуатации" />
      <DateField source="commissionedAt" label="Дата ввода в эксплуатацию" />
      <NumberField source="totalEngineHours" label="Общая наработка (ч)" />
      <NumberField source="engineHoursSinceLastRepair" label="Наработка с последнего ремонта (ч)" />
      <DateField source="lastRepairAt" label="Дата последнего ремонта" />
      <TextField source="notes" label="Примечания" />
    </SimpleShowLayout>
  </Show>
);
