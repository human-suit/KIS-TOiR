import ./TOiR;

ui UI.Equipment {
  offset 600;
  
  description "Единица оборудования — объект ремонта и технического обслуживания";

  attribute Код {
    map Equipment.id;
  }

  attribute ИнвентарныйНомер {
    map Equipment.inventoryNumber;
  }

  attribute СерийныйНомер {
    map Equipment.serialNumber;
  }

  attribute Наименование {
    map Equipment.name;
  }

  // Связь с видом оборудования (справочник НСИ)
  attribute Тип {
    map Equipment.equipmentTypeCode;
  }

  attribute Статус {
    map Equipment.status;
    description "Текущий статус";
  }

  attribute МестоТекущее {
   map Equipment.location;
  }

  attribute ДатаВвода {
    map Equipment.commissionedAt;
  }

  attribute НаработкаВсего {
    map Equipment.totalEngineHours;
  }

  attribute НаработкаТекущая {
    map Equipment.engineHoursSinceLastRepair;
  }

  attribute Ремонт {
    map Equipment.lastRepairAt;
  }

  attribute Примечания {
    map Equipment.notes;
  }
}