"use client";

import { SetStateAction } from "react";
import { Task } from "@prisma/client";
import { TfiArrowsCorner } from "react-icons/tfi";
import { MdClose } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { PiStar } from "react-icons/pi";

import { SheetClose, SheetContent } from "./ui/sheet";
import TaskSheetForm from "./tasksheet-form";
import IconButton from "./icon-button";

type TaskSheetContentProps = {
  userId: string;
  task?: Task | null;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  defaultStatus?: "To-do" | "In Progress" | "Under Review" | "Completed";
  onTaskClick?: (task: Task) => void;
};

export default function TaskSheetContent({
  userId,
  task,
  setIsOpen,
  defaultStatus,
  onTaskClick,
}: TaskSheetContentProps) {
  return (
    <SheetContent className="min-w-[700px] flex flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-6 text-[#797979]">
          <SheetClose>
            <MdClose size={24} />
          </SheetClose>
          <TfiArrowsCorner size={20} />
        </div>
        <div className="flex items-center gap-x-4">
          <IconButton label="Share" icon=<FiShare2 size={20} /> />
          <IconButton label="Favorite" icon=<PiStar size={20} /> />
        </div>
      </div>
      <TaskSheetForm
        userId={userId}
        task={task}
        setIsOpen={setIsOpen}
        defaultStatus={defaultStatus}
      />
      <hr className="h-[1px] w-full bg-[#dedede]" />
      <p className="text-[#c0bdbd]">
        Start writing, or drag your own files here.
      </p>
    </SheetContent>
  );
}

type TaskSheetIconProps = {
  icon: React.ReactNode;
  label: string;
};

export const TaskSheetIcon = ({ icon, label }: TaskSheetIconProps) => {
  return (
    <div className="flex items-center gap-x-6 text-[#666666] w-60">
      {icon}
      <p className="">{label}</p>
    </div>
  );
};
