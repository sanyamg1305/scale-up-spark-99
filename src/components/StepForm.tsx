import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FormData {
  revenue_trend: string;
  growth_speed: string;
  team_motivation: string;
  team_stability: string;
  process_clarity: string;
  firefighting_frequency: string;
  founder_dependency: string;
  delegation_level: string;
  vision_clarity: string;
  stress_level: string;
  emotional_control: string;
  situation: string;
}

const INITIAL: FormData = {
  revenue_trend: "",
  growth_speed: "",
  team_motivation: "",
  team_stability: "",
  process_clarity: "",
  firefighting_frequency: "",
  founder_dependency: "",
  delegation_level: "",
  vision_clarity: "",
  stress_level: "",
  emotional_control: "",
  situation: "",
};

interface StepFormProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

interface OptionItem {
  label: string;
  tooltip: string;
}

interface Question {
  key: keyof FormData;
  label: string;
  tooltip: string;
  options: OptionItem[];
}

interface Step {
  title: string;
  icon: string;
  questions: Question[];
  hasTextarea?: boolean;
}

const steps: Step[] = [
  {
    title: "Growth Engine",
    icon: "🚀",
    questions: [
      {
        key: "revenue_trend",
        label: "How is your revenue trending?",
        tooltip: "Is your income going up, staying flat, or going down over the last few months?",
        options: [
          { label: "Declining", tooltip: "Your revenue is going down month by month." },
          { label: "Flat", tooltip: "Revenue is stable but not growing." },
          { label: "Slow Growth", tooltip: "Revenue is increasing a little each month." },
          { label: "Fast Growth", tooltip: "Revenue is growing quickly and consistently." },
        ],
      },
      {
        key: "growth_speed",
        label: "How fast are you actually growing?",
        tooltip: "The overall pace of your business growth — customers, revenue, or reach.",
        options: [
          { label: "Stagnant", tooltip: "No noticeable growth happening right now." },
          { label: "Crawling", tooltip: "Growing very slowly — barely noticeable." },
          { label: "Moderate", tooltip: "Steady growth at a comfortable pace." },
          { label: "Hypergrowth", tooltip: "Growing extremely fast — hard to keep up." },
        ],
      },
    ],
  },
  {
    title: "Team Dynamics",
    icon: "👥",
    questions: [
      {
        key: "team_motivation",
        label: "How motivated is your team right now?",
        tooltip: "How energized and engaged your team feels about the work they're doing.",
        options: ["Checked Out", "Going Through Motions", "Engaged", "On Fire"],
      },
      {
        key: "team_stability",
        label: "How stable is your team?",
        tooltip: "How often people leave or join your team. High turnover means low stability.",
        options: ["Revolving Door", "Some Turnover", "Stable", "Rock Solid"],
      },
    ],
  },
  {
    title: "Systems & Operations",
    icon: "⚙️",
    questions: [
      {
        key: "process_clarity",
        label: "How clear are your processes?",
        tooltip: "Whether your team knows exactly how things should be done, step by step.",
        options: ["Total Chaos", "Ad Hoc", "Some SOPs", "Fully Systematized"],
      },
      {
        key: "firefighting_frequency",
        label: "How often are you firefighting?",
        tooltip: "How often you deal with urgent problems instead of planned, important work.",
        options: ["All Day Every Day", "Daily", "Weekly", "Rarely"],
      },
    ],
  },
  {
    title: "Leadership Load",
    icon: "👑",
    questions: [
      {
        key: "founder_dependency",
        label: "How dependent is the business on you?",
        tooltip: "How much your business depends on you to make decisions or run daily work.",
        options: ["Nothing Works Without Me", "Most Things Need Me", "Some Things", "Runs Without Me"],
      },
      {
        key: "delegation_level",
        label: "How well do you delegate?",
        tooltip: "How comfortable you are handing off tasks and trusting others to do them.",
        options: ["I Do Everything", "Barely Delegate", "Moderate", "Strong Delegation"],
      },
    ],
  },
  {
    title: "Clarity & Wellbeing",
    icon: "🧭",
    questions: [
      {
        key: "vision_clarity",
        label: "How clear is your vision?",
        tooltip: "How well you can describe where your business is heading and why it matters.",
        options: ["No Clue", "Vague Idea", "Fairly Clear", "Crystal Clear"],
      },
      {
        key: "stress_level",
        label: "What's your stress level?",
        tooltip: "How much pressure you're feeling day to day as a founder.",
        options: ["Breaking Point", "Constantly Stressed", "Manageable", "Calm & Focused"],
      },
      {
        key: "emotional_control",
        label: "How steady do you feel emotionally?",
        tooltip: "How well you handle tough moments without reacting impulsively.",
        options: ["Very Reactive", "Often Triggered", "Mostly Steady", "Fully Grounded"],
      },
    ],
  },
  {
    title: "Your Situation",
    icon: "✍️",
    questions: [],
    hasTextarea: true,
  },
];

// Flatten all questions for one-per-screen navigation
interface FlatStep {
  stepIndex: number;
  title: string;
  icon: string;
  question?: Question;
  hasTextarea?: boolean;
}

const flatSteps: FlatStep[] = [];
steps.forEach((step, si) => {
  if (step.questions.length > 0) {
    step.questions.forEach((q) => {
      flatSteps.push({ stepIndex: si, title: step.title, icon: step.icon, question: q });
    });
  }
  if (step.hasTextarea) {
    flatSteps.push({ stepIndex: si, title: step.title, icon: step.icon, hasTextarea: true });
  }
});

const StepForm = ({ onSubmit, onBack }: StepFormProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);

  const current = flatSteps[currentIndex];
  const total = flatSteps.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const canProceed = () => {
    if (current.hasTextarea) return true;
    if (current.question) return data[current.question.key] !== "";
    return true;
  };

  const next = () => {
    if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
    else onSubmit(data);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack();
  };

  const selectOption = (key: keyof FormData, value: string) => {
    setData({ ...data, [key]: value });
    setTimeout(() => {
      if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="container max-w-2xl pt-6 pb-2 px-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <button onClick={prev} className="hover:text-foreground transition-colors font-medium">
              ← Back
            </button>
            <span className="font-display font-semibold uppercase tracking-[0.2em]">
              {current.icon} {current.title}
            </span>
            <span className="tabular-nums">{currentIndex + 1}/{total}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div
            className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-300"
            key={currentIndex}
          >
            {/* Question with card options */}
            {current.question && (
              <div className="space-y-6">
                <div className="flex items-start gap-2">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {current.question.label}
                  </h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="mt-1.5 shrink-0 text-muted-foreground hover:text-primary transition-colors">
                        <Info size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px] text-sm">
                      {current.question.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid gap-3">
                  {current.question.options.map((opt) => {
                    const isSelected = data[current.question!.key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => selectOption(current.question!.key, opt)}
                        className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 border-2 ${
                          isSelected
                            ? "bg-primary/15 text-primary border-primary gold-glow"
                            : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-card/80"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Textarea step */}
            {current.hasTextarea && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  Tell us about your business right now
                </h2>
                <p className="text-muted-foreground text-sm">
                  Share what's on your mind. The more you share, the more helpful your results will be.
                </p>
                <textarea
                  value={data.situation}
                  onChange={(e) => setData({ ...data, situation: e.target.value })}
                  placeholder="Revenue is growing but my team keeps leaving. I'm working long hours and things don't feel sustainable…"
                  className="w-full min-h-[180px] rounded-xl border-2 border-border bg-card px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 resize-y font-body transition-colors"
                />
                <Button
                  variant="gold"
                  size="lg"
                  onClick={next}
                  className="w-full py-6 text-base"
                >
                  Get My Results →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StepForm;
