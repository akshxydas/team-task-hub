import { useState } from "react";
import type { Task } from "@/lib/types";
import { useTasks } from "@/lib/store";
import { formatRelative, initials } from "@/lib/format";
import { Send } from "lucide-react";

export function CommentSection({ task }: { task: Task }) {
  const { addComment } = useTasks();
  const [text, setText] = useState("");

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Comments ({task.comments.length})
      </div>
      <div className="space-y-3 mb-3">
        {task.comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              {initials(c.author)}
            </div>
            <div className="flex-1 bg-muted rounded-lg px-3 py-2">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-sm font-semibold text-foreground">{c.author}</span>
                <span className="text-xs text-muted-foreground">{formatRelative(c.timestamp)}</span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{c.text}</p>
            </div>
          </div>
        ))}
        {task.comments.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No comments yet.</p>
        )}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); addComment(task.id, text); setText(""); }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 h-10 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-sm"
        />
        <button type="submit" disabled={!text.trim()} className="h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground disabled:opacity-50" style={{ background: "var(--gradient-primary)" }}>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
