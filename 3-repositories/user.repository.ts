import { UserEntity } from "../1-entities/user.entity.ts";

export type UserWithoutPassword = Omit<UserEntity, "password"> & { id: string };

export interface UserRepository {
  create: (data: UserEntity) => Promise<UserWithoutPassword>;
  findById: (id: string) => Promise<UserWithoutPassword | null>;
  findByEmail: (email: string) => Promise<UserWithoutPassword | null>;
  findByIdentifier: (identifier: string) => Promise<UserWithoutPassword | null>;
  update: (id: string, data: Partial<UserEntity>) => Promise<UserWithoutPassword>;
  delete: (id: string) => Promise<void>;
}
