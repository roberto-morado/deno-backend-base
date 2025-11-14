import { context } from "@utils/context.ts";
import { UserEntity } from "../../../1-entities/user.entity.ts";
import {
  UserRepository,
  UserWithoutPassword,
} from "../../../3-repositories/user.repository.ts";

type StoredUser = UserEntity & { id: string };

const USER_KEY_PREFIX = "users";
const USER_BY_EMAIL_PREFIX = "users_by_email";
const USER_BY_IDENTIFIER_PREFIX = "users_by_identifier";

function excludePassword(user: StoredUser): UserWithoutPassword {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function createUser(userData: UserEntity): Promise<UserWithoutPassword> {
  const kvClient = context.get("kv-client") as Deno.Kv;
  const userId = crypto.randomUUID();

  const userToStore: StoredUser = {
    ...userData,
    id: userId,
  };

  const atomicOperation = kvClient
    .atomic()
    .check({ key: [USER_BY_EMAIL_PREFIX, userData.email], versionstamp: null })
    .check({
      key: [USER_BY_IDENTIFIER_PREFIX, userData.identifier],
      versionstamp: null,
    })
    .set([USER_KEY_PREFIX, userId], userToStore)
    .set([USER_BY_EMAIL_PREFIX, userData.email], userId)
    .set([USER_BY_IDENTIFIER_PREFIX, userData.identifier], userId);

  const commitResult = await atomicOperation.commit();

  if (!commitResult.ok) {
    throw new Error("User with this email or identifier already exists");
  }

  return excludePassword(userToStore);
}

async function findUserById(
  userId: string,
): Promise<UserWithoutPassword | null> {
  const kvClient = context.get("kv-client") as Deno.Kv;
  const userEntry = await kvClient.get<StoredUser>([USER_KEY_PREFIX, userId]);

  if (!userEntry.value) {
    return null;
  }

  return excludePassword(userEntry.value);
}

async function findUserByEmail(
  email: string,
): Promise<UserWithoutPassword | null> {
  const kvClient = context.get("kv-client") as Deno.Kv;
  const userIdEntry = await kvClient.get<string>([
    USER_BY_EMAIL_PREFIX,
    email,
  ]);

  if (!userIdEntry.value) {
    return null;
  }

  return await findUserById(userIdEntry.value);
}

async function findUserByIdentifier(
  identifier: string,
): Promise<UserWithoutPassword | null> {
  const kvClient = context.get("kv-client") as Deno.Kv;
  const userIdEntry = await kvClient.get<string>([
    USER_BY_IDENTIFIER_PREFIX,
    identifier,
  ]);

  if (!userIdEntry.value) {
    return null;
  }

  return await findUserById(userIdEntry.value);
}

async function updateUser(
  userId: string,
  updateData: Partial<UserEntity>,
): Promise<UserWithoutPassword> {
  const kvClient = context.get("kv-client") as Deno.Kv;
  const currentUserEntry = await kvClient.get<StoredUser>([
    USER_KEY_PREFIX,
    userId,
  ]);

  if (!currentUserEntry.value) {
    throw new Error("User not found");
  }

  const currentUser = currentUserEntry.value;
  const updatedUser: StoredUser = { ...currentUser, ...updateData, id: userId };

  const emailChanged = updateData.email && updateData.email !== currentUser.email;
  const identifierChanged = updateData.identifier &&
    updateData.identifier !== currentUser.identifier;

  const atomicOperation = kvClient.atomic();

  if (emailChanged) {
    atomicOperation
      .check({
        key: [USER_BY_EMAIL_PREFIX, updateData.email!],
        versionstamp: null,
      })
      .delete([USER_BY_EMAIL_PREFIX, currentUser.email])
      .set([USER_BY_EMAIL_PREFIX, updateData.email!], userId);
  }

  if (identifierChanged) {
    atomicOperation
      .check({
        key: [USER_BY_IDENTIFIER_PREFIX, updateData.identifier!],
        versionstamp: null,
      })
      .delete([USER_BY_IDENTIFIER_PREFIX, currentUser.identifier])
      .set([USER_BY_IDENTIFIER_PREFIX, updateData.identifier!], userId);
  }

  atomicOperation.set([USER_KEY_PREFIX, userId], updatedUser);

  const commitResult = await atomicOperation.commit();

  if (!commitResult.ok) {
    throw new Error("Update failed: email or identifier already exists");
  }

  return excludePassword(updatedUser);
}

async function deleteUser(userId: string): Promise<void> {
  const kvClient = context.get("kv-client") as Deno.Kv;
  const currentUserEntry = await kvClient.get<StoredUser>([
    USER_KEY_PREFIX,
    userId,
  ]);

  if (!currentUserEntry.value) {
    throw new Error("User not found");
  }

  const currentUser = currentUserEntry.value;

  const atomicOperation = kvClient
    .atomic()
    .delete([USER_KEY_PREFIX, userId])
    .delete([USER_BY_EMAIL_PREFIX, currentUser.email])
    .delete([USER_BY_IDENTIFIER_PREFIX, currentUser.identifier]);

  await atomicOperation.commit();
}

export const UserKvRepository: UserRepository = {
  create: createUser,
  findById: findUserById,
  findByEmail: findUserByEmail,
  findByIdentifier: findUserByIdentifier,
  update: updateUser,
  delete: deleteUser,
};
