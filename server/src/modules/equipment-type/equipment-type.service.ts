import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEquipmentTypeDto } from './dto/create-equipment-type.dto';
import { UpdateEquipmentTypeDto } from './dto/update-equipment-type.dto';

@Injectable()
export class EquipmentTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    _start?: string;
    _end?: string;
    _sort?: string;
    _order?: string;
    [key: string]: any;
  }) {
    const start = parseInt(query._start) || 0;
    const end = parseInt(query._end) || 10;
    const take = end - start;
    const skip = start;
    const sortField = 'code';
    const sortOrder = (query._order || 'ASC').toLowerCase() as 'asc' | 'desc';

    const where: any = {};
    if (query.code) where.code = { contains: query.code, mode: 'insensitive' };
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' };
    if (query.manufacturer)
      where.manufacturer = {
        contains: query.manufacturer,
        mode: 'insensitive',
      };
    if (query.id) {
      const ids = Array.isArray(query.id) ? query.id : [query.id];
      where.code = { in: ids };
    }

    const [data, total] = await Promise.all([
      this.prisma.equipmentType.findMany({
        where,
        skip,
        take,
        orderBy: { [sortField]: sortOrder },
      }),
      this.prisma.equipmentType.count({ where }),
    ]);

    return {
      data: data.map((item) => ({ id: item.code, ...item })),
      total,
    };
  }

  async findOne(code: string) {
    const record = await this.prisma.equipmentType.findUniqueOrThrow({
      where: { code },
    });
    return { id: record.code, ...record };
  }

  async create(dto: CreateEquipmentTypeDto) {
    const record = await this.prisma.equipmentType.create({ data: dto });
    return { id: record.code, ...record };
  }

  async update(code: string, dto: UpdateEquipmentTypeDto) {
    const { id, code: _pk, ...data } = dto as any;
    const record = await this.prisma.equipmentType.update({
      where: { code },
      data,
    });
    return { id: record.code, ...record };
  }

  async remove(code: string) {
    const record = await this.prisma.equipmentType.delete({ where: { code } });
    return { id: record.code, ...record };
  }
}
