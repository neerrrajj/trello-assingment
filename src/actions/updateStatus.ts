"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type Status = "TODO" | "INPROGRESS" | "UNDERREVIEW" | "COMPLETED";

export default async function updateStatus(taskId: string, newStatus: Status) {
  try {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: newStatus,
      },
    });
  } catch (error) {
    console.error("Error updating status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/tasks");
}
