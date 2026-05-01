import { UserInvalidException } from './errors/UserInvalidException';
import { UserRole } from './user-role.enum';

export class User {
  constructor(
    public fullName: string,
    public email: string,
    public password: string,
    public role: UserRole,
    public cpf?: string,
    public cnpj?: string,
  ) {
    if (this.role === UserRole.CUSTOMER && !this.cpf)
      throw new UserInvalidException(
        `CPF is required for users with role ${this.role}`,
      );

    if (this.role === UserRole.MERCHANT && !this.cnpj)
      throw new UserInvalidException(
        `CNPJ is required for users with role ${this.role}`,
      );
  }
}
