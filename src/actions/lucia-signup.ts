"use server";

import { ObjectId } from "mongodb";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

import { userSchema } from "@/lib/formSchemas";

export async function signup(values: z.infer<typeof userSchema>) {
  const { username, email, password } = values;

  try {
    if (
      typeof username !== "string" ||
      username.length < 4 ||
      username.length > 31 ||
      !/^[a-zA-Z0-9_-]+$/.test(username)
    ) {
      console.error("Invalid username");
      return { error: "Invalid username" };
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      console.error("Invalid password");
      return { error: "Invalid password" };
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      console.error("User already exists");
      return { error: "Email already used" };
    }

    const userId = new ObjectId().toString();
    await prisma.user.create({
      data: {
        id: userId,
        email,
        username,
        password_hash: passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    console.log("User and session created successfully");
    return { success: true };
  } catch (error) {
    console.error("Error during signup:", error);
    return { error: "An error occurred during signup" };
  }
}
