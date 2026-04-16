import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const lines: string[] = [];
    if (body.revenue_trend) lines.push(`Revenue trend: ${body.revenue_trend}`);
    if (body.growth_speed) lines.push(`Growth speed: ${body.growth_speed}`);
    if (body.team_motivation) lines.push(`Team motivation: ${body.team_motivation}`);
    if (body.team_stability) lines.push(`Team stability: ${body.team_stability}`);
    if (body.team_feedback) lines.push(`Team feedback openness: ${body.team_feedback}`);
    if (body.team_ownership) lines.push(`Team ownership: ${body.team_ownership}`);
    if (body.process_clarity) lines.push(`Process clarity: ${body.process_clarity}`);
    if (body.firefighting_frequency) lines.push(`Firefighting frequency: ${body.firefighting_frequency}`);
    if (body.priority_management) lines.push(`Priority management: ${body.priority_management}`);
    if (body.founder_dependency) lines.push(`Founder dependency: ${body.founder_dependency}`);
    if (body.delegation_level) lines.push(`Delegation level: ${body.delegation_level}`);
    if (body.decision_making) lines.push(`Decision-making style: ${body.decision_making}`);
    if (body.vision_clarity) lines.push(`Vision clarity: ${body.vision_clarity}`);
    if (body.daily_routine) lines.push(`Daily routine structure: ${body.daily_routine}`);
    if (body.stress_level) lines.push(`Stress level: ${body.stress_level}`);
    if (body.emotional_control) lines.push(`Emotional control: ${body.emotional_control}`);
    if (body.situation) lines.push(`\nAdditional context: ${body.situation}`);

    if (lines.length === 0) {
      return new Response(JSON.stringify({ error: "Please complete the form." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = lines.join("\n");

    const systemPrompt = `You are a reflective, observational advisor using the Conscious Entrepreneurship framework by SKC.World.

Your role is NOT to instruct, judge, or prescribe. You are here to observe, reflect, and invite examination.

Analyze the founder's inputs. Be honest but gentle. Be specific but never directive. Use simple language (grade 6-8 reading level). Short sentences.

CRITICAL TONE RULES:
- Observational, not prescriptive
- Recognition-led, not teaching
- Calm, spacious, non-urgent
- No harsh or directive language
- No consulting jargon

NEVER USE:
- "You should..."
- "You need to..."
- "Fix this..."
- "Your problem is..."
- "You will fail"
- "You lack..."

ALWAYS USE language like:
- "There are moments where..."
- "It may appear that..."
- "One possible pattern could be..."
- "This may be worth examining..."
- "It seems as though..."

Two axes:
- Execution Energy (0-100): movement and action in the system - growth, sales, action, output
- Alignment Energy (0-100): clarity, direction, and shared understanding in the system

State mapping:
- High Execution (>60) + Low Alignment (<40) -> Burnout
- Low Execution (<40) + Low Alignment (<40) -> Survival
- Low Execution (<40) + High Alignment (>60) -> Stagnation
- High Execution (>60) + High Alignment (>60) -> Success | Scale | Joy
- Mixed -> use best judgment

Identity mapping:
- Burnout -> "The Overloaded Operator"
- Survival -> "The Stuck Dreamer"
- Stagnation -> "The Comfortable Drifter"
- Success | Scale | Joy -> "The Aligned Scaler"

Requirements:
- 3 observations about what may be noticed (observational, reflective - NOT instructive)
- 3-4 areas that may be unresolved with type and description. Use types: "Vision Gap", "Systems Gap", "Energy Gap", "Culture Gap". Descriptions should be gentle reflections, not diagnoses.
- Areas to examine with 3 levels: Level 1 (Begin Here), Level 2 (Build On This), Level 3 (Go Deeper). Each has:
  - name: simple, clear - an invitation not an instruction
  - objective: one observational sentence
  - action: max 2 gentle, doable explorations. Not commands.
  - reward: the positive shift that may emerge
- "What this may mean": a constructive, reflective summary (2-3 sentences). Frame as observation. Acknowledge what appears to be working, gently note what could evolve, and end with an invitation. NO fear tactics. NO urgency.
- Path forward: 3 simple, clear invitations to examine - not directives

Keep everything human, simple, and reflective. The user should feel seen, not judged.`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "diagnose_business",
              description: "Return structured business reflection",
              parameters: {
                type: "object",
                properties: {
                  state: { type: "string", enum: ["Burnout", "Survival", "Stagnation", "Success | Scale | Joy"] },
                  identity: { type: "string", enum: ["The Overloaded Operator", "The Stuck Dreamer", "The Comfortable Drifter", "The Aligned Scaler"] },
                  entrepreneurship_score: { type: "number", description: "Execution Energy score (0-100)" },
                  consciousness_score: { type: "number", description: "Alignment Energy score (0-100)" },
                  insights: { type: "array", items: { type: "string" }, description: "3 observational reflections using language like 'It may appear that...' or 'There are moments where...'" },
                  business_leaks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", description: "One of: Vision Gap, Systems Gap, Energy Gap, Culture Gap" },
                        description: { type: "string", description: "Gentle, reflective description - not a diagnosis" },
                      },
                      required: ["type", "description"],
                      additionalProperties: false,
                    },
                  },
                  quest_chain: {
                    type: "array",
                    description: "3 areas to examine: Level 1 (Begin Here), Level 2 (Build On This), Level 3 (Go Deeper). Use invitational language.",
                    items: {
                      type: "object",
                      properties: {
                        level: { type: "number" },
                        name: { type: "string", description: "Invitational name like 'Examine What Drives Decisions' or 'Notice Where Energy Flows'" },
                        objective: { type: "string" },
                        action: { type: "string", description: "Max 2 gentle, exploratory actions - not commands" },
                        reward: { type: "string" },
                      },
                      required: ["level", "name", "objective", "action", "reward"],
                      additionalProperties: false,
                    },
                  },
                  future_warning: { type: "string", description: "Reflective, observational summary. NO fear tactics. Use 'It may appear...' language." },
                  path_to_success_scale_joy: { type: "array", items: { type: "string" }, description: "3 simple invitations to examine - not directives" },
                },
                required: ["state", "identity", "entrepreneurship_score", "consciousness_score", "insights", "business_leaks", "quest_chain", "future_warning", "path_to_success_scale_joy"],
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
    
    // Normalize: Gemini sometimes returns path_to_ssj instead of path_to_success_scale_joy
    if (diagnosis.path_to_ssj && !diagnosis.path_to_success_scale_joy) {
      diagnosis.path_to_success_scale_joy = diagnosis.path_to_ssj;
      delete diagnosis.path_to_ssj;
    }
    
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
