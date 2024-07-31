"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }

  revalidatePath("/tasks");
}
