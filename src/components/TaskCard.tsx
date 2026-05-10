import { useState } from "react";
import type { Task } from "@/lib/types";
import { useTasks } from "@/lib/store";
import { formatDate, formatRelative, initials, isOverdue } from "@/lib/format";
import { CommentSection } from "./CommentSection";
import { ActivityLog } from "./ActivityLog";
import { TaskFormModal } from "./TaskFormModal";
import { ChevronDown, Pencil, Trash2, Calendar, User, AlertCircle } from "lucide-react";

interface Props { task: Task }

export function TaskCard({ task }: Props) {
  const { toggleComplete, deleteTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <>
      <div className={`bg-card border rounded-2xl transition-all ${overdue ? "border-destructive/40" : "border-border"}`} style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
            className={`shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
              task.completed
                ? "bg-success border-success"
                : "border-muted-foreground/40 hover:border-primary"
            }`}
            aria-label="Toggle complete"
          >
            {task.completed && (
              <svg viewBox="0 0 12 12" className="h-3 w-3 text-success-foreground"><path fill="currentColor" d="M10.28 2.28L4 8.56 1.72 6.28.28 7.72 4 11.44l7.72-7.72z" /></svg>
            )}
          </button>

          <button onClick={() => setOpen((o) => !o)} className="flex-1 flex items-center gap-3 min-w-0 text-left">
            <div className="flex-1 min-w-0">
              <div className={`font-semibold truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.name}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-5 w-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                    {initials(task.assignedTo)}
                  </span>
                  {task.assignedTo}
                </span>
                {task.dueDate && (
                  <span className={`inline-flex items-center gap-1 ${overdue ? "text-destructive font-medium" : ""}`}>
                    {overdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {formatDate(task.dueDate)}
                  </span>
                )}
                {task.comments.length > 0 && <span>· {task.comments.length} comment{task.comments.length > 1 ? "s" : ""}</span>}
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="border-t border-border p-4 space-y-5">
            {task.description && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Description</div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              <Meta icon={<User className="h-4 w-4" />} label="Assigned" value={task.assignedTo} />
              {task.dueDate && <Meta icon={<Calendar className="h-4 w-4" />} label="Due" value={formatDate(task.dueDate)} />}
              <Meta icon={<User className="h-4 w-4" />} label="Created by" value={`${task.createdBy} · ${formatRelative(task.createdAt)}`} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-background hover:bg-accent text-foreground text-sm font-medium">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button onClick={() => { if (confirm("Delete this task?")) deleteTask(task.id); }} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-background hover:bg-destructive hover:text-destructive-foreground text-foreground text-sm font-medium">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>

            <CommentSection task={task} />
            <ActivityLog task={task} />
          </div>
        )}
      </div>
      {editing && <TaskFormModal open={editing} onClose={() => setEditing(false)} task={task} />}
    </>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span><span className="font-medium text-foreground">{label}:</span> {value}</span>
    </div>
  );
}
