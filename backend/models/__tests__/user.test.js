import { createUser, getUser, updateUser, deleteUser } from "../user.js";
import { test, expect, describe } from "vitest";
import { prismaMock } from "../../singleton.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

describe("UNIT TEST SUITE FOR 'createUser()' FUNCTION", () => {
  test("createUser() should create a user if all fields are complete", async () => {
    const expectedInput = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
      password: "junkfoodlover123",
    };
    const expectedOuptut = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
      password: await bcrypt.hash("junkfoodlover123", saltRounds),
    };
    const mockedValue = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
      password: await bcrypt.hash("junkfoodlover123", saltRounds),
    };

    prismaMock.user.create.mockResolvedValue(mockedValue);

    await expect(createUser(expectedInput)).resolves.toEqual(expectedOuptut);
  });

  test("createUser() should throw an error if not all fields are complete", async () => {
    const expectedInput = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
      password: "junkfoodlover123",
    };
    const expectedOuptut = new Error("USER_INCOMPLETE_FIELDS");

    await expect(createUser(expectedInput)).resolves.toEqual(expectedOuptut);
  });
});
