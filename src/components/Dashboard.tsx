import { useMemo, useState } from "react";
import { useTasks } from "@/lib/store";
import { TEAM_MEMBERS } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { TaskFormModal } from "./TaskFormModal";
import { initials, isOverdue } from "@/lib/format";
import { Plus, Search, LogOut, Moon, Sun, CheckCircle2 } from "lucide-react";

type FilterStatus = "all" | "pending" | "completed";

export function Dashboard() {
  const { tasks, user, setUser, theme, toggleTheme } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [assignee, setAssignee] = useState<string>("all");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [sortByDue, setSortByDue] = useState(true);

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => {
      if (assignee !== "all" && t.assignedTo !== assignee) return false;
      if (status === "completed" && !t.completed) return false;
      if (status === "pending" && t.completed) return false;
      if (query && !t.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sortByDue) {
      list = [...list].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else {
      list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [tasks, assignee, status, query, sortByDue]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
    return { total, completed, pending: total - completed, overdue };
  }, [tasks]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-subtle)" }}>
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-foreground">Taskly</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleTheme} className="h-9 w-9 rounded-lg border border-border bg-card hover:bg-accent flex items-center justify-center text-foreground" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2 pl-2 pr-1 h-9 rounded-lg bg-card border border-border">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                {initials(user || "?")}
              </div>
              <span className="text-sm font-medium text-foreground">{user}</span>
              <button onClick={() => setUser(null)} className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground" aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} />
          <Stat label="Completed" value={stats.completed} accent="success" />
          <Stat label="Overdue" value={stats.overdue} accent="destructive" />
        </section>

        <section className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-sm"
            />
          </div>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm">
            <option value="all">All assignees</option>
            {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as FilterStatus)} className="h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-foreground px-2">
            <input type="checkbox" checked={sortByDue} onChange={(e) => setSortByDue(e.target.checked)} />
            Sort by due
          </label>
          <button onClick={() => setShowForm(true)} className="h-10 px-4 rounded-lg font-semibold text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <Plus className="h-4 w-4" /> New
          </button>
        </section>

        <section className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">No tasks match. Create your first task!</p>
            </div>
          ) : (
            filtered.map((t) => <TaskCard key={t.id} task={t} />)
          )}
        </section>
      </main>

      {showForm && <TaskFormModal open={showForm} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: "success" | "destructive" }) {
  const color =
    accent === "success" ? "text-success" : accent === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-2xl p-4" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
