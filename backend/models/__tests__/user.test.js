import { createUser, getUser, updateUser, deleteUser } from "../user.js";
import { test, expect, describe } from "vitest";
import { prismaMock } from "../../singleton.js";
import bcrypt from "bcrypt";

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
    };

    prismaMock.user.create.mockImplementation((input) => input.data);

    const user = await createUser(expectedInput);

    expect(user.name).toEqual(expectedOuptut.name);
    expect(user.email).toEqual(expectedOuptut.email);
    expect(bcrypt.compareSync(expectedInput.password, user.password)).toBe(
      true,
    );
  });

  test("createUser() should throw an error if not all fields are complete", async () => {
    const expectedInput = {
      email: "janedoe@pubsec.net",
      password: "junkfoodlover123",
    };
    const expectedOuptut = new Error("USER_INCOMPLETE_FIELDS");

    await expect(createUser(expectedInput)).resolves.toEqual(expectedOuptut);
  });
});
