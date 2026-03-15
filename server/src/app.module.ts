import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { EquipmentTypeModule } from './modules/equipment-type/equipment-type.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { RepairOrderModule } from './modules/repair-order/repair-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    EquipmentTypeModule,
    EquipmentModule,
    RepairOrderModule,
  ],
})
export class AppModule {}
