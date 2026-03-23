import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  team_alignment: string;
  founder_emotional_state: string;
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
  team_alignment: "",
  founder_emotional_state: "",
  situation: "",
};

interface StepFormProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

const steps = [
  {
    title: "Growth Engine",
    icon: "🚀",
    fields: [
      {
        key: "revenue_trend" as const,
        label: "Revenue Trend",
        options: ["Declining", "Flat", "Slow Growth", "Fast Growth", "Explosive Growth"],
      },
      {
        key: "growth_speed" as const,
        label: "Growth Speed",
        options: ["Stagnant", "Slow", "Moderate", "Fast", "Hypergrowth"],
      },
    ],
  },
  {
    title: "Team Dynamics",
    icon: "👥",
    fields: [
      {
        key: "team_motivation" as const,
        label: "Team Motivation",
        options: ["Very Low", "Low", "Neutral", "High", "Very High"],
      },
      {
        key: "team_stability" as const,
        label: "Team Stability",
        options: ["High Turnover", "Some Turnover", "Stable", "Very Stable", "Rock Solid"],
      },
    ],
  },
  {
    title: "Systems & Operations",
    icon: "⚙️",
    fields: [
      {
        key: "process_clarity" as const,
        label: "Process Clarity",
        options: ["No Processes", "Ad Hoc", "Some SOPs", "Well Documented", "Fully Systematized"],
      },
      {
        key: "firefighting_frequency" as const,
        label: "Firefighting Frequency",
        options: ["Constant", "Daily", "Weekly", "Occasionally", "Rarely"],
      },
    ],
  },
  {
    title: "Leadership Load",
    icon: "👑",
    fields: [
      {
        key: "founder_dependency" as const,
        label: "Founder Dependency",
        options: ["Everything Needs Me", "Most Things", "About Half", "Limited", "Minimal"],
      },
      {
        key: "delegation_level" as const,
        label: "Delegation Level",
        options: ["None", "Minimal", "Moderate", "Strong", "Fully Delegated"],
      },
    ],
  },
  {
    title: "Purpose & Vision",
    icon: "🧭",
    fields: [
      {
        key: "vision_clarity" as const,
        label: "Vision Clarity",
        options: ["No Clear Vision", "Vague", "Somewhat Clear", "Clear", "Crystal Clear"],
      },
      {
        key: "team_alignment" as const,
        label: "Team Alignment with Vision",
        options: ["Completely Misaligned", "Partially Aligned", "Neutral", "Mostly Aligned", "Fully Aligned"],
      },
      {
        key: "founder_emotional_state" as const,
        label: "Founder Emotional State",
        options: ["Burned Out", "Stressed", "Coping", "Energized", "Thriving"],
      },
    ],
  },
  {
    title: "Open Input",
    icon: "✍️",
    fields: [],
    hasTextarea: true,
  },
];

const StepForm = ({ onSubmit, onBack }: StepFormProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);

  const current = steps[step];
  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const isStepComplete = () => {
    if (current.hasTextarea) return true; // text is optional
    return current.fields.every((f) => data[f.key] !== "");
  };

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onSubmit(data);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress bar */}
      <div className="w-full h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="container max-w-2xl pt-6 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <button onClick={prev} className="hover:text-foreground transition-colors">
            ← Back
          </button>
          <span className="font-display font-semibold uppercase tracking-widest">
            Step {step + 1} of {totalSteps}
          </span>
          <span />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-8 pb-20">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-300" key={step}>
          {/* Step header */}
          <div className="space-y-2">
            <span className="text-3xl">{current.icon}</span>
            <h2 className="font-display text-2xl font-bold text-foreground">{current.title}</h2>
          </div>

          {/* Fields */}
          <div className="space-y-6">
            {current.fields.map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="block text-sm font-medium text-muted-foreground">
                  {field.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setData({ ...data, [field.key]: opt })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        data[field.key] === opt
                          ? "bg-primary text-primary-foreground border-primary gold-glow"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {current.hasTextarea && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-muted-foreground">
                  Describe your current business situation
                </label>
                <textarea
                  value={data.situation}
                  onChange={(e) => setData({ ...data, situation: e.target.value })}
                  placeholder="Revenue is growing fast, but my team keeps quitting and everything feels chaotic..."
                  className="w-full min-h-[160px] rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-y font-body"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4">
            <Button
              variant="gold"
              size="lg"
              onClick={next}
              disabled={!isStepComplete()}
              className="px-10"
            >
              {step === totalSteps - 1 ? "Run Diagnosis" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepForm;
