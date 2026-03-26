import { Button } from "@/components/ui/button";

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="text-center space-y-10 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Logo mark */}
        <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center gold-glow">
          <span className="text-primary font-display font-bold text-3xl gold-text-glow">S</span>
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Scale & Clarity OS
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-body leading-relaxed max-w-md mx-auto">
            Your business isn't stuck by luck.<br />
            <span className="text-foreground font-medium">It's stuck by structure.</span>
          </p>
        </div>

        <p className="text-muted-foreground/60 text-sm max-w-sm mx-auto leading-relaxed">
          A 2-minute diagnostic that tells you exactly what's broken and what to fix next.
        </p>

        <Button
          variant="gold"
          size="lg"
          onClick={onStart}
          className="px-14 py-7 text-lg"
        >
          Start Scan
        </Button>
      </div>
    </div>
  );
};

export default LandingScreen;
