import { UserResponse } from '../../core/user-response';
import { User } from '../../core/user.entity';
import { UserType } from '../user.model';

export class UserMapper {
  static toInsert(user: User): UserType {
    return {
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      role: user.role,
      cpf: user.cpf,
      cnpj: user.cnpj,
      createdAt: null,
      updatedAt: null,
    };
  }

  static toResponse(type: UserType): UserResponse {
    return {
      id: type.id!,
      fullName: type.fullName,
      email: type.email,
      role: type.role!,
      createdAt: type.createdAt!,
      updatedAt: type.updatedAt!,
    };
  }
}
