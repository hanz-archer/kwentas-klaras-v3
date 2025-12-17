import { prisma } from '../../lib/prisma';
import type { PrismaClient, Service } from '@prisma/client';
import { IServiceRepository } from '../../interfaces/repositories/IServiceRepository';

export class ServiceRepository implements IServiceRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Service[]> {
    const services = await this.client.service.findMany();
    return services.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Service | null> {
    return this.client.service.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Service | null> {
    return this.client.service.findUnique({ where: { name } });
  }
}
