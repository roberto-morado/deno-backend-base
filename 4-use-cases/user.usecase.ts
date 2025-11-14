import { context } from "../utils/context.ts";
import { UserEntity } from "../1-entities/user.entity.ts";
import { validateZodSchema } from "../2-validations/mod.ts";
import { UserSchema } from "../2-validations/user.validations.ts";
import { UserRepository } from "../3-repositories/user.repository.ts";
import { hashPassword } from "../utils/password.ts";

export async function createUser(data: UserEntity) {
  const userRepository = context.get("user-repository") as UserRepository;
  const newUser = validateZodSchema(data, UserSchema);

  // Hash password before storing
  const hashedPassword = await hashPassword(newUser.password);
  const userWithHashedPassword = { ...newUser, password: hashedPassword };

  const createdUser = await userRepository.create(userWithHashedPassword);

  if (!createdUser) {
    throw new Error("Error creating user");
  }

  return createdUser;
}

export async function getUserById(userId: string) {
  const userRepository = context.get("user-repository") as UserRepository;
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getUserByEmail(email: string) {
  const userRepository = context.get("user-repository") as UserRepository;
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getUserByIdentifier(identifier: string) {
  const userRepository = context.get("user-repository") as UserRepository;
  const user = await userRepository.findByIdentifier(identifier);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUser(userId: string, data: Partial<UserEntity>) {
  const userRepository = context.get("user-repository") as UserRepository;

  if (Object.keys(data).length === 0) {
    throw new Error("No data provided for update");
  }

  // Hash password if it's being updated
  let updateData = data;
  if (data.password) {
    const hashedPassword = await hashPassword(data.password);
    updateData = { ...data, password: hashedPassword };
  }

  const updatedUser = await userRepository.update(userId, updateData);

  return updatedUser;
}

export async function deleteUser(userId: string) {
  const userRepository = context.get("user-repository") as UserRepository;
  await userRepository.delete(userId);
}
