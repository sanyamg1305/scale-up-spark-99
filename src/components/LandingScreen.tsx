import { Button } from "@/components/ui/button";

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="text-center space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Logo mark */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center gold-glow">
          <span className="text-primary font-display font-bold text-2xl gold-text-glow">S</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            SSJ Growth OS
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            Diagnose. Align. Scale.
          </p>
        </div>

        <p className="text-muted-foreground/70 text-sm max-w-md mx-auto leading-relaxed">
          A 2-minute business scan that tells you exactly what's broken and what to fix next.
        </p>

        <Button
          variant="gold"
          size="lg"
          onClick={onStart}
          className="px-12 py-6 text-base"
        >
          Start Scan
        </Button>
      </div>
    </div>
  );
};

export default LandingScreen;
