import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingScreen from "@/components/LandingScreen";
import StepForm, { type FormData } from "@/components/StepForm";
import AnalyzingScreen from "@/components/AnalyzingScreen";
import ResultsScreen, { type DiagnosisResult } from "@/components/ResultsScreen";
import { toast } from "sonner";
import { STORAGE_KEYS } from "@/lib/constants";

type Screen = "landing" | "form" | "analyzing" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const savedScreen = localStorage.getItem(STORAGE_KEYS.SCREEN);
      const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);

      // If we were on results and we have the result data, stay there
      if (savedScreen === "results" && savedResult) {
        try {
          JSON.parse(savedResult);
          return "results";
        } catch { /* corrupted result, fall back */ }
      }

      // If we were on the form or analyzing, go back to form
      if (savedScreen === "form" || savedScreen === "analyzing") {
        return "form";
      }

      const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const savedStep = localStorage.getItem(STORAGE_KEYS.FORM_STEP);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const hasData = Object.values(parsed).some((v) => v !== "");
          if (hasData) return "form";
        } catch { /* ignore */ }
      }
      if (savedStep && parseInt(savedStep, 10) > 0) {
        return "form";
      }
    } catch (e) {
      console.error("LocalStorage error on init:", e);
    }
    return "landing";
  });

  const [result, setResult] = useState<DiagnosisResult | null>(() => {
    try {
      const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);
      return savedResult ? JSON.parse(savedResult) : null;
    } catch {
      return null;
    }
  });

  // Persist screen state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCREEN, screen);
    } catch (e) {
      console.error("Failed to save screen state:", e);
    }
  }, [screen]);

  // Persist result state
  useEffect(() => {
    try {
      if (result) {
        localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESULT);
      }
    } catch (e) {
      console.error("Failed to save result state:", e);
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
      try {
        localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
        localStorage.removeItem(STORAGE_KEYS.FORM_STEP);
      } catch { /* ignore */ }
      
      setResult(res as DiagnosisResult);
      setScreen("results");
    } catch {
      toast.error("Failed to connect. Please try again.");
      setScreen("form");
    }
  };

  const restart = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SCREEN);
      localStorage.removeItem(STORAGE_KEYS.RESULT);
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.FORM_STEP);
      localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
    } catch { /* ignore */ }
    setResult(null);
    setScreen("landing");
  };

  return (
    <>
      {screen === "landing" && <LandingScreen onStart={() => setScreen("form")} />}
      {screen === "form" && (
        <StepForm 
          onSubmit={handleSubmit} 
          onBack={() => setScreen("landing")} // No longer calling restart() here
        />
      )}
      {screen === "analyzing" && <AnalyzingScreen />}
      {screen === "results" && result && (
        <ResultsScreen result={result} onRestart={restart} />
      )}
    </>
  );
};

export default Index;
