import { assertEquals, assertExists } from "@std/assert";
import { context } from "../../utils/context.ts";
import { initializeE2EContext } from "../../contexts/e2e.context.ts";
import { UserEntity } from "../../1-entities/user.entity.ts";
import { createTestServer } from "../create-test-server.ts";

const testServer = createTestServer();
await initializeE2EContext(context);

// TODO: reuse generic e2e tests
Deno.test("Users E2E", async (t) => {
  const userMock = {
    email: "test@test.com",
    firstName: "Testerson",
    lastName: "Testhonson",
    identifier: "123",
    password: "testing123#",
  } as UserEntity;

  await t.step("should return error 400 when no body is passed", async () => {
    const response = await testServer.request("/user", {
      method: "POST",
    });
    const responseBody = await response.json();

    assertEquals(response.status, 400);
    assertEquals(responseBody, {
      message: "Invalid body",
    });
  });

  await t.step(
    "should return error 400 when wrong body is passed",
    async () => {
      const response = await testServer.request("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userMock,
          identifier: undefined,
          email: null,
        }),
      });
      const responseBody = await response.json();

      assertEquals(response.status, 400);
      assertEquals(responseBody, {
        message: "Validation Error",
        cause: [
          {
            path: "email",
            message: "Expected string, received null",
          },
          {
            path: "identifier",
            message: "Required",
          },
        ],
      });
    },
  );

  await t.step("should return error 400 when using invalid email", async () => {
    const response = await testServer.request("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        email: "invalid_email.com",
      }),
    });
    const responseBody = await response.json();

    assertEquals(response.status, 400);
    assertEquals(responseBody, {
      message: "Validation Error",
      cause: [{ path: "email", message: "Invalid email" }],
    });
  });

  await t.step("should return user info when everything is ok", async () => {
    const response = await testServer.request("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMock),
    });
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assertExists(responseBody.id);
    assertEquals(responseBody.password, undefined);
    assertEquals(responseBody.email, userMock.email);
    assertEquals(responseBody.firstName, userMock.firstName);
    assertEquals(responseBody.lastName, userMock.lastName);
    assertEquals(responseBody.identifier, userMock.identifier);
  });

  await t.step(
    "should return error 400 when using existant email",
    async () => {
      const response = await testServer.request("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMock),
      });
      const responseBody = await response.json();

      assertEquals(response.status, 400);
      assertEquals(responseBody, { message: "Bad Request" });
    },
  );

  await t.step(
    "should return error 400 when using existant identifier",
    async () => {
      const response = await testServer.request("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userMock, email: "another@test.com" }),
      });
      const responseBody = await response.json();

      assertEquals(response.status, 400);
      assertEquals(responseBody, { message: "Bad Request" });
    },
  );

  await t.step("should return error 400 when using weak password", async () => {
    const response = await testServer.request("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        password: "weakpassword",
      }),
    });
    const responseBody = await response.json();

    assertEquals(response.status, 400);
    assertEquals(responseBody, { message: "Bad Request" });
  });

  let createdUserId: string;

  await t.step("should get user by ID", async () => {
    const createResponse = await testServer.request("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        email: "getbyid@test.com",
        identifier: "id-123",
      }),
    });
    const createdUser = await createResponse.json();
    createdUserId = createdUser.id;

    const response = await testServer.request(`/user/${createdUserId}`, {
      method: "GET",
    });
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assertEquals(responseBody.id, createdUserId);
    assertEquals(responseBody.email, "getbyid@test.com");
    assertEquals(responseBody.password, undefined);
  });

  await t.step("should get user by email", async () => {
    const response = await testServer.request(
      "/user?email=getbyid@test.com",
      {
        method: "GET",
      },
    );
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assertEquals(responseBody.email, "getbyid@test.com");
    assertEquals(responseBody.identifier, "id-123");
    assertEquals(responseBody.password, undefined);
  });

  await t.step("should get user by identifier", async () => {
    const response = await testServer.request(
      "/user-by-identifier?identifier=id-123",
      {
        method: "GET",
      },
    );
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assertEquals(responseBody.identifier, "id-123");
    assertEquals(responseBody.email, "getbyid@test.com");
    assertEquals(responseBody.password, undefined);
  });

  await t.step("should return error 400 when user not found by ID", async () => {
    const response = await testServer.request("/user/non-existent-id", {
      method: "GET",
    });
    const responseBody = await response.json();

    assertEquals(response.status, 400);
    assertEquals(responseBody, { message: "Bad Request" });
  });

  await t.step("should update user", async () => {
    const response = await testServer.request(`/user/${createdUserId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: "UpdatedName",
        lastName: "UpdatedLastName",
      }),
    });
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assertEquals(responseBody.firstName, "UpdatedName");
    assertEquals(responseBody.lastName, "UpdatedLastName");
    assertEquals(responseBody.email, "getbyid@test.com");
    assertEquals(responseBody.password, undefined);
  });

  await t.step("should update user email", async () => {
    const response = await testServer.request(`/user/${createdUserId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "newemail@test.com",
      }),
    });
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assertEquals(responseBody.email, "newemail@test.com");

    const getUserResponse = await testServer.request(
      "/user?email=newemail@test.com",
      {
        method: "GET",
      },
    );
    const getUserBody = await getUserResponse.json();

    assertEquals(getUserResponse.status, 200);
    assertEquals(getUserBody.id, createdUserId);
  });

  await t.step(
    "should return error when updating with duplicate email",
    async () => {
      const response = await testServer.request(`/user/${createdUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
        }),
      });
      const responseBody = await response.json();

      assertEquals(response.status, 400);
      assertEquals(responseBody, { message: "Bad Request" });
    },
  );

  await t.step("should delete user", async () => {
    const deleteResponse = await testServer.request(`/user/${createdUserId}`, {
      method: "DELETE",
    });
    const deleteBody = await deleteResponse.json();

    assertEquals(deleteResponse.status, 200);
    assertEquals(deleteBody.message, "User deleted successfully");

    const getUserResponse = await testServer.request(`/user/${createdUserId}`, {
      method: "GET",
    });
    const getUserBody = await getUserResponse.json();

    assertEquals(getUserResponse.status, 400);
    assertEquals(getUserBody, { message: "Bad Request" });
  });

  await t.step("should return error when deleting non-existent user", async () => {
    const response = await testServer.request("/user/non-existent-id", {
      method: "DELETE",
    });
    const responseBody = await response.json();

    assertEquals(response.status, 400);
    assertEquals(responseBody, { message: "Bad Request" });
  });

  const kvClient = context.get("kv-client") as Deno.Kv;
  kvClient.close();
});
