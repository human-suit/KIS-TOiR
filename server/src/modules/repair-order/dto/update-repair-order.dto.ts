export class UpdateRepairOrderDto {
  id?: string | null;
  number?: string | null;
  equipmentId?: string | null;
  repairKind?: string | null;
  status?: string | null;
  plannedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  contractor?: string | null;
  engineHoursAtRepair?: string | null;
  description?: string | null;
  notes?: string | null;
}
