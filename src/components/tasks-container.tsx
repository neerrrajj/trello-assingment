"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FiCalendar, FiFilter, FiSearch, FiShare2 } from "react-icons/fi";
import { BiSolidPlusCircle } from "react-icons/bi";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import TasksList from "./tasks-list";
import updateStatus from "@/actions/updateStatus";
import TaskSheetContent from "./tasksheet-content";
import IconButton from "./icon-button";

export type TaskStatus = "TODO" | "INPROGRESS" | "UNDERREVIEW" | "COMPLETED";
type TaskLabel = "To-do" | "In Progress" | "Under Review" | "Completed";

export default function TasksContainer({
  userId,
  tasks,
}: {
  userId: string;
  tasks: Task[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const taskStatuses: TaskStatus[] = [
    "TODO",
    "INPROGRESS",
    "UNDERREVIEW",
    "COMPLETED",
  ];

  const initialTasksByStatus = taskStatuses.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const [tasksByStatus, setTasksByStatus] = useState(initialTasksByStatus);

  const headingMapping: Record<TaskStatus, TaskLabel> = {
    TODO: "To-do",
    INPROGRESS: "In Progress",
    UNDERREVIEW: "Under Review",
    COMPLETED: "Completed",
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = source.droppableId as TaskStatus;
    const destColumn = destination.droppableId as TaskStatus;

    if (sourceColumn !== destColumn) {
      const sourceTasks = Array.from(tasksByStatus[sourceColumn]);
      const destTasks = Array.from(tasksByStatus[destColumn]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.status = destColumn;
      destTasks.splice(destination.index, 0, movedTask);

      setTasksByStatus({
        ...tasksByStatus,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      });

      try {
        await updateStatus(movedTask.id, movedTask.status);
      } catch (e) {
        console.log("Cannot change status: ", e);
        sourceTasks.splice(source.index, 0, movedTask);
        destTasks.splice(destination.index, 1);

        setTasksByStatus({
          ...tasksByStatus,
          [sourceColumn]: sourceTasks,
          [destColumn]: destTasks,
        });
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasksByStatus = taskStatuses.reduce((acc, status) => {
    acc[status] = tasksByStatus[status].filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <div className="w-[196px] flex items-center gap-x-2 pr-3 text-[#797979] bg-white border border-[#E9E9E9] rounded-lg duration-300 ease-in-out">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-inherit text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
          />
          <FiSearch size={20} />
        </div>
        <div className="flex gap-x-4">
          <IconButton label="Calendar view" icon={<FiCalendar size={20} />} />
          <IconButton label="Automation" icon={<FiSearch size={20} />} />
          <IconButton label="Filter" icon={<FiFilter size={20} />} />
          <IconButton label="Share" icon={<FiShare2 size={20} />} />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="flex gap-x-2 items-center bg-gradient-to-b from-[#4c38c2] to-[#2f2188] text-white hover:from-[#4c38c2] hover:to-[#4c38c2] duration-300 ease-in-out"
              >
                <p>Create new</p>
                <BiSolidPlusCircle size={20} />
              </Button>
            </SheetTrigger>
            <TaskSheetContent userId={userId} setIsOpen={setIsOpen} />
          </Sheet>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex w-full items-start gap-x-4">
            {taskStatuses.map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-full h-full"
                  >
                    <TasksList
                      userId={userId}
                      label={headingMapping[status]}
                      tasks={filteredTasksByStatus[status]}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
