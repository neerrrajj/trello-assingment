"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Task } from "@prisma/client";
import getTasks from "@/actions/getTasks";

type TaskContextProps = {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[] | []>>;
  isLoading: boolean;
};

const TaskContext = createContext<TaskContextProps | null>(null);

export default function TaskContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await getTasks();
        if (response) {
          setTasks(response.tasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContextProvider() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("");
  }
  return context;
}
