import { useEffect, useState } from "react";

interface GrowthMeterProps {
  entrepreneurshipScore: number;
  consciousnessScore: number;
}

const GrowthMeter = ({ entrepreneurshipScore, consciousnessScore }: GrowthMeterProps) => {
  const [animatedE, setAnimatedE] = useState(0);
  const [animatedC, setAnimatedC] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedE(entrepreneurshipScore);
      setAnimatedC(consciousnessScore);
    }, 200);
    return () => clearTimeout(timer);
  }, [entrepreneurshipScore, consciousnessScore]);

  return (
    <div className="space-y-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Energy Meters
      </h3>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">⚡ Execution Energy</span>
          <span className="text-primary font-display font-bold">{entrepreneurshipScore}%</span>
        </div>
        <div className="h-3.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${animatedE}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">🧭 Alignment Energy</span>
          <span className="text-gold-glow font-display font-bold">{consciousnessScore}%</span>
        </div>
        <div className="h-3.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gold-glow transition-all duration-1000 ease-out"
            style={{ width: `${animatedC}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 leading-relaxed pt-1">
        Execution Energy reflects movement and action in the system. Alignment Energy reflects clarity, direction, and shared understanding.
      </p>
    </div>
  );
};

export default GrowthMeter;
