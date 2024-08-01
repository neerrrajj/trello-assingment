"use server";

import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function checkUser() {
  const { user } = await validateRequest();
  return user;
}
