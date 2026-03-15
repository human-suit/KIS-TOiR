// ─────────────────────────────────────────────
//  DTO: Вид оборудования (EquipmentType)
// ─────────────────────────────────────────────

dto DTO.EquipmentType {
  description "Вид оборудования — полный объект ответа";

  attribute code {
    type string;
    description "Код вида оборудования";
    map EquipmentType.code;
  }

  attribute name {
    type string;
    description "Наименование вида";
    map EquipmentType.name;
  }

  attribute manufacturer {
    type string;
    description "Производитель";
    is nullable;
    map EquipmentType.manufacturer;
  }

  attribute maintenanceIntervalHours {
    type integer;
    description "Периодичность ТО, моточасов";
    is nullable;
    map EquipmentType.maintenanceIntervalHours;
  }

  attribute overhaulIntervalHours {
    type integer;
    description "Периодичность КР, моточасов";
    is nullable;
    map EquipmentType.overhaulIntervalHours;
  }
}

dto DTO.EquipmentTypeCreate {
  description "Вид оборудования — тело запроса на создание";

  attribute code {
    type string;
    description "Код вида оборудования";
    is required;
    map EquipmentType.code;
  }

  attribute name {
    type string;
    description "Наименование вида";
    is required;
    map EquipmentType.name;
  }

  attribute manufacturer {
    type string;
    description "Производитель";
    is nullable;
    map EquipmentType.manufacturer;
  }

  attribute maintenanceIntervalHours {
    type integer;
    description "Периодичность ТО, моточасов";
    is nullable;
    map EquipmentType.maintenanceIntervalHours;
  }

  attribute overhaulIntervalHours {
    type integer;
    description "Периодичность КР, моточасов";
    is nullable;
    map EquipmentType.overhaulIntervalHours;
  }
}

dto DTO.EquipmentTypeUpdate {
  description "Вид оборудования — тело запроса на обновление (частичное)";

  attribute code {
    type string;
    description "Код вида оборудования";
    is nullable;
    map EquipmentType.code;
  }

  attribute name {
    type string;
    description "Наименование вида";
    is nullable;
    map EquipmentType.name;
  }

  attribute manufacturer {
    type string;
    description "Производитель";
    is nullable;
    map EquipmentType.manufacturer;
  }

  attribute maintenanceIntervalHours {
    type integer;
    description "Периодичность ТО, моточасов";
    is nullable;
    map EquipmentType.maintenanceIntervalHours;
  }

  attribute overhaulIntervalHours {
    type integer;
    description "Периодичность КР, моточасов";
    is nullable;
    map EquipmentType.overhaulIntervalHours;
  }
}

dto DTO.EquipmentTypeListResponse {
  description "Список видов оборудования (формат React Admin)";

  attribute data {
    type DTO.EquipmentType[];
  }

  attribute total {
    type integer;
  }
}

// ─────────────────────────────────────────────
//  DTO: Оборудование (Equipment)
// ─────────────────────────────────────────────

dto DTO.Equipment {
  description "Единица оборудования — полный объект ответа";

  attribute id {
    type uuid;
    map Equipment.id;
  }

  attribute inventoryNumber {
    type string;
    description "Инвентарный номер";
    map Equipment.inventoryNumber;
  }

  attribute serialNumber {
    type string;
    description "Заводской (серийный) номер";
    is nullable;
    map Equipment.serialNumber;
  }

  attribute name {
    type string;
    description "Наименование единицы оборудования";
    map Equipment.name;
  }

  attribute equipmentTypeCode {
    type string;
    description "Код вида оборудования";
    map Equipment.equipmentTypeCode;
  }

  attribute status {
    type EquipmentStatus;
    description "Текущий статус";
    map Equipment.status;
  }

  attribute location {
    type string;
    description "Место эксплуатации / скважина / куст";
    is nullable;
    map Equipment.location;
  }

  attribute commissionedAt {
    type date;
    description "Дата ввода в эксплуатацию";
    is nullable;
    map Equipment.commissionedAt;
  }

  attribute totalEngineHours {
    type decimal;
    description "Общая наработка, моточасов";
    is nullable;
    map Equipment.totalEngineHours;
  }

  attribute engineHoursSinceLastRepair {
    type decimal;
    description "Наработка с последнего ремонта, моточасов";
    is nullable;
    map Equipment.engineHoursSinceLastRepair;
  }

  attribute lastRepairAt {
    type date;
    description "Дата последнего ремонта";
    is nullable;
    map Equipment.lastRepairAt;
  }

  attribute notes {
    type text;
    description "Примечания";
    is nullable;
    map Equipment.notes;
  }
}

dto DTO.EquipmentCreate {
  description "Единица оборудования — тело запроса на создание";

  attribute inventoryNumber {
    type string;
    description "Инвентарный номер";
    is required;
    map Equipment.inventoryNumber;
  }

  attribute serialNumber {
    type string;
    description "Заводской (серийный) номер";
    is nullable;
    map Equipment.serialNumber;
  }

  attribute name {
    type string;
    description "Наименование единицы оборудования";
    is required;
    map Equipment.name;
  }

  attribute equipmentTypeCode {
    type string;
    description "Код вида оборудования";
    is required;
    map Equipment.equipmentTypeCode;
  }

  attribute status {
    type EquipmentStatus;
    description "Текущий статус";
    is nullable;
    map Equipment.status;
  }

  attribute location {
    type string;
    description "Место эксплуатации / скважина / куст";
    is nullable;
    map Equipment.location;
  }

  attribute commissionedAt {
    type date;
    description "Дата ввода в эксплуатацию";
    is nullable;
    map Equipment.commissionedAt;
  }

  attribute totalEngineHours {
    type decimal;
    description "Общая наработка, моточасов";
    is nullable;
    map Equipment.totalEngineHours;
  }

  attribute engineHoursSinceLastRepair {
    type decimal;
    description "Наработка с последнего ремонта, моточасов";
    is nullable;
    map Equipment.engineHoursSinceLastRepair;
  }

  attribute lastRepairAt {
    type date;
    description "Дата последнего ремонта";
    is nullable;
    map Equipment.lastRepairAt;
  }

  attribute notes {
    type text;
    description "Примечания";
    is nullable;
    map Equipment.notes;
  }
}

dto DTO.EquipmentUpdate {
  description "Единица оборудования — тело запроса на обновление (частичное)";

  attribute inventoryNumber {
    type string;
    description "Инвентарный номер";
    is nullable;
    map Equipment.inventoryNumber;
  }

  attribute serialNumber {
    type string;
    description "Заводской (серийный) номер";
    is nullable;
    map Equipment.serialNumber;
  }

  attribute name {
    type string;
    description "Наименование единицы оборудования";
    is nullable;
    map Equipment.name;
  }

  attribute equipmentTypeCode {
    type string;
    description "Код вида оборудования";
    is nullable;
    map Equipment.equipmentTypeCode;
  }

  attribute status {
    type EquipmentStatus;
    description "Текущий статус";
    is nullable;
    map Equipment.status;
  }

  attribute location {
    type string;
    description "Место эксплуатации / скважина / куст";
    is nullable;
    map Equipment.location;
  }

  attribute commissionedAt {
    type date;
    description "Дата ввода в эксплуатацию";
    is nullable;
    map Equipment.commissionedAt;
  }

  attribute totalEngineHours {
    type decimal;
    description "Общая наработка, моточасов";
    is nullable;
    map Equipment.totalEngineHours;
  }

  attribute engineHoursSinceLastRepair {
    type decimal;
    description "Наработка с последнего ремонта, моточасов";
    is nullable;
    map Equipment.engineHoursSinceLastRepair;
  }

  attribute lastRepairAt {
    type date;
    description "Дата последнего ремонта";
    is nullable;
    map Equipment.lastRepairAt;
  }

  attribute notes {
    type text;
    description "Примечания";
    is nullable;
    map Equipment.notes;
  }
}

dto DTO.EquipmentListResponse {
  description "Список оборудования (формат React Admin)";

  attribute data {
    type DTO.Equipment[];
  }

  attribute total {
    type integer;
  }
}

// ─────────────────────────────────────────────
//  DTO: Заявка на ремонт (RepairOrder)
// ─────────────────────────────────────────────

dto DTO.RepairOrder {
  description "Заявка на ремонт — полный объект ответа";

  attribute id {
    type uuid;
    map RepairOrder.id;
  }

  attribute number {
    type string;
    description "Номер заявки";
    map RepairOrder.number;
  }

  attribute equipmentId {
    type uuid;
    description "Идентификатор единицы оборудования";
    map RepairOrder.equipmentId;
  }

  attribute repairKind {
    type RepairKind;
    description "Вид ремонта";
    map RepairOrder.repairKind;
  }

  attribute status {
    type RepairOrderStatus;
    description "Статус заявки";
    map RepairOrder.status;
  }

  attribute plannedAt {
    type date;
    description "Плановая дата начала";
    map RepairOrder.plannedAt;
  }

  attribute startedAt {
    type date;
    description "Фактическая дата начала";
    is nullable;
    map RepairOrder.startedAt;
  }

  attribute completedAt {
    type date;
    description "Фактическая дата завершения";
    is nullable;
    map RepairOrder.completedAt;
  }

  attribute contractor {
    type string;
    description "Подрядная организация (если внешний ремонт)";
    is nullable;
    map RepairOrder.contractor;
  }

  attribute engineHoursAtRepair {
    type decimal;
    description "Наработка на момент ремонта, моточасов";
    is nullable;
    map RepairOrder.engineHoursAtRepair;
  }

  attribute description {
    type text;
    description "Описание работ / дефекта";
    is nullable;
    map RepairOrder.description;
  }

  attribute notes {
    type text;
    description "Примечания";
    is nullable;
    map RepairOrder.notes;
  }
}

dto DTO.RepairOrderCreate {
  description "Заявка на ремонт — тело запроса на создание";

  attribute number {
    type string;
    description "Номер заявки";
    is required;
    map RepairOrder.number;
  }

  attribute equipmentId {
    type uuid;
    description "Идентификатор единицы оборудования";
    is required;
    map RepairOrder.equipmentId;
  }

  attribute repairKind {
    type RepairKind;
    description "Вид ремонта";
    is required;
    map RepairOrder.repairKind;
  }

  attribute status {
    type RepairOrderStatus;
    description "Статус заявки";
    is nullable;
    map RepairOrder.status;
  }

  attribute plannedAt {
    type date;
    description "Плановая дата начала";
    is required;
    map RepairOrder.plannedAt;
  }

  attribute startedAt {
    type date;
    description "Фактическая дата начала";
    is nullable;
    map RepairOrder.startedAt;
  }

  attribute completedAt {
    type date;
    description "Фактическая дата завершения";
    is nullable;
    map RepairOrder.completedAt;
  }

  attribute contractor {
    type string;
    description "Подрядная организация (если внешний ремонт)";
    is nullable;
    map RepairOrder.contractor;
  }

  attribute engineHoursAtRepair {
    type decimal;
    description "Наработка на момент ремонта, моточасов";
    is nullable;
    map RepairOrder.engineHoursAtRepair;
  }

  attribute description {
    type text;
    description "Описание работ / дефекта";
    is nullable;
    map RepairOrder.description;
  }

  attribute notes {
    type text;
    description "Примечания";
    is nullable;
    map RepairOrder.notes;
  }
}

dto DTO.RepairOrderUpdate {
  description "Заявка на ремонт — тело запроса на обновление (частичное)";

  attribute number {
    type string;
    description "Номер заявки";
    is nullable;
    map RepairOrder.number;
  }

  attribute equipmentId {
    type uuid;
    description "Идентификатор единицы оборудования";
    is nullable;
    map RepairOrder.equipmentId;
  }

  attribute repairKind {
    type RepairKind;
    description "Вид ремонта";
    is nullable;
    map RepairOrder.repairKind;
  }

  attribute status {
    type RepairOrderStatus;
    description "Статус заявки";
    is nullable;
    map RepairOrder.status;
  }

  attribute plannedAt {
    type date;
    description "Плановая дата начала";
    is nullable;
    map RepairOrder.plannedAt;
  }

  attribute startedAt {
    type date;
    description "Фактическая дата начала";
    is nullable;
    map RepairOrder.startedAt;
  }

  attribute completedAt {
    type date;
    description "Фактическая дата завершения";
    is nullable;
    map RepairOrder.completedAt;
  }

  attribute contractor {
    type string;
    description "Подрядная организация (если внешний ремонт)";
    is nullable;
    map RepairOrder.contractor;
  }

  attribute engineHoursAtRepair {
    type decimal;
    description "Наработка на момент ремонта, моточасов";
    is nullable;
    map RepairOrder.engineHoursAtRepair;
  }

  attribute description {
    type text;
    description "Описание работ / дефекта";
    is nullable;
    map RepairOrder.description;
  }

  attribute notes {
    type text;
    description "Примечания";
    is nullable;
    map RepairOrder.notes;
  }
}

dto DTO.RepairOrderListResponse {
  description "Список заявок на ремонт (формат React Admin)";

  attribute data {
    type DTO.RepairOrder[];
  }

  attribute total {
    type integer;
  }
}

// ─────────────────────────────────────────────
//  API: Виды оборудования
// ─────────────────────────────────────────────

api API.EquipmentTypes {
  description "API управления справочником видов оборудования";

  endpoint listEquipmentTypes {
    label "GET /equipment-types";
    description "Список видов оборудования (фильтры и пагинация — query-параметры)";
    attribute response {
      type DTO.EquipmentTypeListResponse;
    }
  }

  endpoint getEquipmentType {
    label "GET /equipment-types/{code}";
    description "Получить вид оборудования по коду";
    attribute code {
      type string;
    }
    attribute response {
      type DTO.EquipmentType;
    }
  }

  endpoint createEquipmentType {
    label "POST /equipment-types";
    description "Создать вид оборудования";
    attribute request {
      type DTO.EquipmentTypeCreate;
    }
  }

  endpoint updateEquipmentType {
    label "PATCH /equipment-types/{code}";
    description "Обновить вид оборудования";
    attribute code {
      type string;
    }
    attribute request {
      type DTO.EquipmentTypeUpdate;
    }
  }

  endpoint deleteEquipmentType {
    label "DELETE /equipment-types/{code}";
    description "Удалить вид оборудования";
    attribute code {
      type string;
    }
  }
}

// ─────────────────────────────────────────────
//  API: Оборудование
// ─────────────────────────────────────────────

api API.Equipment {
  description "API управления оборудованием";

  endpoint listEquipment {
    label "GET /equipment";
    description "Список оборудования (фильтры и пагинация — query-параметры)";
    attribute response {
      type DTO.EquipmentListResponse;
    }
  }

  endpoint getEquipment {
    label "GET /equipment/{id}";
    description "Получить единицу оборудования по идентификатору";
    attribute id {
      type uuid;
    }
    attribute response {
      type DTO.Equipment;
    }
  }

  endpoint createEquipment {
    label "POST /equipment";
    description "Создать единицу оборудования";
    attribute request {
      type DTO.EquipmentCreate;
    }
  }

  endpoint updateEquipment {
    label "PATCH /equipment/{id}";
    description "Обновить единицу оборудования";
    attribute id {
      type uuid;
    }
    attribute request {
      type DTO.EquipmentUpdate;
    }
  }

  endpoint deleteEquipment {
    label "DELETE /equipment/{id}";
    description "Удалить единицу оборудования";
    attribute id {
      type uuid;
    }
  }
}

// ─────────────────────────────────────────────
//  API: Заявки на ремонт
// ─────────────────────────────────────────────

api API.RepairOrders {
  description "API управления заявками на ремонт";

  endpoint listRepairOrders {
    label "GET /repair-orders";
    description "Список заявок на ремонт (фильтры и пагинация — query-параметры)";
    attribute response {
      type DTO.RepairOrderListResponse;
    }
  }

  endpoint getRepairOrder {
    label "GET /repair-orders/{id}";
    description "Получить заявку на ремонт по идентификатору";
    attribute id {
      type uuid;
    }
    attribute response {
      type DTO.RepairOrder;
    }
  }

  endpoint createRepairOrder {
    label "POST /repair-orders";
    description "Создать заявку на ремонт";
    attribute request {
      type DTO.RepairOrderCreate;
    }
  }

  endpoint updateRepairOrder {
    label "PATCH /repair-orders/{id}";
    description "Обновить заявку на ремонт";
    attribute id {
      type uuid;
    }
    attribute request {
      type DTO.RepairOrderUpdate;
    }
  }

  endpoint deleteRepairOrder {
    label "DELETE /repair-orders/{id}";
    description "Удалить заявку на ремонт";
    attribute id {
      type uuid;
    }
  }
}