import { useState } from "react";
import type { Task, ActivityAction } from "@/lib/types";
import { formatRelative } from "@/lib/format";
import { ChevronDown, Activity as ActivityIcon } from "lucide-react";

const actionLabels: Record<ActivityAction, string> = {
  created: "created the task",
  updated: "updated the task",
  completed: "marked it complete",
  reopened: "reopened the task",
  commented: "added a comment",
  deleted: "deleted the task",
};

export function ActivityLog({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
        <ActivityIcon className="h-3.5 w-3.5" />
        Activity ({task.activity.length})
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5 text-sm">
          {task.activity.map((a) => (
            <li key={a.id} className="text-muted-foreground">
              <span className="font-medium text-foreground">{a.user}</span> {actionLabels[a.action]}
              {a.detail && <span className="text-xs"> — {a.detail}</span>}
              <span className="text-xs"> · {formatRelative(a.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
