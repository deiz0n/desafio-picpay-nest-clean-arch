import { Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { desc, eq } from 'drizzle-orm';
import { userModel, userSchema } from '../user.model';
import { UserMapper } from '../mappers/user-mapper';
import { UserResponse } from '../../core/user-response';
import { User } from '../../core/user.entity';
import { UserType } from '../user.model';

export interface IUserRepository {
  save(user: User): Promise<UserResponse>;
  findByEmail(email: string): Promise<UserResponse | null>;
  findWithPasswordByEmail(email: string): Promise<UserType | null>;
  findByCpf(cpf: string): Promise<UserResponse | null>;
  findByCnpj(cnpj: string): Promise<UserResponse | null>;
  findById(id: string): Promise<UserResponse | null>;
  findAll(page?: number, pageSize?: number): Promise<UserResponse[]>;
  update(userId: string, user: User): Promise<UserResponse>;
}

export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: PostgresJsDatabase<typeof userSchema>,
  ) {}

  async save(userEntity: User): Promise<UserResponse> {
    const user = UserMapper.toInsert(userEntity);

    const [result] = await this.db.insert(userModel).values(user).returning();

    return UserMapper.toResponse(result);
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const [result] = await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email));

    return result ? UserMapper.toResponse(result) : null;
  }

  async findWithPasswordByEmail(email: string): Promise<UserType | null> {
    const [result] = await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email));

    return result || null;
  }

  async findByCpf(cpf: string): Promise<UserResponse | null> {
    const [result] = await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.cpf, cpf));

    return result ? UserMapper.toResponse(result) : null;
  }

  async findByCnpj(cnpj: string): Promise<UserResponse | null> {
    const [result] = await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.cnpj, cnpj));

    return result ? UserMapper.toResponse(result) : null;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const [result] = await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.id, id));

    return result ? UserMapper.toResponse(result) : null;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<UserResponse[]> {
    const offset = (page - 1) * pageSize;

    const result = await this.db
      .select()
      .from(userModel)
      .orderBy(desc(userModel.createdAt))
      .limit(pageSize)
      .offset(offset);

    return result.map((user) => UserMapper.toResponse(user));
  }

  async update(userId: string, user: User): Promise<UserResponse> {
    const updateData = UserMapper.toInsert(user);

    const [result] = await this.db
      .update(userModel)
      .set(updateData)
      .where(eq(userModel.id, userId))
      .returning();

    return UserMapper.toResponse(result);
  }
}
