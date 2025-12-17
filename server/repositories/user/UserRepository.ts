import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.client.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    const users = await this.client.user.findMany();
    const validUsers = users.filter((user): user is User => 
      user.firebaseId !== null &&
      user.firstName !== null &&
      user.lastName !== null &&
      user.username !== null &&
      user.email !== null &&
      user.department !== null
    );
    return validUsers.sort((a, b) => {
      const aTime = a.createdAt?.getTime() ?? 0;
      const bTime = b.createdAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.client.user.findUnique({ where: { id } });
  }

  async updateById(id: string, update: Prisma.UserUpdateInput): Promise<User> {
    return this.client.user.update({ where: { id }, data: update });
  }

  async deleteById(id: string): Promise<User> {
    return this.client.user.delete({ where: { id } });
  }

  async findByFirebaseId(firebaseId: string): Promise<User | null> {
    return this.client.user.findUnique({ where: { firebaseId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.client.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.client.user.findUnique({ where: { username } });
  }

  async findAllIncludingNullFirebaseId(): Promise<User[]> {
    const users = await this.client.user.findMany();
    return users.sort((a, b) => {
      const aTime = a.createdAt?.getTime() ?? 0;
      const bTime = b.createdAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }
}

