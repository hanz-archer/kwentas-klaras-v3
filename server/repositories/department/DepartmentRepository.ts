import { prisma } from '../../lib/prisma';
import type { PrismaClient, Department } from '@prisma/client';
import { IDepartmentRepository } from '../../interfaces/repositories/IDepartmentRepository';

export class DepartmentRepository implements IDepartmentRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Department[]> {
    const departments = await this.client.department.findMany();
    return departments.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Department | null> {
    return this.client.department.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Department | null> {
    return this.client.department.findUnique({ where: { name } });
  }
}
