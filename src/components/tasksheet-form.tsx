"use client";

import { SetStateAction, useState } from "react";
import { Barlow } from "next/font/google";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Task } from "@prisma/client";
import {
  PiCalendarBlank,
  PiSpinnerBold,
  PiWarningDiamond,
} from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { LuPlus } from "react-icons/lu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import createTask from "@/actions/createTask";
import updateTask from "@/actions/updateTask";
import deleteTask from "@/actions/deleteTask";
import { TaskSheetIcon } from "./tasksheet-content";
import { useTaskContextProvider } from "@/contexts/task-context";
import getUser from "@/actions/getUser";
import { formSchema } from "@/lib/formSchemas";

const barlow = Barlow({ weight: "600", subsets: ["latin"] });

const inputStyles =
  "text-base placeholder:text-[#cccccc] border-0 focus-visible:ring-0 focus-visible:ring-offset-0";

const status = ["To-do", "In Progress", "Under Review", "Completed"] as const;
const priority = ["Low", "Medium", "Urgent"] as const;

const statusMapping = {
  "To-do": "TODO",
  "In Progress": "INPROGRESS",
  "Under Review": "UNDERREVIEW",
  Completed: "COMPLETED",
} as const;

const priorityMapping = {
  Low: "LOW",
  Medium: "MEDIUM",
  Urgent: "URGENT",
} as const;

export default function TaskSheetForm({
  task,
  setIsOpen,
  defaultStatus,
}: {
  task?: Task | null;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  defaultStatus?: "To-do" | "In Progress" | "Under Review" | "Completed";
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tasks, setTasks } = useTaskContextProvider();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status
        ? (Object.keys(statusMapping) as (keyof typeof statusMapping)[]).find(
            (key) => statusMapping[key] === task.status
          )
        : defaultStatus ?? "To-do",
      priority: task?.priority
        ? (
            Object.keys(priorityMapping) as (keyof typeof priorityMapping)[]
          ).find((key) => priorityMapping[key] === task.priority)
        : undefined,
      deadline: task?.deadline && new Date(task.deadline),
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const mappedValues = {
      ...values,
      status: statusMapping[values.status],
      priority: values.priority ? priorityMapping[values.priority] : undefined,
    };

    try {
      if (task?.id) {
        const updatedTask = await updateTask(task.id, mappedValues);
        setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      } else {
        const user = await getUser();
        const createdTask = await createTask(mappedValues, user?.id);
        setTasks([...tasks, createdTask]);
      }
    } catch (error) {
      console.error("Failed to submit the form:", error);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);
    try {
      if (task?.id) {
        await deleteTask(task.id);
        setTasks(tasks.filter((t) => t.id !== task.id));
      }
    } catch (error) {
      console.error("Failed to delete the task:", error);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Title"
                    className={`text-5xl font-semibold ${barlow.className} pl-0 text-neutral-800 placeholder:text-[#cccccc] border-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex flex-col gap-y-4 ">
          <div className="inline-flex gap-x-[60px]">
            <TaskSheetIcon label="Status" icon=<PiSpinnerBold size={24} /> />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select
                      value={task?.status.toString()}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <div className="inline-flex w-full items-center justify-between">
                          <SelectTrigger className="border-0 flex h-10 w-full items-center justify-between">
                            <Button
                              variant={"outline"}
                              value={task ? task.status : undefined}
                              className={cn(
                                "w-full text-base font-normal border-0 flex items-center justify-start pl-3",
                                !field.value &&
                                  "text-[#c1bdbd] hover:text-[#c1bdbd]"
                              )}
                            >
                              {field.value ? (
                                field.value
                              ) : (
                                <span>Not selected</span>
                              )}
                            </Button>
                          </SelectTrigger>
                          <FormMessage className="px-3" />
                        </div>
                      </FormControl>
                      <SelectContent>
                        {status.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="inline-flex gap-x-[60px] ">
            <TaskSheetIcon
              label="Priority"
              icon=<PiWarningDiamond size={24} />
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-0 flex h-10 w-full items-center justify-between">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full text-base font-normal border-0 flex items-center justify-start pl-3",
                              !field.value &&
                                "text-[#c1bdbd] hover:text-[#c1bdbd]"
                            )}
                          >
                            {field.value ? (
                              field.value
                            ) : (
                              <span>Not selected</span>
                            )}
                          </Button>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priority.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="inline-flex gap-x-[60px]">
            <TaskSheetIcon
              label="Deadline"
              icon=<PiCalendarBlank size={24} />
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <div className="inline-flex w-full items-center justify-between">
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left text-base font-normal flex items-center justify-start gap-x-4 border-0",
                                !field.value &&
                                  "text-[#c1bdbd] hover:text-[#c1bdbd]"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Not selected</span>
                              )}
                            </Button>
                            <FormMessage className="px-3" />
                          </div>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="inline-flex gap-x-[60px] mb-2">
            <TaskSheetIcon label="Description" icon=<GoPencil size={24} /> />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Not selected"
                        className={inputStyles}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <TaskSheetIcon
            label="Add custom property"
            icon=<LuPlus size={24} />
          />
        </div>
        <div className="flex gap-x-2 w-full">
          <Button
            variant="destructive"
            className="w-1/3"
            disabled={isSubmitting || !task?.id}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button type="submit" className="w-2/3" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
