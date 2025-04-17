import { createUser, getUser, updateUser, deleteUser } from "../user.js";
import { test, expect, describe } from "vitest";
import { prismaMock } from "../../singleton.js";
import bcrypt from "bcrypt";
import prisma from "../../client.js";

describe("UNIT TEST SUITE FOR 'createUser()' FUNCTION", () => {
  test("createUser() should create a user if all fields are complete", async () => {
    const input = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
      password: "junkfoodlover123",
    };

    const output = {
      name: "Jane Doe",
      email: "janedoe@pubsec.net",
    };

    prismaMock.user.create.mockImplementation((input) => input.data);

    const user = await createUser(input);

    expect(user.name).toEqual(output.name);
    expect(user.email).toEqual(output.email);
    expect(bcrypt.compareSync(input.password, user.password)).toBe(true);
  });

  test("createUser() should throw an error if not all fields are complete", async () => {
    const input = {
      email: "janedoe@pubsec.net",
      password: "junkfoodlover123",
    };
    const output = new Error("USER_INCOMPLETE_FIELDS");

    await expect(createUser(input)).resolves.toEqual(output);
  });
});

describe("UNIT TEST SUITE FOR 'updateUser()'", () => {
  test("updateUser() should change the password of the user to the hashed new password of the user", async () => {
    const input = {
      fields: {
        email: "janedoe@pubsec.net",
      },
      data: {
        password: "junkfoodisthebest",
      },
    };

    prismaMock.user.update.mockImplementation((input) => input.data);

    const user = await updateUser(input.fields, input.data);

    expect(await bcrypt.compare(input.data.password, user.password)).toBe(true);
  });

  test("updateUser() should change the name and email of the queried user", async () => {
    const input = {
      fields: {
        email: "janedoe@pubsec.net",
      },
      data: {
        name: "Janet Doe",
        email: "janedoe@neps.net",
      },
    };
    const output = {
      name: "Janet Doe",
      email: "janedoe@neps.net",
      password: "$2a$12$RPGGygitUTQ17PkKl8vYHuikzI9ZS9nqJgfsDRJINMJDvASw43X9e",
    };
    const mock = {
      name: "Janet Doe",
      email: "janedoe@neps.net",
      password: "$2a$12$RPGGygitUTQ17PkKl8vYHuikzI9ZS9nqJgfsDRJINMJDvASw43X9e",
    };

    prismaMock.user.update.mockResolvedValue(mock);
    prismaMock.user.findUnique.mockResolvedValue(null);

    const user = await updateUser(input.fields, input.data);

    expect(user).toEqual(output);
  });

  test("updateUser() should throw an error when attempting to change the id of the queried user", async () => {
    const input = {
      fields: {
        email: "janedoe@pubsec.net",
      },
      data: {
        id: "4d67a5d9-ef2b-4bf8-8fa2-00f7b914f78c",
      },
    };
    const output = new Error("USER_ATTEMPT_TO_UPDATE_ID");

    await expect(updateUser(input.fields, input.data)).resolves.toEqual(output);
  });

  test("updateUser() should throw an error when attempting to change email to a non unique email", async () => {
    const input = {
      fields: {
        email: "janedoe@pubsec.net",
      },
      data: {
        email: "sethlowell@pubsec.net",
      },
    };
    const output = new Error("USER_UPDATE_EMAIL_TO_NON_UNIQUE_EMAIL");
    const mock = {
      id: "971d14e0-7ba5-4980-a51b-dc8a6c0275bd",
      name: "Seth Lowell",
      email: "sethlowell@pubsec.net",
      password: "$2a$12$5jFoFH12tMYU8uz6RAkxlOkf1pE79CbzUocebO0/VEb2q9QYiV2c2",
    };

    prismaMock.user.findMany.mockResolvedValue(mock);

    await expect(updateUser(input.fields, input.data)).resolves.toEqual(output);
  });
});
