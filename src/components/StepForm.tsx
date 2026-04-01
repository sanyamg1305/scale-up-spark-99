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
        options: [
          { label: "Checked Out", tooltip: "Your team has mentally disconnected from work." },
          { label: "Going Through Motions", tooltip: "They show up but aren't truly engaged." },
          { label: "Engaged", tooltip: "Your team is interested and putting in effort." },
          { label: "On Fire", tooltip: "Everyone is energized and giving their best." },
        ],
      },
      {
        key: "team_stability",
        label: "How stable is your team?",
        tooltip: "How often people leave or join your team. High turnover means low stability.",
        options: [
          { label: "Revolving Door", tooltip: "People leave frequently — hard to keep a team." },
          { label: "Some Turnover", tooltip: "A few people leave now and then." },
          { label: "Stable", tooltip: "Your team mostly stays and is reliable." },
          { label: "Rock Solid", tooltip: "Almost no one leaves — strong loyalty." },
        ],
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
        options: [
          { label: "Total Chaos", tooltip: "No clear way of doing things — everyone improvises." },
          { label: "Ad Hoc", tooltip: "Some structure exists but it changes constantly." },
          { label: "Some SOPs", tooltip: "Key tasks have documented steps to follow." },
          { label: "Fully Systematized", tooltip: "Everything runs on clear, repeatable processes." },
        ],
      },
      {
        key: "firefighting_frequency",
        label: "How often are you firefighting?",
        tooltip: "How often you deal with urgent problems instead of planned, important work.",
        options: [
          { label: "All Day Every Day", tooltip: "You spend most of your time on urgent surprises." },
          { label: "Daily", tooltip: "Unexpected problems pop up almost every day." },
          { label: "Weekly", tooltip: "Urgent issues come up a few times a week." },
          { label: "Rarely", tooltip: "Most of your work is planned and predictable." },
        ],
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
        options: [
          { label: "Nothing Works Without Me", tooltip: "The business stops if you step away." },
          { label: "Most Things Need Me", tooltip: "Most decisions and tasks still go through you." },
          { label: "Some Things", tooltip: "Your team handles most things independently." },
          { label: "Runs Without Me", tooltip: "The business operates smoothly without you daily." },
        ],
      },
      {
        key: "delegation_level",
        label: "How well do you delegate?",
        tooltip: "How comfortable you are handing off tasks and trusting others to do them.",
        options: [
          { label: "I Do Everything", tooltip: "You handle almost all tasks yourself." },
          { label: "Barely Delegate", tooltip: "You hand off very little — most stays with you." },
          { label: "Moderate", tooltip: "You delegate some tasks but keep key ones." },
          { label: "Strong Delegation", tooltip: "You trust your team and hand off confidently." },
        ],
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
        options: [
          { label: "No Clue", tooltip: "You're unsure where the business is heading." },
          { label: "Vague Idea", tooltip: "You have a rough direction but it's not clear." },
          { label: "Fairly Clear", tooltip: "You know your direction and can explain it." },
          { label: "Crystal Clear", tooltip: "Your vision is sharp and your team knows it too." },
        ],
      },
      {
        key: "stress_level",
        label: "What's your stress level?",
        tooltip: "How much pressure you're feeling day to day as a founder.",
        options: [
          { label: "Breaking Point", tooltip: "You feel overwhelmed and close to burnout." },
          { label: "Constantly Stressed", tooltip: "Stress is always there in the background." },
          { label: "Manageable", tooltip: "Some stress but you can handle it." },
          { label: "Calm & Focused", tooltip: "You feel in control and clear-headed." },
        ],
      },
      {
        key: "emotional_control",
        label: "How steady do you feel emotionally?",
        tooltip: "How well you handle tough moments without reacting impulsively.",
        options: [
          { label: "Very Reactive", tooltip: "Small things can throw you off quickly." },
          { label: "Often Triggered", tooltip: "Tough moments tend to affect your mood." },
          { label: "Mostly Steady", tooltip: "You stay calm most of the time." },
          { label: "Fully Grounded", tooltip: "You handle pressure without losing composure." },
        ],
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
                    const isSelected = data[current.question!.key] === opt.label;
                    return (
                      <Tooltip key={opt.label}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => selectOption(current.question!.key, opt.label)}
                            className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 border-2 flex items-center justify-between ${
                              isSelected
                                ? "bg-primary/15 text-primary border-primary gold-glow"
                                : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-card/80"
                            }`}
                          >
                            <span>{opt.label}</span>
                            <Info size={14} className="shrink-0 text-muted-foreground/50" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[240px] text-sm">
                          {opt.tooltip}
                        </TooltipContent>
                      </Tooltip>
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
