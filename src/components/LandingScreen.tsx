import { Button } from "@/components/ui/button";

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="text-center space-y-10 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="space-y-6">
          <img 
            src="/logo.png" 
            alt="Scale & Clarity OS Logo" 
            className="h-20 md:h-24 mx-auto object-contain animate-in fade-in slide-in-from-top-4 duration-1000"
          />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Scale & Clarity OS
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-body leading-relaxed max-w-md mx-auto">
            A structured pause from operational momentum,<br />
            <span className="text-foreground font-medium">to examine what may otherwise go unnoticed.</span>
          </p>
        </div>

        <p className="text-muted-foreground/60 text-sm max-w-sm mx-auto leading-relaxed">
          A 2-minute reflective diagnostic to help you notice patterns in your business and leadership.
        </p>

        <Button
          variant="gold"
          size="lg"
          onClick={onStart}
          className="px-14 py-7 text-lg"
        >
          Begin Reflection
        </Button>
      </div>
    </div>
  );
};

export default LandingScreen;
