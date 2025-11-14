export type UserRole = "admin" | "user";

export interface UserEntity {
  firstName: string;
  lastName: string;
  identifier: string;
  email: string;
  password: string;
  role: UserRole;
}
