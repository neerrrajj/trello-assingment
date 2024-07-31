"use server";

import prisma from "@/lib/db";
import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function getTasks() {
  const { user } = await validateRequest();
  if (!user) {
    console.log("no user session found");
    return redirect("/login");
  }
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });
    return { user, tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  } finally {
    await prisma.$disconnect();
  }
}
