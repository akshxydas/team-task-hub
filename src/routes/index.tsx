import { createFileRoute } from "@tanstack/react-router";
import { TaskProvider, useTasks } from "@/lib/store";
import { Login } from "@/components/Login";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Taskly — Team task manager" },
      { name: "description", content: "Lightweight collaborative task manager for small teams. Track, assign, and discuss tasks." },
    ],
  }),
});

function Gate() {
  const { user } = useTasks();
  return user ? <Dashboard /> : <Login />;
}

function Index() {
  return (
    <TaskProvider>
      <Gate />
    </TaskProvider>
  );
}
