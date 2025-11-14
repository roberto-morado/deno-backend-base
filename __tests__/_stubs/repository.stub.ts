import { UserEntity } from "../../1-entities/user.entity.ts";
import {
  UserRepository,
  UserWithoutPassword,
} from "../../3-repositories/user.repository.ts";

function create(data: UserEntity): Promise<UserWithoutPassword> {
  const result = { ...data, id: "mock-user-id" };
  const { password: _, ...userWithoutPassword } = result;
  return Promise.resolve(userWithoutPassword);
}

function findById(id: string): Promise<UserWithoutPassword | null> {
  return Promise.resolve({
    id,
    email: "mock@test.com",
    firstName: "Mock",
    lastName: "User",
    identifier: "mock-123",
  });
}

function findByEmail(email: string): Promise<UserWithoutPassword | null> {
  return Promise.resolve({
    id: "mock-user-id",
    email,
    firstName: "Mock",
    lastName: "User",
    identifier: "mock-123",
  });
}

function findByIdentifier(
  identifier: string,
): Promise<UserWithoutPassword | null> {
  return Promise.resolve({
    id: "mock-user-id",
    email: "mock@test.com",
    firstName: "Mock",
    lastName: "User",
    identifier,
  });
}

function update(
  id: string,
  data: Partial<UserEntity>,
): Promise<UserWithoutPassword> {
  return Promise.resolve({
    id,
    email: data.email || "mock@test.com",
    firstName: data.firstName || "Mock",
    lastName: data.lastName || "User",
    identifier: data.identifier || "mock-123",
  });
}

function deleteUser(_id: string): Promise<void> {
  return Promise.resolve();
}

export const GenericTestRepository: UserRepository = {
  create,
  findById,
  findByEmail,
  findByIdentifier,
  update,
  delete: deleteUser,
};
