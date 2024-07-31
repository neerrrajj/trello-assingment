"use client";

import { redirect } from "next/navigation";

import prisma from "@/lib/db";
import { Task, User } from "@prisma/client";
import { validateRequest } from "@/lib/validate-request";
import TasksContainer from "@/components/tasks-container";
import Sidebar from "@/components/sidebar";
import Title from "@/components/title";
import { use, useEffect, useState } from "react";
import getTasks from "@/actions/getTasks";

export default function TasksPage() {
  // const { user } = await validateRequest();
  // if (!user) {
  //   console.log("no user session found");
  //   return redirect("/login");
  // }

  // let tasks: Task[] = [];

  // try {
  //   tasks = await prisma.task.findMany({
  //     where: {
  //       userId: user.id,
  //     },
  //   });
  // } catch (error) {
  //   console.error("Error fetching tasks:", error);
  //   throw new Error("Failed to fetch tasks");
  // } finally {
  //   await prisma.$disconnect();
  // }

  // let user: User;
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[] | []>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { user, tasks } = await getTasks();
      setUser(user);
      setTasks(tasks);
    };
    fetchTasks();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex">
      <Sidebar user={user} />
      <div className="flex flex-col w-full px-8 py-4 gap-y-4 ">
        <Title user={user} />
        {/* Carousel */}
        <TasksContainer userId={user.id} tasks={tasks} />
      </div>
    </main>
  );
}
