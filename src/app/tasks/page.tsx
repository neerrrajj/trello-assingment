"use client";

import { useEffect, useState } from "react";
import { Task } from "@prisma/client";

import TasksContainer from "@/components/tasks-container";
import Sidebar from "@/components/sidebar";
import Title from "@/components/title";
import getTasks from "@/actions/getTasks";

export default function TasksPage() {
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
        <TasksContainer userId={user.id} tasks={tasks} />
      </div>
    </main>
  );
}
