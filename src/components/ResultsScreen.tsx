import GrowthMeter from "./GrowthMeter";
import StateBadge from "./StateBadge";
import QuestCard from "./QuestCard";
import { Button } from "@/components/ui/button";

export interface DiagnosisResult {
  state: string;
  entrepreneurship_score: number;
  consciousness_score: number;
  insights: string[];
  open_loops: string[];
  quests: { name: string; objective: string; action: string; reward: string }[];
}

interface ResultsScreenProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

const ResultsScreen = ({ result, onRestart }: ResultsScreenProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-10 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs font-display uppercase tracking-[0.3em] text-muted-foreground">
            Your Diagnosis
          </p>
          <StateBadge state={result.state} />
        </div>

        {/* Growth Meter */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
          <GrowthMeter
            entrepreneurshipScore={result.entrepreneurship_score}
            consciousnessScore={result.consciousness_score}
          />
        </div>

        {/* Insights */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            🧠 What's Happening
          </h3>
          <ul className="space-y-3">
            {result.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-0.5 text-primary">●</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Open Loops */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            ⚠️ Open Loops
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.open_loops.map((loop, i) => (
              <span
                key={i}
                className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
              >
                {loop}
              </span>
            ))}
          </div>
        </div>

        {/* Quests */}
        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            🎮 Your Quests
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {result.quests.map((quest, i) => (
              <QuestCard key={i} quest={quest} />
            ))}
          </div>
        </div>

        {/* Restart */}
        <div className="text-center pt-4">
          <Button variant="outline" onClick={onRestart} className="px-8">
            Run Another Scan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
