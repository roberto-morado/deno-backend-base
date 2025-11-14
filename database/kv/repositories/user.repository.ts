import { context } from "@utils/context.ts";
import { UserEntity } from "../../../1-entities/user.entity.ts";
import { UserRepository } from "../../../3-repositories/user.repository.ts";

type StoredUser = UserEntity & { id: string };

const USER_KEY_PREFIX = "users";
const USER_BY_EMAIL_PREFIX = "users_by_email";
const USER_BY_IDENTIFIER_PREFIX = "users_by_identifier";

async function createUser(
  userData: UserEntity,
): Promise<Omit<UserEntity, "password"> & { id: string }> {
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

  const { password: _, ...userWithoutPassword } = userToStore;
  return userWithoutPassword;
}

export const UserKvRepository: UserRepository = {
  create: createUser,
};
