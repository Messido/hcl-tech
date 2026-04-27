import { hashSync } from "bcryptjs";
import { prisma } from "./prisma";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  return prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashSync(password, 10),
    },
  });
}
