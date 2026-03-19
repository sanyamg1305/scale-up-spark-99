import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { situation } = await req.json();
    if (!situation || typeof situation !== "string") {
      return new Response(JSON.stringify({ error: "Please describe your business situation." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a business diagnostic AI. Analyze the founder's business situation and return a JSON object with exactly this structure:

{
  "state": "Burnout" | "Survival Stagnation" | "Success, Scale & Joy",
  "entrepreneurship_score": <number 0-100>,
  "consciousness_score": <number 0-100>,
  "problems": [<string>, <string>, ...],
  "open_loop": "<main missing system>",
  "next_move": "<clear actionable step>"
}

Scoring rules:
- Entrepreneurship Score: Based on ambition, growth trajectory, action-taking, revenue signals
- Consciousness Score: Based on purpose clarity, team alignment, self-awareness, systems thinking

State mapping:
- High Entrepreneurship (>60) + Low Consciousness (<40) → Burnout
- Both Low (<40) → Survival Stagnation
- Both High (>60) → Success, Scale & Joy
- Mixed scores → use judgment based on context

Keep problems to 2-4 bullet points. Be concise, practical, founder-friendly. No jargon.`;

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
          { role: "user", content: situation },
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
                  problems: { type: "array", items: { type: "string" } },
                  open_loop: { type: "string" },
                  next_move: { type: "string" },
                },
                required: ["state", "entrepreneurship_score", "consciousness_score", "problems", "open_loop", "next_move"],
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
