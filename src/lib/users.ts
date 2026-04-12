import { hashSync } from "bcryptjs";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// In-memory user store (resets on server restart)
const users: User[] = [];

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(name: string, email: string, password: string): User {
  const existing = getUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const user: User = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashSync(password, 10),
  };

  users.push(user);
  return user;
}
