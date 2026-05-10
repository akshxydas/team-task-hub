import { useState } from "react";
import { TEAM_MEMBERS, type Task } from "@/lib/types";
import { useTasks } from "@/lib/store";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  task?: Task;
}

export function TaskFormModal({ open, onClose, task }: Props) {
  const { createTask, updateTask, user } = useTasks();
  const [name, setName] = useState(task?.name ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? user ?? TEAM_MEMBERS[0]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (task) {
      updateTask(task.id, { name: name.trim(), description, dueDate: dueDate || undefined, assignedTo });
    } else {
      createTask({ name: name.trim(), description, dueDate: dueDate || undefined, assignedTo });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-card border border-border rounded-2xl w-full max-w-lg p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">{task ? "Edit task" : "New task"}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-accent text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Task name">
            <input autoFocus required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due date">
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
            </Field>
            <Field label="Assigned to">
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
                {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex gap-2 mt-6 justify-end">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-lg border border-border bg-background hover:bg-accent text-foreground font-medium">Cancel</button>
          <button type="submit" className="h-10 px-5 rounded-lg font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            {task ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
