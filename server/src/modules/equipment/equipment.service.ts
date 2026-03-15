import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

function serializeRecord(record: any) {
  return {
    ...record,
    totalEngineHours: record.totalEngineHours?.toString() ?? null,
    engineHoursSinceLastRepair: record.engineHoursSinceLastRepair?.toString() ?? null,
    commissionedAt: record.commissionedAt?.toISOString() ?? null,
    lastRepairAt: record.lastRepairAt?.toISOString() ?? null,
  };
}

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { _start?: string; _end?: string; _sort?: string; _order?: string; [key: string]: any }) {
    const start = parseInt(query._start) || 0;
    const end = parseInt(query._end) || 10;
    const take = end - start;
    const skip = start;
    const sortField = query._sort || 'id';
    const sortOrder = (query._order || 'ASC').toLowerCase() as 'asc' | 'desc';

    const where: any = {};
    if (query.inventoryNumber) where.inventoryNumber = { contains: query.inventoryNumber, mode: 'insensitive' };
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' };
    if (query.equipmentTypeCode) where.equipmentTypeCode = query.equipmentTypeCode;
    if (query.status) where.status = query.status;
    if (query.location) where.location = { contains: query.location, mode: 'insensitive' };
    if (query.id) {
      const ids = Array.isArray(query.id) ? query.id : [query.id];
      where.id = { in: ids };
    }

    const [data, total] = await Promise.all([
      this.prisma.equipment.findMany({
        where,
        skip,
        take,
        orderBy: { [sortField]: sortOrder },
      }),
      this.prisma.equipment.count({ where }),
    ]);

    return {
      data: data.map(serializeRecord),
      total,
    };
  }

  async findOne(id: string) {
    const record = await this.prisma.equipment.findUniqueOrThrow({ where: { id } });
    return serializeRecord(record);
  }

  async create(dto: CreateEquipmentDto) {
    const data: any = { ...dto };
    if (dto.commissionedAt) data.commissionedAt = new Date(dto.commissionedAt);
    if (dto.lastRepairAt) data.lastRepairAt = new Date(dto.lastRepairAt);
    if (dto.totalEngineHours) data.totalEngineHours = new Prisma.Decimal(dto.totalEngineHours);
    if (dto.engineHoursSinceLastRepair) data.engineHoursSinceLastRepair = new Prisma.Decimal(dto.engineHoursSinceLastRepair);

    const record = await this.prisma.equipment.create({ data });
    return serializeRecord(record);
  }

  async update(id: string, dto: UpdateEquipmentDto) {
    const { id: _pk, ...rest } = dto as any;
    const data: any = { ...rest };
    if (data.commissionedAt) data.commissionedAt = new Date(data.commissionedAt);
    if (data.lastRepairAt) data.lastRepairAt = new Date(data.lastRepairAt);
    if (data.totalEngineHours !== undefined && data.totalEngineHours !== null) data.totalEngineHours = new Prisma.Decimal(data.totalEngineHours);
    if (data.engineHoursSinceLastRepair !== undefined && data.engineHoursSinceLastRepair !== null) data.engineHoursSinceLastRepair = new Prisma.Decimal(data.engineHoursSinceLastRepair);

    const record = await this.prisma.equipment.update({ where: { id }, data });
    return serializeRecord(record);
  }

  async remove(id: string) {
    const record = await this.prisma.equipment.delete({ where: { id } });
    return serializeRecord(record);
  }
}
