"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type MappedFormValues = {
  title: string;
  status: "TODO" | "INPROGRESS" | "UNDERREVIEW" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "URGENT";
  deadline: Date;
  description?: string;
};

export default async function updateTask(
  taskId: string,
  values: MappedFormValues
) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: values,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }

  revalidatePath("/tasks");
}
