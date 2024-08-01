"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

type MappedFormValues = {
  title: string;
  status: "TODO" | "INPROGRESS" | "UNDERREVIEW" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "URGENT";
  deadline: Date;
  description?: string;
};

export default async function createTask(
  values: MappedFormValues,
  userId: string
) {
  const title = values.title;
  const status = values.status;
  const priority = values.priority;
  const deadline = values.deadline;
  const description = values.description;

  console.log("about to create a task");

  try {
    const task = await prisma.task.create({
      data: {
        title,
        status,
        priority,
        deadline: deadline,
        description,
        userId,
      },
    });
    revalidatePath("/tasks");
    console.log("Task created successfully:", task);
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
}
