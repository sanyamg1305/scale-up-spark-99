import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingScreen from "@/components/LandingScreen";
import StepForm, { type FormData } from "@/components/StepForm";
import AnalyzingScreen from "@/components/AnalyzingScreen";
import ResultsScreen, { type DiagnosisResult } from "@/components/ResultsScreen";
import { toast } from "sonner";
import { STORAGE_KEYS } from "@/lib/constants";

type Screen = "landing" | "form" | "analyzing" | "results";

const isString = (value: unknown): value is string => typeof value === "string";

const normalizeState = (value: unknown) => {
  if (value === "SSJ" || value === "Success | State | Joy") {
    return "Success | Scale | Joy";
  }

  return isString(value) ? value : "Burnout";
};

const normalizeDiagnosisResult = (value: unknown): DiagnosisResult | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const payload =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const state = normalizeState(payload.state);
  const fallbackIdentity =
    state === "Survival"
      ? "The Stuck Dreamer"
      : state === "Stagnation"
        ? "The Comfortable Drifter"
        : state === "Success | Scale | Joy"
          ? "The Aligned Scaler"
          : "The Overloaded Operator";

  const businessLeaks = Array.isArray(payload.business_leaks)
    ? payload.business_leaks
        .map((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            isString((item as { type?: unknown }).type) &&
            isString((item as { description?: unknown }).description)
          ) {
            const leak = item as { type: string; description: string };
            return { type: leak.type, description: leak.description };
          }

          return null;
        })
        .filter((item): item is DiagnosisResult["business_leaks"][number] => item !== null)
    : [];

  const questChain = Array.isArray(payload.quest_chain)
    ? payload.quest_chain
        .map((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            typeof (item as { level?: unknown }).level === "number" &&
            isString((item as { name?: unknown }).name) &&
            isString((item as { objective?: unknown }).objective) &&
            isString((item as { action?: unknown }).action) &&
            isString((item as { reward?: unknown }).reward)
          ) {
            const quest = item as DiagnosisResult["quest_chain"][number];
            return {
              level: quest.level,
              name: quest.name,
              objective: quest.objective,
              action: quest.action,
              reward: quest.reward,
            };
          }

          return null;
        })
        .filter((item): item is DiagnosisResult["quest_chain"][number] => item !== null)
    : [];

  const pathToSuccessScaleJoy = (
    Array.isArray(payload.path_to_success_scale_joy)
      ? payload.path_to_success_scale_joy
      : Array.isArray(payload.path_to_ssj)
        ? payload.path_to_ssj
        : []
  ).filter(isString);

  return {
    state,
    identity: isString(payload.identity) ? payload.identity : fallbackIdentity,
    entrepreneurship_score:
      typeof payload.entrepreneurship_score === "number" ? payload.entrepreneurship_score : 0,
    consciousness_score:
      typeof payload.consciousness_score === "number" ? payload.consciousness_score : 0,
    insights: Array.isArray(payload.insights) ? payload.insights.filter(isString) : [],
    business_leaks: businessLeaks,
    quest_chain: questChain,
    future_warning: isString(payload.future_warning) ? payload.future_warning : "",
    path_to_success_scale_joy: pathToSuccessScaleJoy,
  };
};

const Index = () => {
  const [result, setResult] = useState<DiagnosisResult | null>(() => {
    try {
      const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);
      return savedResult ? normalizeDiagnosisResult(JSON.parse(savedResult)) : null;
    } catch {
      return null;
    }
  });

  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const savedScreen = localStorage.getItem(STORAGE_KEYS.SCREEN);
      const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);

      // SOURCE OF TRUTH: If we have a result, we should show the results screen
      // regardless of what the screen key says (unless it's explicitly been cleared)
      if (savedResult) {
        try {
          const normalizedResult = normalizeDiagnosisResult(JSON.parse(savedResult));
          if (normalizedResult) return "results";
        } catch { /* corrupted result, fall back */ }
      }

      // If we were analyzing, we lost the connection, so go back to form
      // but don't worry, the form data is still in localStorage
      if (savedScreen === "analyzing" || savedScreen === "form") {
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
        toast.error(error.message || "Analysis failed. Please try again.");
        setScreen("form");
        return;
      }

      if (res?.error) {
        toast.error(res.error);
        setScreen("form");
        return;
      }

      // Small delay for the "analyzing" feel
      await new Promise((r) => setTimeout(r, 1500));
      
      const normalizedResult = normalizeDiagnosisResult(res);

      if (!normalizedResult) {
        toast.error("The reflection could not be loaded. Please try again.");
        setScreen("form");
        return;
      }

      // Note: We NO LONGER clear form data here.
      // We keep it until the user clicks "Begin Another Reflection"

      setResult(normalizedResult);
      setScreen("results");
    } catch {
      toast.error("Failed to connect. Please check your connection and try again.");
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
    <div className="min-h-screen bg-background text-foreground">
      {screen === "landing" && <LandingScreen onStart={() => setScreen("form")} />}
      {screen === "form" && (
        <StepForm 
          onSubmit={handleSubmit} 
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "analyzing" && <AnalyzingScreen />}
      {screen === "results" && result ? (
        <ResultsScreen result={result} onRestart={restart} />
      ) : screen === "results" ? (
        // Fallback if we somehow ended up on the results screen without a result
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No result found. Please try the reflection again.</p>
            <button onClick={restart} className="text-primary hover:underline">Return to start</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
