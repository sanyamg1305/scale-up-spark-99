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

    const systemPrompt = `You are a supportive, clear-thinking business advisor using the Conscious Entrepreneurship framework.

Analyze the founder's inputs. Be honest but kind. Be specific, not generic. Use simple language (grade 6-8 reading level). Short sentences. No jargon.

Tone rules:
- Supportive, calm, guiding - like a helpful advisor, NOT a harsh critic
- Use phrases like "It seems like…", "You might be experiencing…", "Here's what could help…"
- NEVER use fear-based language, harsh absolutes, or aggressive confrontation
- NEVER say "you will fail", "you're hiding", "you'll be stuck"
- Be constructive and encouraging while still being honest

Two axes:
- Execution Energy (0-100): how strongly the business is pushing forward - growth, sales, action, output
- Alignment Energy (0-100): how aligned the team, culture, and vision are - clarity, purpose, direction

State mapping:
- High Execution (>60) + Low Alignment (<40) → Burnout
- Low Execution (<40) + Low Alignment (<40) → Survival
- Low Execution (<40) + High Alignment (>60) → Stagnation
- High Execution (>60) + High Alignment (>60) → SSJ (Success | Scale | Joy)
- Mixed → use best judgment

Identity mapping:
- Burnout → "The Overloaded Operator"
- Survival → "The Stuck Dreamer"
- Stagnation → "The Comfortable Drifter"
- SSJ → "The Aligned Scaler"

Requirements:
- 3 insights about what's happening (honest but supportive, constructive - NOT harsh or confrontational)
- 3-4 areas that need attention with type and description. Use these types: "Vision Gap", "Systems Gap", "Energy Gap", "Culture Gap". Descriptions should be simple and helpful.
- Next steps with 3 levels: Level 1 (Start Here), Level 2 (Build On This), Level 3 (Go Deeper). Each has:
  - name: simple, clear title a founder instantly understands (e.g. "Make Sales Repeatable", "Build a Team That Runs Without You", "Clarify What You Actually Do")
  - objective: one simple sentence
  - action: max 2 very simple, doable steps. No overload.
  - reward: the positive business outcome
- "What this means for you": a constructive, encouraging summary (2-3 sentences). Frame positively - acknowledge what's working, gently note what could improve, and end with encouragement. NO fear tactics.
- Path forward: 3 simple, clear directives to reach aligned growth

Keep everything human, simple, and actionable.`;

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
                  entrepreneurship_score: { type: "number", description: "Execution Energy score (0-100)" },
                  consciousness_score: { type: "number", description: "Alignment Energy score (0-100)" },
                  insights: { type: "array", items: { type: "string" }, description: "3 supportive, honest observations" },
                  business_leaks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", description: "One of: Vision Gap, Systems Gap, Energy Gap, Culture Gap" },
                        description: { type: "string" },
                      },
                      required: ["type", "description"],
                      additionalProperties: false,
                    },
                  },
                  quest_chain: {
                    type: "array",
                    description: "3 next steps: Level 1 (Start Here), Level 2 (Build On This), Level 3 (Go Deeper). Use simple, clear names.",
                    items: {
                      type: "object",
                      properties: {
                        level: { type: "number" },
                        name: { type: "string", description: "Simple title like 'Make Sales Repeatable' or 'Build a Team That Runs Without You'" },
                        objective: { type: "string" },
                        action: { type: "string", description: "Max 2 simple, doable steps" },
                        reward: { type: "string" },
                      },
                      required: ["level", "name", "objective", "action", "reward"],
                      additionalProperties: false,
                    },
                  },
                  future_warning: { type: "string", description: "Constructive, encouraging summary of what this means. NO fear tactics." },
                  path_to_ssj: { type: "array", items: { type: "string" }, description: "3 simple, clear directives" },
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
