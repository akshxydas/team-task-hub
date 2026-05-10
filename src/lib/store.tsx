import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Activity, ActivityAction, Task } from "./types";
import { storage, uid } from "./storage";

interface Ctx {
  user: string | null;
  setUser: (n: string | null) => void;
  tasks: Task[];
  theme: "light" | "dark";
  toggleTheme: () => void;
  createTask: (input: {
    name: string;
    description: string;
    dueDate?: string;
    assignedTo: string;
  }) => void;
  updateTask: (
    id: string,
    patch: Partial<Pick<Task, "name" | "description" | "dueDate" | "assignedTo">>,
  ) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  addComment: (id: string, text: string) => void;
}

const TaskCtx = createContext<Ctx | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUserState(storage.getUser());
    setTasks(storage.getTasks());
    const t = storage.getTheme();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) storage.setTasks(tasks);
  }, [tasks, hydrated]);

  const setUser = useCallback((n: string | null) => {
    storage.setUser(n);
    setUserState(n);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      storage.setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  const pushActivity = (
    task: Task,
    action: ActivityAction,
    actor: string,
    detail?: string,
  ): Task => {
    const a: Activity = {
      id: uid(),
      action,
      user: actor,
      timestamp: Date.now(),
      detail,
    };
    return { ...task, activity: [a, ...task.activity], updatedAt: Date.now() };
  };

  const createTask: Ctx["createTask"] = useCallback(
    (input) => {
      if (!user) return;
      const now = Date.now();
      const task: Task = {
        id: uid(),
        name: input.name,
        description: input.description,
        dueDate: input.dueDate,
        assignedTo: input.assignedTo,
        completed: false,
        createdBy: user,
        createdAt: now,
        updatedAt: now,
        comments: [],
        activity: [
          {
            id: uid(),
            action: "created",
            user,
            timestamp: now,
          },
        ],
      };
      setTasks((t) => [task, ...t]);
    },
    [user],
  );

  const updateTask: Ctx["updateTask"] = useCallback(
    (id, patch) => {
      if (!user) return;
      setTasks((tasks) =>
        tasks.map((t) => {
          if (t.id !== id) return t;
          const changes = Object.keys(patch).join(", ");
          const updated = { ...t, ...patch };
          return pushActivity(updated, "updated", user, `Edited: ${changes}`);
        }),
      );
    },
    [user],
  );

  const toggleComplete: Ctx["toggleComplete"] = useCallback(
    (id) => {
      if (!user) return;
      setTasks((tasks) =>
        tasks.map((t) => {
          if (t.id !== id) return t;
          const next = { ...t, completed: !t.completed };
          return pushActivity(next, next.completed ? "completed" : "reopened", user);
        }),
      );
    },
    [user],
  );

  const deleteTask: Ctx["deleteTask"] = useCallback((id) => {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
  }, []);

  const addComment: Ctx["addComment"] = useCallback(
    (id, text) => {
      if (!user || !text.trim()) return;
      setTasks((tasks) =>
        tasks.map((t) => {
          if (t.id !== id) return t;
          const comment = {
            id: uid(),
            text: text.trim(),
            author: user,
            timestamp: Date.now(),
          };
          const withComment = { ...t, comments: [...t.comments, comment] };
          return pushActivity(withComment, "commented", user);
        }),
      );
    },
    [user],
  );

  const value = useMemo<Ctx>(
    () => ({
      user,
      setUser,
      tasks,
      theme,
      toggleTheme,
      createTask,
      updateTask,
      toggleComplete,
      deleteTask,
      addComment,
    }),
    [user, tasks, theme, setUser, toggleTheme, createTask, updateTask, toggleComplete, deleteTask, addComment],
  );

  return <TaskCtx.Provider value={value}>{children}</TaskCtx.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskCtx);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
