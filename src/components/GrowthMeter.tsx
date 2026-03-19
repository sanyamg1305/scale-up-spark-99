interface GrowthMeterProps {
  entrepreneurshipScore: number;
  consciousnessScore: number;
}

const GrowthMeter = ({ entrepreneurshipScore, consciousnessScore }: GrowthMeterProps) => {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Growth Meter
      </h3>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">Entrepreneurship</span>
          <span className="text-primary font-display font-bold">{entrepreneurshipScore}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${entrepreneurshipScore}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">Consciousness</span>
          <span className="text-primary font-display font-bold">{consciousnessScore}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gold-glow transition-all duration-1000 ease-out"
            style={{ width: `${consciousnessScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GrowthMeter;
