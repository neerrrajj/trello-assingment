import { Barlow } from "next/font/google";
import { IoHelpCircleOutline } from "react-icons/io5";
import IconButton from "./icon-button";
import { User } from "lucia";

const barlow = Barlow({ weight: "600", subsets: ["latin"] });

export default function Title({ user }: { user: User }) {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className={`text-4xl ${barlow.className}`}>
        {getGreeting()}, {user.username}!
      </h1>
      <IconButton
        label="Help & feedback"
        icon=<IoHelpCircleOutline size={20} />
        className="bg-inherit text-black "
      />
    </div>
  );
}
