import GrowthMeter from "./GrowthMeter";
import StateBadge from "./StateBadge";

export interface DiagnosisResult {
  state: string;
  entrepreneurship_score: number;
  consciousness_score: number;
  problems: string[];
  open_loop: string;
  next_move: string;
}

interface DiagnosisCardProps {
  result: DiagnosisResult;
}

const DiagnosisCard = ({ result }: DiagnosisCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-8 gold-glow animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-foreground">Diagnosis Report</h2>
        <StateBadge state={result.state} />
      </div>

      {/* Growth Meter */}
      <GrowthMeter
        entrepreneurshipScore={result.entrepreneurship_score}
        consciousnessScore={result.consciousness_score}
      />

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Key Problems */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Key Problems
        </h3>
        <ul className="space-y-2">
          {result.problems.map((problem, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-0.5 text-destructive">✕</span>
              <span>{problem}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Open Loop */}
      <div className="space-y-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          ⚠️ Open Loop
        </h3>
        <p className="text-sm text-foreground rounded-md border border-primary/20 bg-primary/5 p-3">
          {result.open_loop}
        </p>
      </div>

      {/* Next Move */}
      <div className="space-y-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          ✅ Next Move
        </h3>
        <p className="text-sm text-foreground rounded-md border border-primary/30 bg-primary/10 p-3 font-medium">
          {result.next_move}
        </p>
      </div>
    </div>
  );
};

export default DiagnosisCard;
