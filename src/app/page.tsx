import { Button } from "@/components/ui/button";
import { Barlow } from "next/font/google";
import Link from "next/link";

const barlow = Barlow({ weight: "600", subsets: ["latin"] });

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-b from-white to-[#AFA3FF] text-center flex flex-col items-center gap-y-4 mt-20">
      <div className="mt-20">
        <div
          className="inline-flex py-1 px-3 mb-2 text-sm text-gray-100 animate-shimmer items-center justify-center rounded-full border border-purple-900
        bg-[linear-gradient(110deg,#281e62,45%,#4534AC,55%,#281e62)] bg-[length:200%_100%] font-normal
        transition-colors"
        >
          No.1 Task Management App
        </div>
        <h1
          className={`text-7xl font-semibold text-[#4534AC] ${barlow.className}`}
        >
          Workflo!
        </h1>
      </div>
      <div className="text-base md:text-xl text-neutral-700 font-medium mt-4 md:mt-6 max-w-xs md:max-w-2xl sm:text-center">
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is unique -
        accomplish it all with Workflo!
      </div>
      <div className="flex gap-x-4">
        <Button className="mt-6 text-base" variant="outline" size="lg" asChild>
          <Link href="/signup">Signup</Link>
        </Button>
        <Button
          className="mt-6 bg-[#4534AC] hover:bg-[#4f3eb0] text-white text-base"
          size="lg"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </main>
  );
}
