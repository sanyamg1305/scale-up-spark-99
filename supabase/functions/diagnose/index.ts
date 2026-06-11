import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Diagnosis = {
  state: "Burnout" | "Survival" | "Stagnation" | "Success | Scale | Joy";
  identity: "The Overloaded Operator" | "The Stuck Dreamer" | "The Comfortable Drifter" | "The Aligned Scaler";
  entrepreneurship_score: number;
  consciousness_score: number;
  insights: string[];
  business_leaks: { type: string; description: string }[];
  quest_chain: { level: number; name: string; objective: string; action: string; reward: string }[];
  future_warning: string;
  path_to_success_scale_joy: string[];
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const normalizeText = (value: unknown) => String(value ?? "").trim().toLowerCase();

const scoreFromText = (value: unknown, positiveWords: string[], negativeWords: string[]) => {
  const text = normalizeText(value);
  if (!text) return 0;

  let score = 0;
  for (const word of positiveWords) {
    if (text.includes(word)) score += 1;
  }
  for (const word of negativeWords) {
    if (text.includes(word)) score -= 1;
  }

  return score;
};

const buildFallbackDiagnosis = (body: Record<string, unknown>): Diagnosis => {
  const executionSignals = [
    scoreFromText(body.revenue_trend, ["growing", "strong", "up", "improving", "healthy", "steady"], ["declin", "down", "weak", "stalled", "flat", "slow"]),
    scoreFromText(body.growth_speed, ["fast", "strong", "quick", "accelerating"], ["slow", "stuck", "unclear", "lagging"]),
    scoreFromText(body.process_clarity, ["clear", "structured", "consistent"], ["unclear", "messy", "chaotic", "reactive"]),
    scoreFromText(body.firefighting_frequency, ["rare", "low", "seldom"], ["often", "frequent", "daily", "constant"]),
    scoreFromText(body.priority_management, ["clear", "focused", "steady"], ["scattered", "reactive", "unclear", "changing"]),
    scoreFromText(body.delegation_level, ["high", "shared", "strong"], ["low", "limited", "founder"]),
  ];

  const alignmentSignals = [
    scoreFromText(body.team_motivation, ["high", "strong", "energized", "engaged"], ["low", "tired", "flat", "drained"]),
    scoreFromText(body.team_stability, ["stable", "strong", "consistent"], ["mixed", "unstable", "fragile", "turnover"]),
    scoreFromText(body.team_feedback, ["open", "honest", "healthy"], ["guarded", "closed", "avoided"]),
    scoreFromText(body.team_ownership, ["high", "shared", "strong"], ["low", "limited", "unclear"]),
    scoreFromText(body.founder_dependency, ["low", "shared", "distributed"], ["high", "central", "dependent"]),
    scoreFromText(body.decision_making, ["clear", "shared", "calm"], ["bottleneck", "reactive", "unclear"]),
    scoreFromText(body.vision_clarity, ["clear", "strong", "shared"], ["unclear", "fuzzy", "mixed"]),
    scoreFromText(body.daily_routine, ["clear", "steady", "structured"], ["chaotic", "reactive", "scattered"]),
    scoreFromText(body.stress_level, ["low", "managed", "steady"], ["high", "overwhelming", "constant"]),
    scoreFromText(body.emotional_control, ["steady", "calm", "grounded"], ["reactive", "strained", "volatile"]),
  ];

  const entrepreneurship_score = clamp(50 + executionSignals.reduce((sum, value) => sum + value, 0) * 8);
  const consciousness_score = clamp(50 + alignmentSignals.reduce((sum, value) => sum + value, 0) * 6);

  const state: Diagnosis["state"] = entrepreneurship_score > 60 && consciousness_score < 40
    ? "Burnout"
    : entrepreneurship_score < 40 && consciousness_score < 40
      ? "Survival"
      : entrepreneurship_score < 40 && consciousness_score > 60
        ? "Stagnation"
        : entrepreneurship_score > 60 && consciousness_score > 60
          ? "Success | Scale | Joy"
          : entrepreneurship_score >= consciousness_score
            ? "Burnout"
            : "Stagnation";

  const identityByState: Record<Diagnosis["state"], Diagnosis["identity"]> = {
    Burnout: "The Overloaded Operator",
    Survival: "The Stuck Dreamer",
    Stagnation: "The Comfortable Drifter",
    "Success | Scale | Joy": "The Aligned Scaler",
  };

  const insightsByState: Record<Diagnosis["state"], string[]> = {
    Burnout: [
      "There are moments where movement appears strong, yet the weight of keeping everything moving may still sit close to you.",
      "It may appear that progress is happening alongside a steady pull toward reaction rather than reflection.",
      "One possible pattern could be that the business is producing energy, while clarity is finding it harder to keep pace.",
    ],
    Survival: [
      "There are moments where both momentum and clarity may be asking for more steadiness than the system can currently hold.",
      "It seems as though a lot of attention may be going toward getting through the day, rather than shaping what comes next.",
      "One possible pattern could be that the business is carrying effort, though not yet receiving enough structure back from that effort.",
    ],
    Stagnation: [
      "It may appear that there is thoughtfulness in the system, though movement may not yet be meeting that clarity.",
      "There are moments where people may understand what matters, while action still feels slower or more cautious than expected.",
      "One possible pattern could be that the business has signal and awareness, yet energy is not consistently converting into traction.",
    ],
    "Success | Scale | Joy": [
      "It seems as though clarity and motion may be supporting each other more often than competing with each other.",
      "There are moments where the system appears able to move without asking one person to hold every thread at once.",
      "One possible pattern could be that the business is beginning to create progress with more coherence and less internal friction.",
    ],
  };

  const leaksByState: Record<Diagnosis["state"], Diagnosis["business_leaks"]> = {
    Burnout: [
      { type: "Systems Gap", description: "It may appear that output is asking the current systems to carry more than they were designed to hold." },
      { type: "Energy Gap", description: "There are moments where the business seems to rely on personal intensity more than sustainable rhythm." },
      { type: "Culture Gap", description: "Shared ownership may be present in parts, though it may not yet feel evenly distributed." },
    ],
    Survival: [
      { type: "Vision Gap", description: "Clarity around the next horizon may feel harder to access while immediate pressures stay loud." },
      { type: "Systems Gap", description: "Some of the strain may come from essentials still living in memory, urgency, or personal oversight." },
      { type: "Energy Gap", description: "The available energy in the system may be going toward protection more than forward movement." },
    ],
    Stagnation: [
      { type: "Vision Gap", description: "The vision may be understood, though it may not yet be turning into strong shared motion." },
      { type: "Systems Gap", description: "There are moments where structure looks present, yet not fully alive in day-to-day behavior." },
      { type: "Culture Gap", description: "Ownership may be understood conceptually, while confidence to act may still be uneven." },
    ],
    "Success | Scale | Joy": [
      { type: "Systems Gap", description: "As the system grows, some parts may still be adjusting to a wider pace and higher trust." },
      { type: "Culture Gap", description: "There may be an opportunity to keep reinforcing shared ownership as complexity increases." },
      { type: "Vision Gap", description: "Even in a healthy state, it may be worth noticing where the next layer of clarity wants to emerge." },
    ],
  };

  const quest_chain: Diagnosis["quest_chain"] = [
    {
      level: 1,
      name: "Begin Here",
      objective: "Notice where the business is asking for steadiness before more speed.",
      action: "Take a quiet look at where decisions, updates, or approvals tend to bottleneck. Notice what repeats most often in a week.",
      reward: "A clearer sense of where pressure may actually be coming from.",
    },
    {
      level: 2,
      name: "Build On This",
      objective: "Observe how clarity is currently shared across people, priorities, and routines.",
      action: "Review where expectations feel clear and where they still depend on interpretation. Notice what becomes easier when ownership is named more clearly.",
      reward: "More visible alignment between intention and execution.",
    },
    {
      level: 3,
      name: "Go Deeper",
      objective: "Examine what kind of leadership rhythm the current stage of the business may be asking for.",
      action: "Look at what still depends heavily on your presence. Reflect on what may be ready to become shared, simpler, or more consistent.",
      reward: "A stronger path toward scale with less strain.",
    },
  ];

  const futureByState: Record<Diagnosis["state"], string> = {
    Burnout: "It may appear that the business carries real movement, though that movement may still come with a cost that is felt quietly behind the scenes. What is working may be real. What is tiring may also be real. This may be worth examining with care.",
    Survival: "It seems as though the system may be working hard to hold itself together before it can fully open into growth. There may already be important strengths here. They may simply need more space, sequence, and steadiness to become visible.",
    Stagnation: "It may appear that understanding is present, while momentum is arriving more slowly than the vision suggests. Something valuable may already be here. This may be an invitation to notice what would help energy move with more confidence.",
    "Success | Scale | Joy": "It seems as though the business may be entering a more coherent season, where clarity and momentum can support each other. What is working may deserve to be protected as complexity grows. This may be a useful moment to notice what wants to mature next.",
  };

  const pathByState: Record<Diagnosis["state"], string[]> = {
    Burnout: [
      "Notice where pace may be outrunning clarity.",
      "Examine what still depends on your constant intervention.",
      "Look for the places where shared ownership may want more structure.",
    ],
    Survival: [
      "Notice what most often pulls attention away from longer-range clarity.",
      "Examine which routines feel dependable and which still feel improvised.",
      "Look for small signs of energy that could become stable momentum.",
    ],
    Stagnation: [
      "Notice where clarity is present but action still feels hesitant.",
      "Examine how priorities move from intention into daily rhythm.",
      "Look for places where confidence and ownership may want more reinforcement.",
    ],
    "Success | Scale | Joy": [
      "Notice what is helping momentum feel sustainable.",
      "Examine which patterns are creating trust across the system.",
      "Look for what wants to evolve before strain quietly returns.",
    ],
  };

  return {
    state,
    identity: identityByState[state],
    entrepreneurship_score,
    consciousness_score,
    insights: insightsByState[state],
    business_leaks: leaksByState[state],
    quest_chain,
    future_warning: futureByState[state],
    path_to_success_scale_joy: pathByState[state],
  };
};

const extractDiagnosis = async (response: Response): Promise<Diagnosis | null> => {
  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (toolCall?.function?.arguments) {
    return JSON.parse(toolCall.function.arguments) as Diagnosis;
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    try {
      return JSON.parse(content) as Diagnosis;
    } catch {
      return null;
    }
  }

  if (Array.isArray(content)) {
    const textPart = content.find((item) => item?.type === "text" && typeof item.text === "string");
    if (textPart?.text) {
      try {
        return JSON.parse(textPart.text) as Diagnosis;
      } catch {
        return null;
      }
    }
  }

  return null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
      const body = await req.json();
      const fallbackDiagnosis = buildFallbackDiagnosis(body as Record<string, unknown>);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
        if (response.status === 429 || response.status === 402) {
          return new Response(JSON.stringify(fallbackDiagnosis), {
            headers: { ...corsHeaders, "Content-Type": "application/json", "X-Diagnosis-Fallback": "true" },
          });
        }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
        return new Response(JSON.stringify(fallbackDiagnosis), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Diagnosis-Fallback": "true" },
      });
    }

      const diagnosis = await extractDiagnosis(response) ?? fallbackDiagnosis;

    if (diagnosis.state === "SSJ" || diagnosis.state === "Success | State | Joy") {
      diagnosis.state = "Success | Scale | Joy";
    }

    // Normalize: Gemini sometimes returns path_to_ssj instead of path_to_success_scale_joy
    if (Array.isArray(diagnosis.path_to_ssj) && !diagnosis.path_to_success_scale_joy) {
      diagnosis.path_to_success_scale_joy = diagnosis.path_to_ssj;
    }

    if (!Array.isArray(diagnosis.path_to_success_scale_joy)) {
      diagnosis.path_to_success_scale_joy = [];
    }

    delete diagnosis.path_to_ssj;
    
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
