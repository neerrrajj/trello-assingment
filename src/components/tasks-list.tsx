"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { formatDistanceToNow } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import { TbMenuDeep } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import TaskSheetContent from "./tasksheet-content";
import { useTaskContextProvider } from "@/contexts/task-context";

type TaskListProps = {
  label: "To-do" | "In Progress" | "Under Review" | "Completed";
  tasks: Task[];
};

function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = formatDistanceToNow(date, { addSuffix: true });
  return formattedDate.startsWith("about")
    ? formattedDate.replace("about ", "")
    : formattedDate;
}

export default function TasksList({ label, tasks }: TaskListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { isLoading } = useTaskContextProvider();

  return (
    <div className="flex flex-col gap-y-4 w-full h-[calc(100vh-180px)] ">
      <div className="flex w-full items-center justify-between text-[#555555]">
        <h1>{label}</h1>
        <TbMenuDeep size={20} />
      </div>
      {isLoading ? (
        <TaskSkeleton />
      ) : (
        <div className="flex flex-col gap-y-2 overflow-y-auto ">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {tasks.map((task, index) => {
              return (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="h-full"
                    >
                      <SheetTrigger asChild key={task.id}>
                        <div
                          onClick={() => {
                            setSelectedTask(task);
                            setIsOpen(true);
                          }}
                          className="bg-[#f9f9f9] border border-[#dedede] rounded-lg p-[14px] flex flex-col gap-y-3 
                          hover:cursor-pointer hover:bg-zinc-200 duration-300 ease-in"
                        >
                          <div>
                            <h2 className="font-medium text-[#606060] mb-1">
                              {task.title}
                            </h2>
                            <p className="text-[14px] text-[#797979]">
                              {truncateText(task.description || "", 50)}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "rounded-lg w-fit px-2 py-[6px] text-white flex items-center",
                              {
                                "bg-[#FF6B6B]": task.priority === "URGENT",
                                "bg-[#FFA235]": task.priority === "MEDIUM",
                                "bg-[#0ECC5A]": task.priority === "LOW",
                              }
                            )}
                          >
                            <span className="text-xs">
                              {task.priority?.toLowerCase()}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-x-2 text-[#606060]">
                            <MdAccessTime />
                            <p className="font-semibold text-[14px]">
                              {formatDate(task.deadline.toString())}
                            </p>
                          </div>
                          <p className="text-[#797979] text-[14px] font-medium">
                            {formatRelativeTime(task.updatedAt.toString())}
                          </p>
                        </div>
                      </SheetTrigger>
                      <TaskSheetContent
                        task={selectedTask}
                        setIsOpen={setIsOpen}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
          </Sheet>
          <TasksListAdd label={label} />
        </div>
      )}
    </div>
  );
}

type TaskListAddProps = {
  label: "To-do" | "In Progress" | "Under Review" | "Completed";
};

function TasksListAdd({ label }: TaskListAddProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex justify-between items-center w-full bg-gradient-to-b from-[#3A3A3A] to-[#202020] hover:to-[#3A3A3A] text-[#E3E1E1] font-normal p-2"
        >
          <p>Add new</p>
          <IoMdAdd />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <TaskSheetContent setIsOpen={setIsOpen} defaultStatus={label} />
      </SheetContent>
    </Sheet>
  );
}

function TaskSkeleton() {
  return <div className="bg-neutral-200 w-full h-40 rounded-lg"></div>;
}
