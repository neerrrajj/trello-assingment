"use client";

import { useEffect, useState } from "react";
import { Barlow } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/lucia-login";
import { cn } from "@/lib/utils";
import checkUser from "@/actions/checkUser";

const barlow = Barlow({ weight: "600", subsets: ["latin"] });

const inputStyles =
  "text-xl bg-[#EBEBEB] h-[52px] focus-visible:ring-neutral-400 focus-visible:ring-1 focus-visible:ring-offset-1";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const router = useRouter();

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

  async function handleLogin(formData: FormData) {
    setIsSubmitting(true);
    try {
      console.log("Submitting form with values:", formData);
      const response = await login(formData);
      if (response.error) {
        console.error("Login error:", response.error);
        setIsSubmitting(false);
      }
      if (response.success) {
        console.log("Login successful, redirecting to tasks");
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
      <form
        action={handleLogin}
        className="inline-flex flex-col items-center p-[60px] mt-[120px] bg-gradient-to-b 
        from-[#f7f7f7] to-[#f0f0f0] gap-y-8 
      w-[648px] rounded-2xl"
      >
        <h1 className={`text-5xl font-semibold ${barlow.className}`}>
          Welcome to <span className="text-[#4534AC]">Workflo</span>!
        </h1>
        <div className="w-full flex flex-col gap-y-[22px]">
          <Input
            name="email"
            placeholder="Your email"
            type="email"
            className={inputStyles}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            className={inputStyles}
          />
          <Button
            className="text-xl h-[52px] bg-gradient-to-b from-[#4C38C2] to-[#2F2188] font-normal"
            type="submit"
            disabled={isSubmitting || isCheckingUser}
          >
            {isSubmitting
              ? "Logging in..."
              : isCheckingUser
              ? "Checking user..."
              : "Login"}
          </Button>
        </div>
        <p className="text-x text-[#606060]">
          Don&apos;t have an account? Create a{" "}
          <Link
            href="/signup"
            className={cn(
              "text-[#0054A1]",
              isCheckingUser && "cursor-not-allowed"
            )}
          >
            new account
          </Link>
          .
        </p>
      </form>
    </main>
  );
}
