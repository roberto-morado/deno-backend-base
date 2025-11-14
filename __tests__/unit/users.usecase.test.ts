import { assertSpyCalls, stub } from "@std/testing/mock";
import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import { UserEntity } from "../../1-entities/user.entity.ts";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUserByIdentifier,
  updateUser,
} from "../../4-use-cases/user.usecase.ts";
import { initializeUnitTestsContext } from "../../contexts/unit-tests.context.ts";
import { context } from "../../utils/context.ts";
import { ValidationError } from "@dest/errors/validation.error.ts";
import { GenericTestRepository } from "../_stubs/repository.stub.ts";

Deno.test("Users Unit - createUser usecase", async (t) => {
  const validData: UserEntity = {
    firstName: "John",
    lastName: "Doe",
    identifier: "12345678",
    email: "johndoe@example.com",
    password: "mysecretpassword",
    role: "user",
  };

  await t.step(
    "should throw error when repository does not exist",
    async () => {
      const error = await assertRejects(
        async () => await createUser(validData),
      );

      assertInstanceOf(error, Error);
      assertEquals(error.message, "Identifier user-repository not bound");
    },
  );

  initializeUnitTestsContext(context);

  await t.step("should create a user with valid data", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "create",
      GenericTestRepository.create,
    );
    const createdUser = await createUser(validData);

    assertSpyCalls(userRepositoryStub, 1);
    assertEquals(Object.hasOwn(createdUser, "id"), true);
    assertEquals(Object.hasOwn(createdUser, "password"), false);
    assertEquals(createdUser.firstName, validData.firstName);
    assertEquals(createdUser.lastName, validData.lastName);
    assertEquals(createdUser.identifier, validData.identifier);
    assertEquals(createdUser.email, validData.email);
  });

  await t.step("should throw an error when user data is invalid", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "create",
      () => ({} as UserEntity),
    );
    const error = await assertRejects(
      async () =>
        await createUser({
          ...validData,
          firstName: null,
        } as unknown as UserEntity),
    );

    assertSpyCalls(userRepositoryStub, 0);
    assertInstanceOf(error, ValidationError);
  });
});

Deno.test("Users Unit - getUserById usecase", async (t) => {
  initializeUnitTestsContext(context);

  await t.step("should get user by ID", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "findById",
      GenericTestRepository.findById,
    );
    const user = await getUserById("test-user-id");

    assertSpyCalls(userRepositoryStub, 1);
    assertEquals(user.id, "test-user-id");
    assertEquals(Object.hasOwn(user, "password"), false);
  });

  await t.step("should throw error when user not found", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "findById",
      () => Promise.resolve(null),
    );
    const error = await assertRejects(
      async () => await getUserById("non-existent-id"),
    );

    assertSpyCalls(userRepositoryStub, 1);
    assertInstanceOf(error, Error);
    assertEquals(error.message, "User not found");
  });
});

Deno.test("Users Unit - getUserByEmail usecase", async (t) => {
  initializeUnitTestsContext(context);

  await t.step("should get user by email", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "findByEmail",
      GenericTestRepository.findByEmail,
    );
    const user = await getUserByEmail("test@example.com");

    assertSpyCalls(userRepositoryStub, 1);
    assertEquals(user.email, "test@example.com");
    assertEquals(Object.hasOwn(user, "password"), false);
  });

  await t.step("should throw error when user not found", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "findByEmail",
      () => Promise.resolve(null),
    );
    const error = await assertRejects(
      async () => await getUserByEmail("notfound@example.com"),
    );

    assertSpyCalls(userRepositoryStub, 1);
    assertInstanceOf(error, Error);
    assertEquals(error.message, "User not found");
  });
});

Deno.test("Users Unit - getUserByIdentifier usecase", async (t) => {
  initializeUnitTestsContext(context);

  await t.step("should get user by identifier", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "findByIdentifier",
      GenericTestRepository.findByIdentifier,
    );
    const user = await getUserByIdentifier("test-identifier");

    assertSpyCalls(userRepositoryStub, 1);
    assertEquals(user.identifier, "test-identifier");
    assertEquals(Object.hasOwn(user, "password"), false);
  });

  await t.step("should throw error when user not found", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "findByIdentifier",
      () => Promise.resolve(null),
    );
    const error = await assertRejects(
      async () => await getUserByIdentifier("non-existent"),
    );

    assertSpyCalls(userRepositoryStub, 1);
    assertInstanceOf(error, Error);
    assertEquals(error.message, "User not found");
  });
});

Deno.test("Users Unit - updateUser usecase", async (t) => {
  initializeUnitTestsContext(context);

  await t.step("should update user", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "update",
      GenericTestRepository.update,
    );
    const updatedUser = await updateUser("test-user-id", {
      firstName: "Updated",
    });

    assertSpyCalls(userRepositoryStub, 1);
    assertEquals(updatedUser.id, "test-user-id");
    assertEquals(Object.hasOwn(updatedUser, "password"), false);
  });

  await t.step("should throw error when no data provided", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "update",
      GenericTestRepository.update,
    );
    const error = await assertRejects(
      async () => await updateUser("test-user-id", {}),
    );

    assertSpyCalls(userRepositoryStub, 0);
    assertInstanceOf(error, Error);
    assertEquals(error.message, "No data provided for update");
  });
});

Deno.test("Users Unit - deleteUser usecase", async (t) => {
  initializeUnitTestsContext(context);

  await t.step("should delete user", async () => {
    using userRepositoryStub = stub(
      GenericTestRepository,
      "delete",
      GenericTestRepository.delete,
    );
    await deleteUser("test-user-id");

    assertSpyCalls(userRepositoryStub, 1);
  });
});
