"use client";

import { Barlow } from "next/font/google";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "@/actions/lucia-signup";
import { useState } from "react";

const barlow = Barlow({ weight: "600", subsets: ["latin"] });

const inputStyles =
  "text-xl bg-[#EBEBEB] h-[52px] focus-visible:ring-neutral-400 focus-visible:ring-1 focus-visible:ring-offset-1";

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    await signup(formData);
    setIsSubmitting(true);
  }

  return (
    <main className="h-screen bg-gradient-to-b from-white to-[#AFA3FF] text-center ">
      <form
        action={handleSubmit}
        className="inline-flex flex-col items-center p-[60px] mt-[120px] bg-gradient-to-b 
        from-[#f7f7f7] to-[#f0f0f0] gap-y-8 w-[648px] rounded-2xl"
      >
        <h1 className={`text-5xl font-semibold ${barlow.className}`}>
          Welcome to <span className="text-[#4534AC]">Workflo</span>!
        </h1>
        <div className="w-full flex flex-col gap-y-[22px]">
          <Input
            name="username"
            type="text"
            placeholder="Your name"
            className={inputStyles}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Your email"
            className={inputStyles}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            className={inputStyles}
            required
          />
          <Button
            type="submit"
            className="text-xl h-[52px] bg-gradient-to-b from-[#4C38C2] to-[#2F2188]
            font-normal"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Createn Account"}
          </Button>
        </div>
        <p className="text-x text-[#606060]">
          Already have an account?
          <a href="/login" className="text-[#0054A1]">
            Login
          </a>
          .
        </p>
      </form>
    </main>
  );
}
