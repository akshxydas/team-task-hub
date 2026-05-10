import { useState } from "react";
import { TEAM_MEMBERS } from "@/lib/types";
import { useTasks } from "@/lib/store";
import { initials } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export function Login() {
  const { setUser } = useTasks();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-subtle)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Taskly</h1>
          <p className="text-muted-foreground mt-2">Pick your name to sign in</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="space-y-2">
            {TEAM_MEMBERS.map((m) => (
              <button
                key={m}
                onClick={() => setSelected(m)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                  selected === m
                    ? "border-primary bg-accent"
                    : "border-transparent hover:bg-accent"
                }`}
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  {initials(m)}
                </div>
                <span className="font-medium text-foreground">{m}</span>
              </button>
            ))}
          </div>
          <button
            disabled={!selected}
            onClick={() => selected && setUser(selected)}
            className="mt-5 w-full h-11 rounded-xl font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
