import prisma from "../client";
import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Create a user.
 * @param {{name: String, email: String, password: String}} user - object containing information about a user.
 */
export async function createUser(user) {
  const isComplete =
    user.hasOwnProperty("name") &&
    user.hasOwnProperty("email") &&
    user.hasOwnProperty("password");

  if (!isComplete) {
    return new Error("USER_INCOMPLETE_FIELDS");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  user = { ...user, password: hashedPassword };

  return await prisma.user.create({
    data: user,
  });
}

/**
 * Update a user.
 * @param {{id: String, email: String}} fields - object containing information about a user.
 * @param {{name: String, email: String, password: String}} data - object containing information about a user.
 */
export async function updateUser(fields, data) {
  if (data.hasOwnProperty("password")) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    data = { ...data, password: hashedPassword };
  }

  if (data.hasOwnProperty("id")) {
    return new Error("USER_ATTEMPT_TO_UPDATE_ID");
  }

  if (data.hasOwnProperty("email")) {
    const instance = await prisma.user.findUnique({ where: data.email });

    if (instance !== null) {
      return new Error("USER_UPDATE_EMAIL_TO_NON_UNIQUE_EMAIL");
    }
  }

  return await prisma.user.update({
    where: fields,
    data: data,
  });
}
