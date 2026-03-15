import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const equipmentType = await prisma.equipmentType.upsert({
    where: { code: 'pump' },
    update: {},
    create: {
      code: 'pump',
      name: 'Насосный агрегат',
      manufacturer: 'АО НасосПром',
      maintenanceIntervalHours: 2000,
      overhaulIntervalHours: 16000,
    },
  });

  const equipmentType2 = await prisma.equipmentType.upsert({
    where: { code: 'compressor' },
    update: {},
    create: {
      code: 'compressor',
      name: 'Компрессорная установка',
      manufacturer: 'ОАО Компрессормаш',
      maintenanceIntervalHours: 1500,
      overhaulIntervalHours: 12000,
    },
  });

  const equipment = await prisma.equipment.upsert({
    where: { inventoryNumber: 'INV-001' },
    update: {},
    create: {
      inventoryNumber: 'INV-001',
      serialNumber: 'SN-2024-0001',
      name: 'Насос ЦНС 180-212',
      equipmentTypeCode: 'pump',
      status: 'Active',
      location: 'Куст №5, скважина 42',
      commissionedAt: new Date('2023-06-15'),
      totalEngineHours: 4500,
      engineHoursSinceLastRepair: 1200,
    },
  });

  const equipment2 = await prisma.equipment.upsert({
    where: { inventoryNumber: 'INV-002' },
    update: {},
    create: {
      inventoryNumber: 'INV-002',
      serialNumber: 'SN-2024-0002',
      name: 'Компрессор 4ВМ10-120/9',
      equipmentTypeCode: 'compressor',
      status: 'Active',
      location: 'ГКС-3',
      commissionedAt: new Date('2022-03-10'),
      totalEngineHours: 8200,
      engineHoursSinceLastRepair: 800,
    },
  });

  await prisma.repairOrder.upsert({
    where: { number: 'RO-2026-001' },
    update: {},
    create: {
      number: 'RO-2026-001',
      equipmentId: equipment.id,
      repairKind: 'TO',
      status: 'Approved',
      plannedAt: new Date('2026-04-01'),
      contractor: 'ООО СервисРемонт',
      engineHoursAtRepair: 4500,
      description: 'Плановое техническое обслуживание насосного агрегата',
    },
  });

  await prisma.repairOrder.upsert({
    where: { number: 'RO-2026-002' },
    update: {},
    create: {
      number: 'RO-2026-002',
      equipmentId: equipment2.id,
      repairKind: 'TR',
      status: 'Draft',
      plannedAt: new Date('2026-05-15'),
      description: 'Текущий ремонт компрессорной установки',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
