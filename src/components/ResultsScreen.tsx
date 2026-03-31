import GrowthMeter from "./GrowthMeter";
import QuadrantMap from "./QuadrantMap";
import { Button } from "@/components/ui/button";

export interface DiagnosisResult {
  state: string;
  identity: string;
  entrepreneurship_score: number;
  consciousness_score: number;
  insights: string[];
  business_leaks: { type: string; description: string }[];
  quest_chain: { level: number; name: string; objective: string; action: string; reward: string }[];
  future_warning: string;
  path_to_ssj: string[];
}

interface ResultsScreenProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

const stateConfig: Record<string, { emoji: string; color: string; ctaText: string }> = {
  Burnout: { emoji: "🔥", color: "text-destructive", ctaText: "Let's help you reduce the pressure and find more balance" },
  Survival: { emoji: "⚠️", color: "text-gold-dim", ctaText: "Let's get things moving in the right direction" },
  Stagnation: { emoji: "🧊", color: "text-muted-foreground", ctaText: "Let's turn your clarity into real progress" },
  SSJ: { emoji: "🚀", color: "text-primary", ctaText: "Let's help you reach Success | Scale | Joy" },
};

const leakIcons: Record<string, string> = {
  "Vision Gap": "🧭",
  "Systems Gap": "⚙️",
  "Energy Gap": "⚡",
  "Culture Gap": "🧬",
};

const ResultsScreen = ({ result, onRestart }: ResultsScreenProps) => {
  const config = stateConfig[result.state] || stateConfig.Burnout;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

        {/* ─── YOUR CURRENT STATE ─── */}
        <div className="text-center space-y-3 pt-6">
          <p className="text-xs font-display uppercase tracking-[0.3em] text-muted-foreground">
            🧭 Your Current State
          </p>
          <div className="text-5xl">{config.emoji}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            You are:
          </h1>
          <p className={`font-display text-2xl md:text-3xl font-bold ${config.color}`}>
            {result.identity}
          </p>
        </div>

        {/* ─── QUADRANT MAP ─── */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <QuadrantMap
            entrepreneurshipScore={result.entrepreneurship_score}
            consciousnessScore={result.consciousness_score}
          />
        </div>

        {/* ─── GROWTH METER ─── */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-4">
            📊 Your Growth Meter
          </p>
          <GrowthMeter
            entrepreneurshipScore={result.entrepreneurship_score}
            consciousnessScore={result.consciousness_score}
          />
        </div>

        {/* ─── WHAT'S HAPPENING ─── */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            🧠 What's Happening
          </h3>
          <div className="space-y-3">
            {result.insights.map((insight, i) => (
              <p key={i} className="text-foreground text-base leading-relaxed font-medium">
                {insight}
              </p>
            ))}
          </div>
        </div>

        {/* ─── WHAT NEEDS ATTENTION ─── */}
        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            ⚠️ What Needs Attention
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {result.business_leaks.map((leak, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 space-y-2 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{leakIcons[leak.type] || "🔻"}</span>
                  <h4 className="font-display font-bold text-foreground text-sm">{leak.type}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{leak.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── YOUR NEXT STEPS ─── */}
        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            🎯 Your Next Steps
          </h3>
          <div className="space-y-4">
            {result.quest_chain.map((quest, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-display font-bold text-sm">
                    {quest.level}
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-foreground text-sm">{quest.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {quest.level === 1 ? "Start Here" : quest.level === 2 ? "Build On This" : "Go Deeper"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground">{quest.objective}</p>
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold mt-0.5">▸</span>
                    <span className="text-foreground">{quest.action}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold mt-0.5">★</span>
                    <span className="text-muted-foreground italic">{quest.reward}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── WHAT THIS MEANS FOR YOU ─── */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 space-y-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            🌱 What This Means for You
          </h3>
          <p className="text-foreground text-base leading-relaxed">
            {result.future_warning}
          </p>
        </div>

        {/* ─── PATH TO ALIGNED GROWTH ─── */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            🚀 Your Path Forward
          </h3>
          <div className="space-y-3">
            {result.path_to_ssj.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-display font-bold text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-foreground text-base">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA SECTION ─── */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-10 space-y-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
            You've completed Step 1: Awareness
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Awareness is just the beginning.
          </h2>
          <p className="text-muted-foreground text-base">
            Real change comes from the right support + clear action.
          </p>

          <div className="pt-2 space-y-4">
            <p className="font-display text-lg font-semibold text-foreground">
              Ready for Step 2? Let's Work Together
            </p>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm text-muted-foreground">
              <p>SKC helps founders:</p>
              <p>✔ Get clear on a vision your team can follow</p>
              <p>✔ Align your people, culture, and performance</p>
              <p>✔ Build systems that grow without burning you out</p>
            </div>
          </div>

          <Button variant="gold" size="lg" className="px-10 py-6 text-base w-full max-w-md">
            Book Your Leadership Reflection Call
          </Button>

          <p className={`text-sm font-medium ${config.color}`}>
            {config.ctaText}
          </p>

          <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto leading-relaxed">
            A friendly 20-minute conversation about what's really going on in your business and what small changes could make a big difference.
          </p>
        </div>

        {/* Restart */}
        <div className="text-center pt-4 pb-10">
          <Button variant="outline" onClick={onRestart} className="px-8">
            Run Another Scan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
