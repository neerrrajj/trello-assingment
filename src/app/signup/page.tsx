"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Barlow } from "next/font/google";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signup } from "@/actions/lucia-signup";
import checkUser from "@/actions/checkUser";

const barlow = Barlow({ weight: "600", subsets: ["latin"] });

const inputStyles =
  "text-xl bg-[#EBEBEB] h-[52px] focus-visible:ring-neutral-400 focus-visible:ring-1 focus-visible:ring-offset-1";

const userSchema = z.object({
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

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkIfUser = async () => {
      const user = await checkUser();
      if (user) {
        router.push("/tasks");
      } else {
        setIsCheckingUser(false);
      }
    };
    checkIfUser();
  }, []);

  async function handleSubmit(values: z.infer<typeof userSchema>) {
    setIsSubmitting(true);
    try {
      console.log("Submitting form with values:", values);
      const response = await signup(values);
      if (response.error) {
        console.error("Signup error:", response.error);
        setIsSubmitting(false);
      }
      if (response.success) {
        console.log("Signup successful, redirecting to tasks");
        router.push("/tasks");
      }
    } catch (error) {
      console.error("Failed to submit the form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="h-screen bg-gradient-to-b from-white to-[#AFA3FF] text-center ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="inline-flex flex-col items-center p-[60px] mt-[120px] bg-gradient-to-b 
        from-[#f7f7f7] to-[#f0f0f0] gap-y-8 w-[648px] rounded-2xl"
        >
          <h1 className={`text-5xl font-semibold ${barlow.className}`}>
            Welcome to <span className="text-[#4534AC]">Workflo</span>!
          </h1>
          <div className="w-full flex flex-col gap-y-[22px]">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your email"
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Password"
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              type="submit"
              className="text-xl h-[52px] bg-gradient-to-b from-[#4C38C2] to-[#2F2188]
            font-normal"
              disabled={isSubmitting || isCheckingUser}
            >
              {isSubmitting
                ? "Creating..."
                : isCheckingUser
                ? "Checking user..."
                : "Create an Account"}
            </Button>
          </div>
          <p className="text-x text-[#606060]">
            Already have an account?
            <Link href="/login" className="text-[#0054A1]">
              Login
            </Link>
            .
          </p>
        </form>
      </Form>
    </main>
  );
}
