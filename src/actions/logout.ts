"use server";

import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/validate-request";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  try {
    const { session } = await validateRequest();
    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "An error occurred during logout" };
  }
}
