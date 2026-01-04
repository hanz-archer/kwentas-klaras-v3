import type { Prisma, Obligation } from '@prisma/client';

export interface IObligationRepository {
  create(data: Prisma.ObligationCreateInput): Promise<Obligation>;
  findAll(): Promise<Obligation[]>;
  findById(id: string): Promise<Obligation | null>;
  findByProjectId(projectId: string): Promise<Obligation[]>;
  update(id: string, data: Prisma.ObligationUpdateInput): Promise<Obligation>;
}

