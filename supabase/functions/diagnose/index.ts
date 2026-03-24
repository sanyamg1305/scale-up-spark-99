import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const lines: string[] = [];
    if (body.revenue_trend) lines.push(`Revenue trend: ${body.revenue_trend}`);
    if (body.growth_speed) lines.push(`Growth speed: ${body.growth_speed}`);
    if (body.team_motivation) lines.push(`Team motivation: ${body.team_motivation}`);
    if (body.team_stability) lines.push(`Team stability: ${body.team_stability}`);
    if (body.process_clarity) lines.push(`Process clarity: ${body.process_clarity}`);
    if (body.firefighting_frequency) lines.push(`Firefighting frequency: ${body.firefighting_frequency}`);
    if (body.founder_dependency) lines.push(`Founder dependency: ${body.founder_dependency}`);
    if (body.delegation_level) lines.push(`Delegation level: ${body.delegation_level}`);
    if (body.vision_clarity) lines.push(`Vision clarity: ${body.vision_clarity}`);
    if (body.stress_level) lines.push(`Stress level: ${body.stress_level}`);
    if (body.emotional_control) lines.push(`Emotional control: ${body.emotional_control}`);
    if (body.situation) lines.push(`\nAdditional context: ${body.situation}`);

    if (lines.length === 0) {
      return new Response(JSON.stringify({ error: "Please complete the form." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = lines.join("\n");

    const systemPrompt = `You are a sharp, brutally honest business strategist using the Conscious Entrepreneurship framework.

Analyze the founder's inputs. Be direct, confrontational, and specific — not generic.

Two axes:
- Entrepreneurship Quotient (0-100): execution, action, growth, revenue momentum
- Consciousness Quotient (0-100): purpose, clarity, alignment, emotional state

State mapping:
- High E (>60) + Low C (<40) → Burnout
- Low E (<40) + Low C (<40) → Survival
- Low E (<40) + High C (>60) → Stagnation
- High E (>60) + High C (>60) → SSJ
- Mixed → use best judgment

Identity mapping:
- Burnout → "The Overloaded Operator"
- Survival → "The Stuck Dreamer"
- Stagnation → "The Comfortable Drifter"
- SSJ → "The Aligned Scaler"

Requirements:
- 3 brutal reality insights (sharp, honest, slightly confrontational — NOT generic)
- 3-4 business leaks with type and description (Vision Leak, System Leak, Energy Leak, Culture Leak, etc.)
- Quest chain with 3 levels: Level 1 (Immediate fix), Level 2 (Structure), Level 3 (Alignment). Each has name, objective, action (very specific), reward (business outcome)
- Future warning: what happens if nothing changes (2-3 sentences, scary but true)
- Path to SSJ: 3 specific directives to reach SSJ state

Be concise, actionable, founder-friendly. No jargon. Be brutally honest.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "diagnose_business",
              description: "Return structured business diagnosis",
              parameters: {
                type: "object",
                properties: {
                  state: { type: "string", enum: ["Burnout", "Survival", "Stagnation", "SSJ"] },
                  identity: { type: "string", enum: ["The Overloaded Operator", "The Stuck Dreamer", "The Comfortable Drifter", "The Aligned Scaler"] },
                  entrepreneurship_score: { type: "number" },
                  consciousness_score: { type: "number" },
                  insights: { type: "array", items: { type: "string" }, description: "3 brutal reality lines" },
                  business_leaks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["type", "description"],
                      additionalProperties: false,
                    },
                  },
                  quest_chain: {
                    type: "array",
                    description: "3 quests: Level 1 (Immediate), Level 2 (Structure), Level 3 (Alignment)",
                    items: {
                      type: "object",
                      properties: {
                        level: { type: "number" },
                        name: { type: "string" },
                        objective: { type: "string" },
                        action: { type: "string" },
                        reward: { type: "string" },
                      },
                      required: ["level", "name", "objective", "action", "reward"],
                      additionalProperties: false,
                    },
                  },
                  future_warning: { type: "string" },
                  path_to_ssj: { type: "array", items: { type: "string" }, description: "3 specific directives" },
                },
                required: ["state", "identity", "entrepreneurship_score", "consciousness_score", "insights", "business_leaks", "quest_chain", "future_warning", "path_to_ssj"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "diagnose_business" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI did not return structured output" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const diagnosis = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("diagnose error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
