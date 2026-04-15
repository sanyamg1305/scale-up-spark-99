import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";

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
  team_feedback: string;
  team_ownership: string;
  process_clarity: string;
  firefighting_frequency: string;
  priority_management: string;
  founder_dependency: string;
  delegation_level: string;
  decision_making: string;
  vision_clarity: string;
  daily_routine: string;
  stress_level: string;
  emotional_control: string;
  situation: string;
}

const INITIAL: FormData = {
  revenue_trend: "",
  growth_speed: "",
  team_motivation: "",
  team_stability: "",
  team_feedback: "",
  team_ownership: "",
  process_clarity: "",
  firefighting_frequency: "",
  priority_management: "",
  founder_dependency: "",
  delegation_level: "",
  decision_making: "",
  vision_clarity: "",
  daily_routine: "",
  stress_level: "",
  emotional_control: "",
  situation: "",
};

const STORAGE_KEY = "skc-form-data";
const STEP_KEY = "skc-form-step";

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
    title: "Growth Patterns",
    icon: "🚀",
    questions: [
      {
        key: "revenue_trend",
        label: "How does your revenue appear to be moving?",
        tooltip: "This invites you to notice the general direction of your income over recent months.",
        options: [
          { label: "It seems to be declining", tooltip: "Revenue appears to be decreasing over time." },
          { label: "It feels flat", tooltip: "Revenue seems stable but without noticeable growth." },
          { label: "There is some growth", tooltip: "Revenue appears to be increasing gradually." },
          { label: "It is growing quickly", tooltip: "Revenue seems to be rising at a strong pace." },
        ],
      },
      {
        key: "growth_speed",
        label: "What pace of growth do you notice?",
        tooltip: "This is about the overall momentum you sense across customers, revenue, or reach.",
        options: [
          { label: "Nothing seems to be moving", tooltip: "Growth appears absent right now." },
          { label: "Very slow movement", tooltip: "There may be slight progress, but it is hard to see." },
          { label: "Steady and moderate", tooltip: "Things appear to be moving at a comfortable pace." },
          { label: "Moving very fast", tooltip: "Growth feels rapid and possibly hard to keep up with." },
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
        label: "What level of energy do you notice in your team?",
        tooltip: "This is about the engagement and motivation you sense from the people around you.",
        options: [
          { label: "They seem disengaged", tooltip: "There may be a sense of disconnection from the work." },
          { label: "Going through the motions", tooltip: "People show up but the energy feels low." },
          { label: "Generally engaged", tooltip: "The team appears interested and putting in effort." },
          { label: "Highly energized", tooltip: "There seems to be strong enthusiasm and drive." },
        ],
      },
      {
        key: "team_stability",
        label: "How would you describe the continuity of your team?",
        tooltip: "This reflects how often the composition of your team changes.",
        options: [
          { label: "People leave frequently", tooltip: "There appears to be a pattern of high turnover." },
          { label: "Some people come and go", tooltip: "Occasional changes happen in the team." },
          { label: "Mostly consistent", tooltip: "The team appears stable with few changes." },
          { label: "Very stable", tooltip: "There seems to be strong continuity and loyalty." },
        ],
      },
      {
        key: "team_feedback",
        label: "How openly does feedback seem to flow?",
        tooltip: "This is about whether people appear to feel safe sharing honest thoughts.",
        options: [
          { label: "It rarely happens", tooltip: "Honest feedback does not seem to surface." },
          { label: "Only when prompted", tooltip: "People may share when asked, but not on their own." },
          { label: "Sometimes", tooltip: "Some people speak up, but it is not consistent." },
          { label: "It flows freely", tooltip: "There appears to be a culture of open sharing." },
        ],
      },
      {
        key: "team_ownership",
        label: "Do people seem to take initiative on their own?",
        tooltip: "This reflects whether the team appears to act proactively or wait for direction.",
        options: [
          { label: "Everything waits for me", tooltip: "Nothing seems to move without your input." },
          { label: "Rarely", tooltip: "Most people appear to wait for instructions." },
          { label: "Some do", tooltip: "A few people step up, but not consistently." },
          { label: "They drive things forward", tooltip: "The team appears to take ownership naturally." },
        ],
      },
    ],
  },
  {
    title: "Systems & Flow",
    icon: "⚙️",
    questions: [
      {
        key: "process_clarity",
        label: "How clear do your processes feel?",
        tooltip: "This is about whether there seems to be a known way of doing things.",
        options: [
          { label: "There are no clear processes", tooltip: "Things seem to happen without a defined way." },
          { label: "It changes depending on the day", tooltip: "Some structure exists but it shifts often." },
          { label: "Key things are documented", tooltip: "Important tasks appear to have clear steps." },
          { label: "Everything runs on systems", tooltip: "There seem to be repeatable processes in place." },
        ],
      },
      {
        key: "firefighting_frequency",
        label: "How often do urgent surprises seem to appear?",
        tooltip: "This reflects how much of your time goes to reacting rather than planning.",
        options: [
          { label: "Almost constantly", tooltip: "Most of the time seems spent on unexpected problems." },
          { label: "Most days", tooltip: "Urgent things appear to come up nearly every day." },
          { label: "A few times a week", tooltip: "Surprises happen but not every day." },
          { label: "Rarely", tooltip: "Most work appears planned and predictable." },
        ],
      },
      {
        key: "priority_management",
        label: "How do priorities seem to get managed?",
        tooltip: "This is about the system, if any, that guides what gets attention.",
        options: [
          { label: "I react to whatever comes up", tooltip: "There does not appear to be a priority system." },
          { label: "It stays in my head", tooltip: "Priorities exist mentally but are not written down." },
          { label: "There is a basic system", tooltip: "Lists or tools are used but not always followed." },
          { label: "Planned and followed through", tooltip: "Priorities appear to be set and honored consistently." },
        ],
      },
    ],
  },
  {
    title: "Leadership Patterns",
    icon: "👑",
    questions: [
      {
        key: "founder_dependency",
        label: "How much does the business seem to depend on you?",
        tooltip: "This reflects whether the system appears to rely heavily on your presence.",
        options: [
          { label: "Nothing moves without me", tooltip: "The business appears to stop if you step away." },
          { label: "Most things need me", tooltip: "Most decisions and tasks seem to go through you." },
          { label: "Some things still need me", tooltip: "The team handles most things but some require you." },
          { label: "It runs independently", tooltip: "The business appears to operate without you daily." },
        ],
      },
      {
        key: "delegation_level",
        label: "How naturally does delegation seem to happen?",
        tooltip: "This reflects how comfortable you appear with handing things off.",
        options: [
          { label: "I do almost everything", tooltip: "Most tasks seem to stay with you." },
          { label: "Very little gets delegated", tooltip: "You hand off only small things." },
          { label: "Some things get shared", tooltip: "Delegation happens but selectively." },
          { label: "It happens naturally", tooltip: "Tasks appear to flow to the right people easily." },
        ],
      },
      {
        key: "decision_making",
        label: "How do decisions seem to get made?",
        tooltip: "This reflects whether decision-making appears centralized or distributed.",
        options: [
          { label: "Everything goes through me", tooltip: "You appear to make every decision." },
          { label: "Most need my approval", tooltip: "Most decisions seem to require your sign-off." },
          { label: "Some are shared", tooltip: "The team makes some decisions independently." },
          { label: "Distributed across the team", tooltip: "Decisions appear to be made by the right people." },
        ],
      },
    ],
  },
  {
    title: "Clarity & Inner State",
    icon: "🧭",
    questions: [
      {
        key: "vision_clarity",
        label: "How clear does your direction feel?",
        tooltip: "This is about whether the path forward seems well-defined and understood.",
        options: [
          { label: "It feels unclear", tooltip: "The direction does not seem well-defined." },
          { label: "There is a vague sense", tooltip: "A rough direction exists but it is not sharp." },
          { label: "Fairly clear", tooltip: "The direction seems defined and explainable." },
          { label: "Very clear", tooltip: "The vision appears sharp and shared across the team." },
        ],
      },
      {
        key: "daily_routine",
        label: "How structured does your day feel?",
        tooltip: "This reflects whether your days seem to follow a rhythm or feel reactive.",
        options: [
          { label: "No routine at all", tooltip: "Every day feels different with no consistency." },
          { label: "Loosely structured", tooltip: "There is a rough plan but it rarely holds." },
          { label: "Mostly structured", tooltip: "Days seem to have a rhythm with some flexibility." },
          { label: "Highly disciplined", tooltip: "A clear daily structure appears to be followed." },
        ],
      },
      {
        key: "stress_level",
        label: "What does your stress level feel like?",
        tooltip: "This is about the pressure you sense in your day-to-day experience.",
        options: [
          { label: "It feels overwhelming", tooltip: "There may be a sense of approaching burnout." },
          { label: "Always present", tooltip: "Stress seems to be a constant background presence." },
          { label: "Manageable", tooltip: "Some stress exists but it feels contained." },
          { label: "Calm and focused", tooltip: "There appears to be a sense of control and clarity." },
        ],
      },
      {
        key: "emotional_control",
        label: "How steady do you feel emotionally?",
        tooltip: "This reflects how you seem to experience tough moments.",
        options: [
          { label: "Small things throw me off", tooltip: "Reactions may come quickly to minor events." },
          { label: "Tough moments affect my mood", tooltip: "Difficult situations tend to shift your state." },
          { label: "Mostly steady", tooltip: "You appear to stay calm most of the time." },
          { label: "Fully grounded", tooltip: "Pressure does not seem to shift your composure." },
        ],
      },
    ],
  },
  {
    title: "Your Reflection",
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
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem(STEP_KEY);
    return saved ? Math.min(parseInt(saved, 10), flatSteps.length - 1) : 0;
  });
  const [data, setData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL, ...parsed };
      } catch { /* ignore */ }
    }
    return INITIAL;
  });
  const [restored, setRestored] = useState(false);

  // Show restored message on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasData = Object.values(parsed).some((v) => v !== "");
        if (hasData) {
          setRestored(true);
          toast.info("Your previous inputs have been restored");
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Auto-save data and step
  const updateData = useCallback((newData: FormData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(currentIndex));
  }, [currentIndex]);

  const startFresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
    setData(INITIAL);
    setCurrentIndex(0);
    setRestored(false);
    toast.success("Starting fresh");
  };

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
    else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
      onSubmit(data);
    }
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack();
  };

  const selectOption = (key: keyof FormData, value: string) => {
    updateData({ ...data, [key]: value });
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
            <div className="flex flex-col items-center gap-1">
              <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
              <span className="font-display font-semibold uppercase tracking-[0.2em]">
                {current.icon} {current.title}
              </span>
            </div>
            <span className="tabular-nums">{currentIndex + 1}/{total}</span>
          </div>
        </div>

        {/* Restored banner */}
        {restored && currentIndex === 0 && (
          <div className="container max-w-2xl px-6 pt-2">
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 text-sm">
              <span className="text-foreground">Your previous inputs have been restored</span>
              <button
                onClick={startFresh}
                className="text-primary font-medium hover:underline text-xs"
              >
                Start Fresh
              </button>
            </div>
          </div>
        )}

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
                  Share what is present for you right now
                </h2>
                <p className="text-muted-foreground text-sm">
                  There are no right or wrong answers. Simply describe what you notice about your business and leadership at this moment.
                </p>
                <textarea
                  value={data.situation}
                  onChange={(e) => updateData({ ...data, situation: e.target.value })}
                  placeholder="Revenue is growing but my team keeps leaving. I am working long hours and things do not feel sustainable…"
                  className="w-full min-h-[180px] rounded-xl border-2 border-border bg-card px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 resize-y font-body transition-colors"
                />
                <Button
                  variant="gold"
                  size="lg"
                  onClick={next}
                  className="w-full py-6 text-base"
                >
                  See My Reflection →
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
