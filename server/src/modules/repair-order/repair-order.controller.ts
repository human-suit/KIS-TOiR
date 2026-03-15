import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RepairOrderService } from './repair-order.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';

@Controller('repair-orders')
export class RepairOrderController {
  constructor(private readonly repairOrderService: RepairOrderService) {}

  @Get()
  async findAll(@Query() query: any, @Res() res: Response) {
    const result = await this.repairOrderService.findAll(query);
    res.set('Content-Range', `repair-orders ${query._start || 0}-${query._end || result.total}/${result.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    return res.json(result.data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairOrderService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRepairOrderDto) {
    return this.repairOrderService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRepairOrderDto) {
    return this.repairOrderService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairOrderService.remove(id);
  }
}
