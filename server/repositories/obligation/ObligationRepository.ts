import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, Obligation } from '@prisma/client';
import { IObligationRepository } from '../../interfaces/repositories/IObligationRepository';

export class ObligationRepository implements IObligationRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.ObligationCreateInput): Promise<Obligation> {
    return this.client.obligation.create({ data });
  }

  async findAll(): Promise<Obligation[]> {
    const obligations = await this.client.obligation.findMany();
    return obligations.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<Obligation | null> {
    return this.client.obligation.findUnique({ where: { id } });
  }

  async findByProjectId(projectId: string): Promise<Obligation[]> {
    const obligations = await this.client.obligation.findMany({
      where: { projectId },
    });
    return obligations.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async update(id: string, data: Prisma.ObligationUpdateInput): Promise<Obligation> {
    return this.client.obligation.update({
      where: { id },
      data,
    });
  }
}

