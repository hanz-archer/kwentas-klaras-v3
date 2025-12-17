import { prisma } from '../../lib/prisma';
import type { PrismaClient, Remark } from '@prisma/client';
import { IRemarkRepository } from '../../interfaces/repositories/IRemarkRepository';

export class RemarkRepository implements IRemarkRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Remark[]> {
    const remarks = await this.client.remark.findMany();
    return remarks.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Remark | null> {
    return this.client.remark.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Remark | null> {
    return this.client.remark.findUnique({ where: { name } });
  }
}
