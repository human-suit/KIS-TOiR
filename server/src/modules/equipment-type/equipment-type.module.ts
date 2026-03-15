import { Module } from '@nestjs/common';
import { EquipmentTypeController } from './equipment-type.controller';
import { EquipmentTypeService } from './equipment-type.service';

@Module({
  controllers: [EquipmentTypeController],
  providers: [EquipmentTypeService],
})
export class EquipmentTypeModule {}
