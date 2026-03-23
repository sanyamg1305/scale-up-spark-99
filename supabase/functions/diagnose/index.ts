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

    // Build context from structured inputs
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
    if (body.team_alignment) lines.push(`Team alignment with vision: ${body.team_alignment}`);
    if (body.founder_emotional_state) lines.push(`Founder emotional state: ${body.founder_emotional_state}`);
    if (body.situation) lines.push(`\nAdditional context: ${body.situation}`);

    if (lines.length === 0) {
      return new Response(JSON.stringify({ error: "Please complete the form." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = lines.join("\n");

    const systemPrompt = `You are a business diagnostic engine based on the Conscious Entrepreneurship framework.

Analyze the user's business inputs and return structured output.

Scoring rules:
- Entrepreneurship Score (0-100): Based on revenue trend, growth speed, action-taking, execution
- Consciousness Score (0-100): Based on vision clarity, team alignment, founder emotional state, purpose

State mapping:
- High Entrepreneurship (>60) + Low Consciousness (<40) → Burnout
- Both Low (<40) → Survival Stagnation
- Both High (>60) → Success, Scale & Joy
- Mixed → use judgment

Requirements:
- 3 key insights (short bullet points about what's happening)
- 2-4 open loops (missing systems like "Delegation System", "Culture Alignment")
- 3 gamified quests with name, objective, action (specific), reward (business outcome)

Be concise, actionable, founder-friendly. No jargon.`;

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
                  state: { type: "string", enum: ["Burnout", "Survival Stagnation", "Success, Scale & Joy"] },
                  entrepreneurship_score: { type: "number" },
                  consciousness_score: { type: "number" },
                  insights: { type: "array", items: { type: "string" } },
                  open_loops: { type: "array", items: { type: "string" } },
                  quests: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        objective: { type: "string" },
                        action: { type: "string" },
                        reward: { type: "string" },
                      },
                      required: ["name", "objective", "action", "reward"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["state", "entrepreneurship_score", "consciousness_score", "insights", "open_loops", "quests"],
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
