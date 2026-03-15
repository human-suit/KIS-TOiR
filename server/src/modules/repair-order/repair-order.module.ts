import { Module } from '@nestjs/common';
import { RepairOrderController } from './repair-order.controller';
import { RepairOrderService } from './repair-order.service';

@Module({
  controllers: [RepairOrderController],
  providers: [RepairOrderService],
})
export class RepairOrderModule {}
