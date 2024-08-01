import TasksContainer from "@/components/tasks-container";
import Sidebar from "@/components/sidebar";
import Title from "@/components/title";
import getUser from "@/actions/getUser";

export default async function TasksPage() {
  const user = await getUser();

  return (
    <main className="flex">
      <Sidebar user={user} />
      <div className="flex flex-col w-full px-8 py-4 gap-y-4 ">
        <Title user={user} />
        <TasksContainer />
      </div>
    </main>
  );
}
