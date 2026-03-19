import { cn } from "@/lib/utils";

interface StateBadgeProps {
  state: string;
}

const stateConfig: Record<string, { label: string; className: string }> = {
  "Burnout": {
    label: "🔥 Burnout",
    className: "border-destructive/50 bg-destructive/10 text-destructive",
  },
  "Survival Stagnation": {
    label: "⚠️ Survival Stagnation",
    className: "border-gold-dim/50 bg-gold-dim/10 text-gold-dim",
  },
  "Success, Scale & Joy": {
    label: "🚀 Success, Scale & Joy",
    className: "border-primary/50 bg-primary/10 text-primary",
  },
};

const StateBadge = ({ state }: StateBadgeProps) => {
  const config = stateConfig[state] || stateConfig["Burnout"];

  return (
    <span
      className={cn(
        "inline-block rounded-full border px-4 py-1.5 text-sm font-display font-semibold tracking-wide",
        config.className
      )}
    >
      {config.label}
    </span>
  );
};

export default StateBadge;
