import { UserRole } from './user-role.enum';

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
