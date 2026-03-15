import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  async findAll(@Query() query: any, @Res() res: Response) {
    const result = await this.equipmentService.findAll(query);
    res.set('Content-Range', `equipment ${query._start || 0}-${query._end || result.total}/${result.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    return res.json(result.data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
