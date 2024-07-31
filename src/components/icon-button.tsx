import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type IconButtonProps = {
  label: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function IconButton({
  label,
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      type="button"
      className={cn(
        "flex gap-x-2 text-[#797979] bg-[#f4f4f4] rounded-lg hover:bg-neutral-200 duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      <p className="text-base font-normal">{label}</p>
      {icon}
    </Button>
  );
}
