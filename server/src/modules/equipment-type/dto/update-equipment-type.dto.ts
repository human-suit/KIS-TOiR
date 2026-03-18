export class UpdateEquipmentTypeDto {
  id?: string;
  code?: string | null;
  name?: string | null;
  manufacturer?: string | null;
  maintenanceIntervalHours?: number | null;
  overhaulIntervalHours?: number | null;
}
