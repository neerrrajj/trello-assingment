import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must contain atleast 4 letters" })
    .max(31, { message: "Username must contain less than 31 letters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" })
    .max(255, { message: "Password must be less than 255 characters" }),
});

const status = ["To-do", "In Progress", "Under Review", "Completed"] as const;
const priority = ["Low", "Medium", "Urgent"] as const;

export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must contain atleast 3 letters" })
    .max(50, { message: "Title must contain less than 50 letters" }),
  status: z.enum(status),
  priority: z.enum(priority).optional(),
  deadline: z.date(),
  description: z.string().optional(),
});
