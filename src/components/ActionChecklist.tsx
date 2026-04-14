import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ActionChecklistProps {
  quests: { level: number; name: string; action: string }[];
}

const ActionChecklist = ({ quests }: ActionChecklistProps) => {
  const [items, setItems] = useState<ChecklistItem[]>(() =>
    quests.flatMap((quest, qi) =>
      quest.action.split(/[.;]\s*/).filter(Boolean).map((action, ai) => ({
        id: `${qi}-${ai}`,
        text: action.trim().replace(/^\d+[\.\)]\s*/, ""),
        checked: false,
      }))
    )
  );

  const toggle = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));

  const done = items.filter((i) => i.checked).length;
  const total = items.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          ✅ Areas to Examine - Checklist
        </h3>
        <span className="text-xs font-display font-semibold text-primary">
          {done}/{total} explored
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
              item.checked
                ? "bg-primary/5 border-primary/20 opacity-75"
                : "bg-transparent border-transparent hover:bg-secondary/50"
            }`}
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => toggle(item.id)}
              className="mt-0.5"
            />
            <span
              className={`text-sm leading-relaxed ${
                item.checked ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {item.text}
            </span>
          </label>
        ))}
      </div>

      {done === total && total > 0 && (
        <div className="text-center py-3">
          <p className="text-primary font-display font-bold text-sm">
            🎉 All areas explored. You are moving toward Success | State | Joy.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionChecklist;
