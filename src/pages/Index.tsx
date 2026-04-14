import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingScreen from "@/components/LandingScreen";
import StepForm, { type FormData } from "@/components/StepForm";
import AnalyzingScreen from "@/components/AnalyzingScreen";
import ResultsScreen, { type DiagnosisResult } from "@/components/ResultsScreen";
import { toast } from "sonner";

type Screen = "landing" | "form" | "analyzing" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const savedData = localStorage.getItem("skc-form-data");
      const savedStep = localStorage.getItem("skc-form-step");
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const hasData = Object.values(parsed).some((v) => v !== "");
        if (hasData) return "form";
      }
      if (savedStep && parseInt(savedStep, 10) > 0) {
        return "form";
      }
    } catch {
      // Ignore parse errors
    }
    return "landing";
  });
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleSubmit = async (data: FormData) => {
    setScreen("analyzing");

    try {
      const { data: res, error } = await supabase.functions.invoke("diagnose", {
        body: data,
      });

      if (error) {
        toast.error(error.message || "Something went wrong.");
        setScreen("form");
        return;
      }

      if (res?.error) {
        toast.error(res.error);
        setScreen("form");
        return;
      }

      await new Promise((r) => setTimeout(r, 2000));
      setResult(res as DiagnosisResult);
      setScreen("results");
    } catch {
      toast.error("Failed to connect. Please try again.");
      setScreen("form");
    }
  };

  const restart = () => {
    setResult(null);
    setScreen("landing");
  };

  return (
    <>
      {screen === "landing" && <LandingScreen onStart={() => setScreen("form")} />}
      {screen === "form" && <StepForm onSubmit={handleSubmit} onBack={() => setScreen("landing")} />}
      {screen === "analyzing" && <AnalyzingScreen />}
      {screen === "results" && result && <ResultsScreen result={result} onRestart={restart} />}
    </>
  );
};

export default Index;
