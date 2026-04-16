import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingScreen from "@/components/LandingScreen";
import StepForm, { type FormData } from "@/components/StepForm";
import AnalyzingScreen from "@/components/AnalyzingScreen";
import ResultsScreen, { type DiagnosisResult } from "@/components/ResultsScreen";
import { toast } from "sonner";

type Screen = "landing" | "form" | "analyzing" | "results";

const SCREEN_KEY = "skc-current-screen";
const RESULT_KEY = "skc-diagnosis-result";
const FORM_DATA_KEY = "skc-form-data";
const FORM_STEP_KEY = "skc-form-step";

const Index = () => {
  const [screen, setScreen] = useState<Screen>(() => {
    const savedScreen = localStorage.getItem(SCREEN_KEY);
    const savedResult = localStorage.getItem(RESULT_KEY);

    // If we were on results and we have the result data, stay there
    if (savedScreen === "results" && savedResult) {
      try {
        JSON.parse(savedResult);
        return "results";
      } catch { /* corrupted result, fall back */ }
    }

    // If we were on the form or analyzing, go to form
    // (If analyzing, the request was lost, so we go back to form to re-submit)
    if (savedScreen === "form" || savedScreen === "analyzing") {
      return "form";
    }

    try {
      const savedData = localStorage.getItem(FORM_DATA_KEY);
      const savedStep = localStorage.getItem(FORM_STEP_KEY);
      
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

  const [result, setResult] = useState<DiagnosisResult | null>(() => {
    try {
      const savedResult = localStorage.getItem(RESULT_KEY);
      return savedResult ? JSON.parse(savedResult) : null;
    } catch {
      return null;
    }
  });

  // Persist screen state
  useEffect(() => {
    localStorage.setItem(SCREEN_KEY, screen);
  }, [screen]);

  // Persist result state
  useEffect(() => {
    if (result) {
      localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    } else {
      localStorage.removeItem(RESULT_KEY);
    }
  }, [result]);

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

      // Small delay for the "analyzing" feel
      await new Promise((r) => setTimeout(r, 2000));
      
      // Clear form data once we have successfully received results
      localStorage.removeItem(FORM_DATA_KEY);
      localStorage.removeItem(FORM_STEP_KEY);
      
      setResult(res as DiagnosisResult);
      setScreen("results");
    } catch {
      toast.error("Failed to connect. Please try again.");
      setScreen("form");
    }
  };

  const restart = () => {
    localStorage.removeItem(SCREEN_KEY);
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(FORM_DATA_KEY);
    localStorage.removeItem(FORM_STEP_KEY);
    localStorage.removeItem("skc-checklist-state");
    setResult(null);
    setScreen("landing");
  };

  return (
    <>
      {screen === "landing" && <LandingScreen onStart={() => setScreen("form")} />}
      {screen === "form" && <StepForm onSubmit={handleSubmit} onBack={() => {
        restart(); // Going back from first step clears everything
      }} />}
      {screen === "analyzing" && <AnalyzingScreen />}
      {screen === "results" && result && <ResultsScreen result={result} onRestart={restart} />}
    </>
  );
};

export default Index;
