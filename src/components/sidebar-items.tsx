"use client";

import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: (label: string) => void;
};

export default function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      onClick={() => onClick(label)}
      className={cn(
        "flex items-center gap-x-[14px] text-[20px] text-[#797979] p-2 rounded border border-transparent hover:cursor-pointer hover:bg-[#f4f4f4] hover:border hover:border-[#dddddd] duration-300 ease-in-out",
        isActive && "bg-[#F4F4F4] border border-[#dddddd]"
      )}
    >
      {icon}
      <p className="">{label}</p>
    </div>
  );
}
