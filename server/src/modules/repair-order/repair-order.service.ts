import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';

function serializeRecord(record: any) {
  return {
    ...record,
    engineHoursAtRepair: record.engineHoursAtRepair?.toString() ?? null,
    plannedAt: record.plannedAt?.toISOString() ?? null,
    startedAt: record.startedAt?.toISOString() ?? null,
    completedAt: record.completedAt?.toISOString() ?? null,
  };
}

@Injectable()
export class RepairOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { _start?: string; _end?: string; _sort?: string; _order?: string; [key: string]: any }) {
    const start = parseInt(query._start) || 0;
    const end = parseInt(query._end) || 10;
    const take = end - start;
    const skip = start;
    const sortField = query._sort || 'id';
    const sortOrder = (query._order || 'ASC').toLowerCase() as 'asc' | 'desc';

    const where: any = {};
    if (query.number) where.number = { contains: query.number, mode: 'insensitive' };
    if (query.equipmentId) where.equipmentId = query.equipmentId;
    if (query.repairKind) where.repairKind = query.repairKind;
    if (query.status) where.status = query.status;
    if (query.contractor) where.contractor = { contains: query.contractor, mode: 'insensitive' };
    if (query.id) {
      const ids = Array.isArray(query.id) ? query.id : [query.id];
      where.id = { in: ids };
    }

    const [data, total] = await Promise.all([
      this.prisma.repairOrder.findMany({
        where,
        skip,
        take,
        orderBy: { [sortField]: sortOrder },
      }),
      this.prisma.repairOrder.count({ where }),
    ]);

    return {
      data: data.map(serializeRecord),
      total,
    };
  }

  async findOne(id: string) {
    const record = await this.prisma.repairOrder.findUniqueOrThrow({ where: { id } });
    return serializeRecord(record);
  }

  async create(dto: CreateRepairOrderDto) {
    const data: any = { ...dto };
    if (dto.plannedAt) data.plannedAt = new Date(dto.plannedAt);
    if (dto.startedAt) data.startedAt = new Date(dto.startedAt);
    if (dto.completedAt) data.completedAt = new Date(dto.completedAt);
    if (dto.engineHoursAtRepair) data.engineHoursAtRepair = new Prisma.Decimal(dto.engineHoursAtRepair);

    const record = await this.prisma.repairOrder.create({ data });
    return serializeRecord(record);
  }

  async update(id: string, dto: UpdateRepairOrderDto) {
    const { id: _pk, ...rest } = dto as any;
    const data: any = { ...rest };
    if (data.plannedAt) data.plannedAt = new Date(data.plannedAt);
    if (data.startedAt) data.startedAt = new Date(data.startedAt);
    if (data.completedAt) data.completedAt = new Date(data.completedAt);
    if (data.engineHoursAtRepair !== undefined && data.engineHoursAtRepair !== null) data.engineHoursAtRepair = new Prisma.Decimal(data.engineHoursAtRepair);

    const record = await this.prisma.repairOrder.update({ where: { id }, data });
    return serializeRecord(record);
  }

  async remove(id: string) {
    const record = await this.prisma.repairOrder.delete({ where: { id } });
    return serializeRecord(record);
  }
}
