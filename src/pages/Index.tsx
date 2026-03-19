import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DiagnosisCard, { type DiagnosisResult } from "@/components/DiagnosisCard";
import { toast } from "sonner";

const Index = () => {
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const runDiagnosis = async () => {
    if (!situation.trim()) {
      toast.error("Please describe your business situation first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("diagnose", {
        body: { situation: situation.trim() },
      });

      if (error) {
        toast.error(error.message || "Something went wrong.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data as DiagnosisResult);
    } catch (e) {
      toast.error("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-3xl py-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
                Scale-Up Readiness Simulator
              </h1>
              <p className="text-xs text-muted-foreground">
                Quick business health scan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-3xl py-10 space-y-8">
        {/* Input Section */}
        <div className="space-y-4">
          <label className="block font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Describe your current business situation
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Revenue is growing fast, but my team keeps quitting and everything feels chaotic..."
            className="w-full min-h-[140px] rounded-lg border border-input bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y font-body"
          />
          <Button
            variant="gold"
            size="lg"
            onClick={runDiagnosis}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Run Diagnosis"
            )}
          </Button>
        </div>

        {/* Results */}
        {result && <DiagnosisCard result={result} />}

        {/* Empty state */}
        {!result && !loading && (
          <div className="text-center py-16 space-y-3">
            <p className="text-muted-foreground text-sm">
              Tell us what's happening in your business.
            </p>
            <p className="text-muted-foreground/60 text-xs">
              We'll diagnose what's broken and tell you exactly what to fix next.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
