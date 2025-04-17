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
