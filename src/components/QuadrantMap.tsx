interface QuadrantMapProps {
  entrepreneurshipScore: number;
  consciousnessScore: number;
}

const QuadrantMap = ({ entrepreneurshipScore, consciousnessScore }: QuadrantMapProps) => {
  const dotX = entrepreneurshipScore;
  const dotY = 100 - consciousnessScore;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Your Position
      </h3>
      <div className="relative w-full aspect-square max-w-sm mx-auto">
        <div className="absolute inset-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-display uppercase tracking-wider text-muted-foreground/50">
            Stagnation
          </div>
          <div className="absolute top-3 right-3 text-[10px] font-display uppercase tracking-wider text-primary/60">
            SSJ ✦
          </div>
          <div className="absolute bottom-3 left-3 text-[10px] font-display uppercase tracking-wider text-muted-foreground/50">
            Survival
          </div>
          <div className="absolute bottom-3 right-3 text-[10px] font-display uppercase tracking-wider text-destructive/60">
            Burnout
          </div>

          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />

          {/* Axis labels */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-[10px] font-display uppercase tracking-wider text-muted-foreground">
            Execution Energy →
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 text-[10px] font-display uppercase tracking-wider text-muted-foreground rotate-[-90deg]">
            Alignment Energy →
          </div>

          <div
            className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{ left: `${dotX}%`, top: `${dotY}%` }}
          >
            <div className="w-full h-full rounded-full bg-primary gold-glow animate-pulse-gold" />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadrantMap;
