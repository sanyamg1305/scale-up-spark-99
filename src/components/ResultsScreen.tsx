import GrowthMeter from "./GrowthMeter";
import QuadrantMap from "./QuadrantMap";
import ActionChecklist from "./ActionChecklist";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateReport } from "@/lib/generatePdf";

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
  Burnout: { emoji: "🔥", color: "text-destructive", ctaText: "There may be an opportunity to create more space and balance" },
  Survival: { emoji: "⚠️", color: "text-gold-dim", ctaText: "It may be worth exploring what could shift the current momentum" },
  Stagnation: { emoji: "🧊", color: "text-muted-foreground", ctaText: "There appears to be clarity that could be channeled into movement" },
  SSJ: { emoji: "🚀", color: "text-primary", ctaText: "The patterns suggest readiness for Success | Scale | Joy" },
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

        {/* Brand Logo */}
        <div className="flex justify-center pt-4">
          <img src="/logo.png" alt="Scale & Clarity OS" className="h-12 w-auto object-contain" />
        </div>

        {/* Deliberate pause positioning */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground/50 italic max-w-md mx-auto leading-relaxed">
            This is a structured pause from operational momentum, to examine what may otherwise go unnoticed.
          </p>
        </div>

        {/* YOUR CURRENT STATE */}
        <div className="text-center space-y-3">
          <p className="text-xs font-display uppercase tracking-[0.3em] text-muted-foreground">
            🧭 What May Be Present
          </p>
          <div className="text-5xl">{config.emoji}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            It appears you may be:
          </h1>
          <p className={`font-display text-2xl md:text-3xl font-bold ${config.color}`}>
            {result.identity}
          </p>
        </div>

        {/* QUADRANT MAP */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <QuadrantMap
            entrepreneurshipScore={result.entrepreneurship_score}
            consciousnessScore={result.consciousness_score}
          />
        </div>

        {/* GROWTH METER */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-4">
            📊 Energy Reflection
          </p>
          <GrowthMeter
            entrepreneurshipScore={result.entrepreneurship_score}
            consciousnessScore={result.consciousness_score}
          />
        </div>

        {/* WHAT MAY BE NOTICED */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            🧠 What May Be Noticed
          </h3>
          <div className="space-y-3">
            {result.insights.map((insight, i) => (
              <p key={i} className="text-foreground text-base leading-relaxed font-medium">
                {insight}
              </p>
            ))}
          </div>
        </div>

        {/* WHAT MAY BE UNRESOLVED */}
        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            ⚠️ What May Be Unresolved
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

        {/* AREAS TO EXAMINE */}
        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            🎯 Areas to Examine
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
                      {quest.level === 1 ? "Begin Here" : quest.level === 2 ? "Build On This" : "Go Deeper"}
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

        {/* ACTION CHECKLIST */}
        <ActionChecklist quests={result.quest_chain} />

        {/* WHAT THIS MEANS FOR YOU */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 space-y-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            🌱 What This May Mean for You
          </h3>
          <p className="text-foreground text-base leading-relaxed">
            {result.future_warning}
          </p>
        </div>

        {/* PATH TO SSJ */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            🚀 Path Toward Success | Scale | Joy
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

        {/* DOWNLOAD REPORT */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={async () => await generateReport(result)}
            className="gap-2 px-8"
          >
            <Download size={18} />
            Download PDF Report
          </Button>
        </div>

        {/* CTA SECTION */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-10 space-y-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
            You have completed Step 1: Awareness
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Awareness is the beginning.
          </h2>
          <p className="text-muted-foreground text-base">
            What follows is an invitation to examine further, with the right support.
          </p>

          <div className="pt-2 space-y-4">
            <p className="font-display text-lg font-semibold text-foreground">
              Ready for Step 2? A Guided Conversation
            </p>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm text-muted-foreground">
              <p>SKC helps founders explore:</p>
              <p>✔ What a shared direction could look like for your team</p>
              <p>✔ Where alignment between people, culture, and purpose may deepen</p>
              <p>✔ How systems might evolve without creating more pressure</p>
            </div>
          </div>

          <Button 
            variant="gold" 
            size="lg" 
            className="px-10 py-6 text-base w-full max-w-md"
            onClick={() => window.open("https://calendly.com/divya-conscious-entrepreneurship/new-meeting", "_blank")}
          >
            Book Your Leadership Reflection Call
          </Button>

          <p className={`text-sm font-medium ${config.color}`}>
            {config.ctaText}
          </p>

          <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto leading-relaxed">
            A spacious 20-minute conversation to reflect on what is present in your business and what small shifts may be worth exploring.
          </p>
        </div>

        {/* Restart */}
        <div className="text-center pt-4 pb-10">
          <Button variant="outline" onClick={onRestart} className="px-8">
            Begin Another Reflection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
