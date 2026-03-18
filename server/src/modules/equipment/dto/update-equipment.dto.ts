export class UpdateEquipmentDto {
  id?: string | null;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  name?: string | null;
  equipmentTypeCode?: string | null;
  status?: string | null;
  location?: string | null;
  commissionedAt?: string | null;
  totalEngineHours?: string | null;
  engineHoursSinceLastRepair?: string | null;
  lastRepairAt?: string | null;
  notes?: string | null;
}
