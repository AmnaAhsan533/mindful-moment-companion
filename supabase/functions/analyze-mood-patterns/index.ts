import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, user_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!entries || entries.length < 3) {
      return new Response(JSON.stringify({ error: "Need at least 3 entries" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Analyze these mood entries from a mental health app user. Each entry has a mood_score (1=awful, 5=great), optional note, and timestamp.

Entries (most recent first):
${entries.map((e: any) => `- Score: ${e.mood_score}/5, Date: ${e.logged_at}${e.note ? `, Note: "${e.note}"` : ""}`).join("\n")}

Respond with ONLY a JSON object (no markdown, no code blocks):
{
  "trend": "improving" | "stable" | "declining",
  "risk_level": "low" | "medium" | "high",
  "summary": "A warm, empathetic 1-2 sentence summary of their mood pattern. Be specific about dates/days.",
  "suggestions": ["3 personalized, actionable suggestions based on their data"]
}

Rules:
- risk_level is "high" if 3+ consecutive entries have score <= 2
- risk_level is "medium" if average score is below 3
- Be culturally sensitive (user may be from Pakistan)
- Keep suggestions practical and specific to their patterns`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      throw new Error("AI request failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle potential markdown wrapping)
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      parsed = {
        trend: "stable",
        risk_level: "low",
        summary: "We're still learning your patterns. Keep logging daily!",
        suggestions: ["Continue logging your mood daily", "Try to note what affects your mood", "Consider speaking with a counselor"],
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
