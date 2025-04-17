import { createUser, getUser, updateUser, deleteUser } from "../user.js";
import { test, expect, describe, beforeAll, afterAll } from "vitest";
import bcrypt from "bcrypt";

import prisma from "../../client.js";

describe("INTEGRATION TEST FOR USER MODEL", async () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  test("createUser() should create a user in the database", async () => {
    const input = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
      password: "junkfoodlover123",
    };
    const output = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
    };

    const user = await createUser(input);

    expect(user.name).toEqual(output.name);
    expect(user.email).toEqual(output.email);
    expect(bcrypt.compareSync(input.password, user.password)).toBe(true);
  });

  test("getUser() should get a user form the database that matches the fields", async () => {
    await createUser({
      name: "Seth Lowell",
      email: "sethlowell@pubsec.net",
      password: "justiceispeak",
    });

    const input = {
      email: "sethlowell@pubsec.net",
    };
    const output = {
      name: "Seth Lowell",
      email: "sethlowell@pubsec.net",
    };

    const user = await getUser(input);

    expect(user.name).toEqual(output.name);
    expect(user.email).toEqual(output.email);
    expect(bcrypt.compareSync("justiceispeak", user.password)).toBe(true);
  });

  test("deleteUser() should throw an error when deleting a non-existent user", async () => {
    const input = {
      email: "zhuyuan@pubsec.net",
    };

    const output = new Error("USER-DELETE_USER_DOES_NOT_EXIST");

    await expect(deleteUser(input)).resolves.toEqual(output);
  });
});
