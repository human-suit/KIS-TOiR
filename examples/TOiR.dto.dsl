/*
  КИС ТОиР — DTO
  Структуры данных для обмена через API
*/

//import ./TOiR;
//only external;

// ─────────────────────────────────────────────
//  Общие
// ─────────────────────────────────────────────

dto DTO.PageRequest {
  description "Параметры постраничной выдачи";

  attribute page {
    description "Номер страницы (начиная с 0)";
    type integer;
  }

  attribute size {
    description "Размер страницы";
    type integer;
  }
}

dto DTO.Filter {
  description "Элемент фильтра для запросов списка";
  attribute field { type string; }
  attribute operator { type string; }
  attribute value { type string; }
}

dto DTO.PageInfo {
  description "Метаданные постраничной выдачи";
  attribute size { type integer; }
  attribute number { type integer; }
  attribute totalElements { type integer; }
  attribute totalPages { type integer; }
}


// ─────────────────────────────────────────────
//  Вид оборудования (EquipmentType)
// ─────────────────────────────────────────────

dto DTO.EquipmentType {
  description "Вид оборудования — response";

  attribute code {
    type string;
    map EquipmentType.code;
  }

  attribute name {
    type string;
    map EquipmentType.name;
  }

  attribute manufacturer {
    type string;
    is nullable;
    map EquipmentType.manufacturer;
  }

  attribute maintenanceIntervalHours {
    type integer;
    is nullable;
    map EquipmentType.maintenanceIntervalHours;
  }

  attribute overhaulIntervalHours {
    type integer;
    is nullable;
    map EquipmentType.overhaulIntervalHours;
  }
}

dto DTO.EquipmentTypeFilter {
  description "Фильтры для списка видов оборудования";

  attribute code {
    description "Частичное совпадение по коду";
    type string;
    is nullable;
  }

  attribute name {
    description "Частичное совпадение по наименованию";
    type string;
    is nullable;
  }

  attribute manufacturer {
    description "Частичное совпадение по производителю";
    type string;
    is nullable;
  }
}

dto DTO.EquipmentTypeCreate {
  description "Тело запроса на создание вида оборудования";

  attribute code {
    description "Код вида оборудования";
    type string;
    is required;
  }

  attribute name {
    description "Наименование вида";
    type string;
    is required;
  }

  attribute manufacturer {
    description "Производитель";
    type string;
    is nullable;
  }

  attribute maintenanceIntervalHours {
    description "Периодичность ТО, моточасов";
    type integer;
    is nullable;
  }

  attribute overhaulIntervalHours {
    description "Периодичность КР, моточасов";
    type integer;
    is nullable;
  }
}

dto DTO.EquipmentTypeUpdate {
  description "Тело запроса на обновление вида оборудования";

  attribute name {
    description "Наименование вида";
    type string;
    is nullable;
  }

  attribute manufacturer {
    description "Производитель";
    type string;
    is nullable;
  }

  attribute maintenanceIntervalHours {
    description "Периодичность ТО, моточасов";
    type integer;
    is nullable;
  }

  attribute overhaulIntervalHours {
    description "Периодичность КР, моточасов";
    type integer;
    is nullable;
  }
}


// ─────────────────────────────────────────────
//  Оборудование (Equipment)
// ─────────────────────────────────────────────

dto DTO.EquipmentListItem {
  description "Строка списка оборудования";

  attribute id {
    type uuid;
    map Equipment.id;
  }

  attribute inventoryNumber {
    type string;
    map Equipment.inventoryNumber;
  }

  attribute name {
    type string;
    map Equipment.name;
  }

  attribute equipmentTypeCode {
    type string;
    map Equipment.equipmentTypeCode;
  }

  attribute status {
    type EquipmentStatus;
    map Equipment.status;
  }

  attribute location {
    type string;
    is nullable;
    map Equipment.location;
  }
}

dto DTO.EquipmentDetail {
  description "Полная информация об оборудовании";

  attribute id {
    type uuid;
    map Equipment.id;
  }

  attribute inventoryNumber {
    type string;
    map Equipment.inventoryNumber;
  }

  attribute serialNumber {
    type string;
    is nullable;
    map Equipment.serialNumber;
  }

  attribute name {
    type string;
    map Equipment.name;
  }

  attribute equipmentTypeCode {
    type string;
    map Equipment.equipmentTypeCode;
  }

  attribute status {
    type EquipmentStatus;
    map Equipment.status;
  }

  attribute location {
    type string;
    is nullable;
    map Equipment.location;
  }

  attribute commissionedAt {
    type date;
    is nullable;
    map Equipment.commissionedAt;
  }

  attribute totalEngineHours {
    type decimal;
    is nullable;
    map Equipment.totalEngineHours;
  }

  attribute engineHoursSinceLastRepair {
    type decimal;
    is nullable;
    map Equipment.engineHoursSinceLastRepair;
  }

  attribute lastRepairAt {
    type date;
    is nullable;
    map Equipment.lastRepairAt;
  }

  attribute notes {
    type text;
    is nullable;
    map Equipment.notes;
  }
}

dto DTO.EquipmentFilter {
  description "Фильтры для списка оборудования";

  attribute inventoryNumber {
    description "Частичное совпадение по инвентарному номеру";
    type string;
    is nullable;
  }

  attribute serialNumber {
    description "Частичное совпадение по заводскому номеру";
    type string;
    is nullable;
  }

  attribute name {
    description "Частичное совпадение по наименованию";
    type string;
    is nullable;
  }

  attribute equipmentTypeCode {
    description "Точное совпадение по коду вида оборудования";
    type string;
    is nullable;
  }

  attribute status {
    description "Фильтр по статусу";
    type EquipmentStatus;
    is nullable;
  }

  attribute location {
    description "Частичное совпадение по месту эксплуатации";
    type string;
    is nullable;
  }
}

dto DTO.EquipmentCreate {
  description "Тело запроса на создание оборудования";

  attribute inventoryNumber {
    description "Инвентарный номер";
    type string;
    is required;
  }

  attribute serialNumber {
    description "Заводской (серийный) номер";
    type string;
    is nullable;
  }

  attribute name {
    description "Наименование единицы оборудования";
    type string;
    is required;
  }

  attribute equipmentTypeCode {
    description "Код вида оборудования";
    type string;
    is required;
  }

  attribute status {
    description "Текущий статус";
    type EquipmentStatus;
    is nullable;
  }

  attribute location {
    description "Место эксплуатации / скважина / куст";
    type string;
    is nullable;
  }

  attribute commissionedAt {
    description "Дата ввода в эксплуатацию";
    type date;
    is nullable;
  }

  attribute totalEngineHours {
    description "Общая наработка, моточасов";
    type decimal;
    is nullable;
  }

  attribute engineHoursSinceLastRepair {
    description "Наработка с последнего ремонта, моточасов";
    type decimal;
    is nullable;
  }

  attribute lastRepairAt {
    description "Дата последнего ремонта";
    type date;
    is nullable;
  }

  attribute notes {
    description "Примечания";
    type text;
    is nullable;
  }
}

dto DTO.EquipmentUpdate {
  description "Тело запроса на обновление оборудования";

  attribute inventoryNumber {
    description "Инвентарный номер";
    type string;
    is nullable;
  }

  attribute serialNumber {
    description "Заводской (серийный) номер";
    type string;
    is nullable;
  }

  attribute name {
    description "Наименование единицы оборудования";
    type string;
    is nullable;
  }

  attribute equipmentTypeCode {
    description "Код вида оборудования";
    type string;
    is nullable;
  }

  attribute status {
    description "Текущий статус";
    type EquipmentStatus;
    is nullable;
  }

  attribute location {
    description "Место эксплуатации / скважина / куст";
    type string;
    is nullable;
  }

  attribute commissionedAt {
    description "Дата ввода в эксплуатацию";
    type date;
    is nullable;
  }

  attribute totalEngineHours {
    description "Общая наработка, моточасов";
    type decimal;
    is nullable;
  }

  attribute engineHoursSinceLastRepair {
    description "Наработка с последнего ремонта, моточасов";
    type decimal;
    is nullable;
  }

  attribute lastRepairAt {
    description "Дата последнего ремонта";
    type date;
    is nullable;
  }

  attribute notes {
    description "Примечания";
    type text;
    is nullable;
  }
}


// ─────────────────────────────────────────────
//  Заявка на ремонт (RepairOrder)
// ─────────────────────────────────────────────

dto DTO.RepairOrderListItem {
  description "Строка списка заявок на ремонт";

  attribute id {
    type uuid;
    map RepairOrder.id;
  }

  attribute number {
    type string;
    map RepairOrder.number;
  }

  attribute equipmentId {
    type uuid;
    map RepairOrder.equipmentId;
  }

  attribute repairKind {
    type RepairKind;
    map RepairOrder.repairKind;
  }

  attribute status {
    type RepairOrderStatus;
    map RepairOrder.status;
  }

  attribute plannedAt {
    type date;
    map RepairOrder.plannedAt;
  }

  attribute contractor {
    type string;
    is nullable;
    map RepairOrder.contractor;
  }
}

dto DTO.RepairOrderDetail {
  description "Полная информация о заявке на ремонт";

  attribute id {
    type uuid;
    map RepairOrder.id;
  }

  attribute number {
    type string;
    map RepairOrder.number;
  }

  attribute equipmentId {
    type uuid;
    map RepairOrder.equipmentId;
  }

  attribute repairKind {
    type RepairKind;
    map RepairOrder.repairKind;
  }

  attribute status {
    type RepairOrderStatus;
    map RepairOrder.status;
  }

  attribute plannedAt {
    type date;
    map RepairOrder.plannedAt;
  }

  attribute startedAt {
    type date;
    is nullable;
    map RepairOrder.startedAt;
  }

  attribute completedAt {
    type date;
    is nullable;
    map RepairOrder.completedAt;
  }

  attribute contractor {
    type string;
    is nullable;
    map RepairOrder.contractor;
  }

  attribute engineHoursAtRepair {
    type decimal;
    is nullable;
    map RepairOrder.engineHoursAtRepair;
  }

  attribute description {
    type text;
    is nullable;
    map RepairOrder.description;
  }

  attribute notes {
    type text;
    is nullable;
    map RepairOrder.notes;
  }
}

dto DTO.RepairOrderFilter {
  description "Фильтры для списка заявок на ремонт";

  attribute number {
    description "Частичное совпадение по номеру заявки";
    type string;
    is nullable;
  }

  attribute equipmentId {
    description "Точное совпадение по идентификатору оборудования";
    type uuid;
    is nullable;
  }

  attribute repairKind {
    description "Фильтр по виду ремонта";
    type RepairKind;
    is nullable;
  }

  attribute status {
    description "Фильтр по статусу заявки";
    type RepairOrderStatus;
    is nullable;
  }

  attribute plannedAtFrom {
    description "Плановая дата начала ОТ";
    type date;
    is nullable;
  }

  attribute plannedAtTo {
    description "Плановая дата начала ДО";
    type date;
    is nullable;
  }

  attribute contractor {
    description "Частичное совпадение по подрядчику";
    type string;
    is nullable;
  }
}

dto DTO.RepairOrderCreate {
  description "Тело запроса на создание заявки на ремонт";

  attribute number {
    description "Номер заявки";
    type string;
    is required;
  }

  attribute equipmentId {
    description "Идентификатор оборудования";
    type uuid;
    is required;
  }

  attribute repairKind {
    description "Вид ремонта";
    type RepairKind;
    is required;
  }

  attribute status {
    description "Статус заявки";
    type RepairOrderStatus;
    is nullable;
  }

  attribute plannedAt {
    description "Плановая дата начала";
    type date;
    is required;
  }

  attribute startedAt {
    description "Фактическая дата начала";
    type date;
    is nullable;
  }

  attribute completedAt {
    description "Фактическая дата завершения";
    type date;
    is nullable;
  }

  attribute contractor {
    description "Подрядная организация";
    type string;
    is nullable;
  }

  attribute engineHoursAtRepair {
    description "Наработка на момент ремонта, моточасов";
    type decimal;
    is nullable;
  }

  attribute description {
    description "Описание работ / дефекта";
    type text;
    is nullable;
  }

  attribute notes {
    description "Примечания";
    type text;
    is nullable;
  }
}

dto DTO.RepairOrderUpdate {
  description "Тело запроса на обновление заявки на ремонт";

  attribute number {
    description "Номер заявки";
    type string;
    is nullable;
  }

  attribute equipmentId {
    description "Идентификатор оборудования";
    type uuid;
    is nullable;
  }

  attribute repairKind {
    description "Вид ремонта";
    type RepairKind;
    is nullable;
  }

  attribute status {
    description "Статус заявки";
    type RepairOrderStatus;
    is nullable;
  }

  attribute plannedAt {
    description "Плановая дата начала";
    type date;
    is nullable;
  }

  attribute startedAt {
    description "Фактическая дата начала";
    type date;
    is nullable;
  }

  attribute completedAt {
    description "Фактическая дата завершения";
    type date;
    is nullable;
  }

  attribute contractor {
    description "Подрядная организация";
    type string;
    is nullable;
  }

  attribute engineHoursAtRepair {
    description "Наработка на момент ремонта, моточасов";
    type decimal;
    is nullable;
  }

  attribute description {
    description "Описание работ / дефекта";
    type text;
    is nullable;
  }

  attribute notes {
    description "Примечания";
    type text;
    is nullable;
  }
}
