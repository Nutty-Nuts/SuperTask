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
    return new Error("USER-CREATE_INCOMPLETE_FIELDS");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  user = { ...user, password: hashedPassword };

  return await prisma.user.create({
    data: user,
  });
}

/**
 * Get a user.
 * @param {{id: String, name: String email: String}} fields - object containing information about a user.
 */
export async function getUser(fields) {
  const hasUniqueFields =
    fields.hasOwnProperty("id") || fields.hasOwnProperty("email");

  if (!hasUniqueFields) {
    return new Error("USER-READ_NO_UNIQUE_FIELDS_PROVIDED");
  }

  return await prisma.user.findUnique({
    where: fields,
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
    return new Error("USER-UPDATE_ATTEMPT_TO_UPDATE_ID");
  }

  if (data.hasOwnProperty("email")) {
    const instance = await prisma.user.findUnique({ where: data.email });

    if (instance !== null) {
      return new Error("USER-UPDATE_PROVIDED_NON_UNIQUE_EMAIL");
    }
  }

  return await prisma.user.update({
    where: fields,
    data: data,
  });
}

/**
 * Get a user.
 * @param {{id: String, name: String email: String}} fields - object containing information about a user.
 */
export async function deleteUser(fields) {
  try {
    return await prisma.user.delete({
      where: fields,
    });
  } catch (error) {
    return new Error("USER-DELETE_USER_DOES_NOT_EXIST");
  }
}
