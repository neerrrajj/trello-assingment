"use server";

import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function getUser() {
  const { user } = await validateRequest();
  if (!user) {
    console.error("invalid request");
    redirect("/login");
  }
  return user;
}
