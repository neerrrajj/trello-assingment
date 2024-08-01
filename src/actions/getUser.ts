"use server";

import { validateRequest } from "@/lib/validate-request";

export default async function getUser() {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("invalid request");
  }
  return user;
}
