"use server";

import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/db";

export async function login(formData: FormData) {
  const password = formData.get("password");
  const email = formData.get("email") as string;

  try {
    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return {
        error: "Invalid password",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return {
        error: "Incorrect email or password",
      };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: "Incorrect email or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    console.log("Successful login!!!");
    return { success: true };
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "An error occurred during login" };
  }
}
