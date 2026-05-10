import type { Task } from "./types";

const TASKS_KEY = "tm.tasks.v1";
const USER_KEY = "tm.user.v1";
const THEME_KEY = "tm.theme.v1";

export const storage = {
  getTasks(): Task[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    } catch {
      return [];
    }
  },
  setTasks(tasks: Task[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
  getUser(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_KEY);
  },
  setUser(name: string | null) {
    if (typeof window === "undefined") return;
    if (name) localStorage.setItem(USER_KEY, name);
    else localStorage.removeItem(USER_KEY);
  },
  getTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
  },
  setTheme(theme: "light" | "dark") {
    if (typeof window === "undefined") return;
    localStorage.setItem(THEME_KEY, theme);
  },
};

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
