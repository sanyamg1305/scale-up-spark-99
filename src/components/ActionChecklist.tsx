import { useState, useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { STORAGE_KEYS } from "@/lib/constants";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ActionChecklistProps {
  quests: { level: number; name: string; action: string }[];
}

const ActionChecklist = ({ quests }: ActionChecklistProps) => {
  // Generate default items from quests
  const defaultItems = useMemo(() => {
    return quests.flatMap((quest, qi) =>
      quest.action.split(/[.;]\s*/).filter(Boolean).map((action, ai) => {
        const text = action.trim().replace(/^\d+[\.\)]\s*/, "");
        // Create a more stable ID using the text content (first 30 chars) and indices
        // This helps maintain state if quests are slightly modified but labels stay similar
        const contentHash = text.slice(0, 30).replace(/\s+/g, "");
        return {
          id: `${qi}-${ai}-${contentHash}`,
          text,
          checked: false,
        };
      })
    );
  }, [quests]);

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (saved) {
        const checkedIds = JSON.parse(saved) as string[];
        return defaultItems.map(item => ({
          ...item,
          checked: checkedIds.includes(item.id)
        }));
      }
    } catch { /* ignore */ }
    return defaultItems;
  });

  // Keep items in sync with quests prop changes (e.g. after a reload)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      const checkedIds = saved ? (JSON.parse(saved) as string[]) : [];
      
      setItems(defaultItems.map(item => ({
        ...item,
        checked: checkedIds.includes(item.id)
      })));
    } catch {
      setItems(defaultItems);
    }
  }, [defaultItems]);

  // Persist checked state
  useEffect(() => {
    try {
      const checkedIds = items.filter(i => i.checked).map(i => i.id);
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checkedIds));
    } catch (e) {
      console.error("Failed to save checklist state:", e);
    }
  }, [items]);

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
            🎉 All areas explored. You are moving toward Success | Scale | Joy.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionChecklist;
