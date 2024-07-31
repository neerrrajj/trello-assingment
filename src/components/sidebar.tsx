"use client";

import { useState } from "react";
import { User } from "lucia";
import { IoSettingsOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { PiChartLine, PiSpinnerBold } from "react-icons/pi";
import { RiHome2Line } from "react-icons/ri";
import { LuBellDot } from "react-icons/lu";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineViewKanban,
} from "react-icons/md";
import { BiSolidPlusCircle } from "react-icons/bi";
import { LiaDownloadSolid } from "react-icons/lia";

import { Button } from "./ui/button";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarItem from "./sidebar-items";
import { logout } from "@/actions/logout";
import IconButton from "./icon-button";
import TaskSheetContent from "./tasksheet-content";
import Image from "next/image";

export default function Sidebar({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
  };

  return (
    <div className="h-screen w-[285px] flex flex-col justify-between p-4 border-r border-[#dedede]">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <div className="inline-flex h-[30px] w-[30px] rounded-lg bg-pink-700" />
            <p className="font-medium">{user.username}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[#666666] gap-x-3">
              <LuBellDot size={24} />
              <PiSpinnerBold size={24} className="stroke-black" />
              <MdKeyboardDoubleArrowRight size={28} />
            </div>
            <form action={logout}>
              {/* <button>Sign out</button> */}
              <IconButton label="Logout" />
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <SidebarItem
              icon={<RiHome2Line size={24} />}
              label="Home"
              isActive={activeItem == "Home"}
              onClick={handleItemClick}
            />
            <SidebarItem
              icon={<MdOutlineViewKanban size={24} />}
              label="Boards"
              isActive={activeItem == "Boards"}
              onClick={handleItemClick}
            />
            <SidebarItem
              icon={<IoSettingsOutline size={24} />}
              label="Settings"
              isActive={activeItem == "Settings"}
              onClick={handleItemClick}
            />
            <SidebarItem
              icon={<GoPeople size={24} />}
              label="Teams"
              isActive={activeItem == "Teams"}
              onClick={handleItemClick}
            />
            <SidebarItem
              icon={<PiChartLine size={24} />}
              label="Analytics"
              isActive={activeItem == "Analytics"}
              onClick={handleItemClick}
            />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="flex gap-x-2 bg-gradient-to-b from-[#4c38c2] to-[#2f2188] 
              hover:from-[#4c38c2] hover:to-[#4c38c2] p-6 rounded-lg"
              >
                <p className="text-base">Create new task</p>
                <BiSolidPlusCircle size={26} />
              </Button>
            </SheetTrigger>
            <TaskSheetContent userId={user.id} setIsOpen={setIsOpen} />
          </Sheet>
        </div>
      </div>
      <div
        className="mb-4 flex items-center justify-center gap-x-2 p-2 pr-4 text-[#666666] bg-[#f3f3f3] hover:bg-neutral-200
      duration-300 ease-in-out rounded-lg"
      >
        <LiaDownloadSolid size={40} />
        <div className="flex flex-col">
          <p className="">Download the app</p>
          <p className="text-xs">Get the full experience</p>
        </div>
      </div>
    </div>
  );
}
