import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="space-y-5">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Energy Meters
        </h3>

        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium flex items-center gap-1.5">
              ⚡ Execution Energy
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] cursor-help">i</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How strongly your business is pushing forward — growth, sales, action, and output.</p>
                </TooltipContent>
              </Tooltip>
            </span>
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
            <span className="text-foreground font-medium flex items-center gap-1.5">
              🧭 Alignment Energy
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] cursor-help">i</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How aligned your team, culture, and vision are — clarity, purpose, and direction.</p>
                </TooltipContent>
              </Tooltip>
            </span>
            <span className="text-gold-glow font-display font-bold">{consciousnessScore}%</span>
          </div>
          <div className="h-3.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gold-glow transition-all duration-1000 ease-out"
              style={{ width: `${animatedC}%` }}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GrowthMeter;
