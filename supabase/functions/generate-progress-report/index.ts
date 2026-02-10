import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Fetch last 14 days of mood entries
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const [moodResult, sessionsResult, carePlanResult, completionsResult] = await Promise.all([
      supabase.from("mood_entries").select("*").eq("user_id", user.id)
        .gte("logged_at", twoWeeksAgo.toISOString()).order("logged_at", { ascending: true }),
      supabase.from("session_summaries").select("*").eq("user_id", user.id)
        .gte("session_date", twoWeeksAgo.toISOString().split("T")[0]).order("session_date", { ascending: false }),
      supabase.from("care_plans").select("*").eq("user_id", user.id).eq("is_active", true).limit(1).maybeSingle(),
      supabase.from("care_task_completions").select("*").eq("user_id", user.id)
        .gte("completed_at", twoWeeksAgo.toISOString()),
    ]);

    const moods = moodResult.data || [];
    const sessions = sessionsResult.data || [];
    const carePlan = carePlanResult.data;
    const completions = completionsResult.data || [];

    const avgMood = moods.length > 0
      ? (moods.reduce((s: number, m: any) => s + m.mood_score, 0) / moods.length).toFixed(1)
      : "N/A";

    const totalTasks = carePlan ? (carePlan.tasks as any[]).length : 0;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completions.length / (totalTasks * 14)) * 100) : 0;

    // Generate AI narrative
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let narrative = "Progress report generated successfully.";

    if (LOVABLE_API_KEY && moods.length > 0) {
      const prompt = `Write a brief, warm 3-4 sentence progress summary for a therapy patient to share with their therapist. Data:
- ${moods.length} mood entries over 2 weeks, average score: ${avgMood}/5
- ${sessions.length} therapy sessions logged
- ${completions.length} care tasks completed
- Mood scores: ${moods.map((m: any) => m.mood_score).join(", ")}
Be encouraging but honest. Do not use markdown.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        narrative = aiData.choices?.[0]?.message?.content || narrative;
      }
    }

    return new Response(JSON.stringify({
      period: { from: twoWeeksAgo.toISOString().split("T")[0], to: new Date().toISOString().split("T")[0] },
      mood: { entries: moods.length, average: avgMood, scores: moods.map((m: any) => ({ score: m.mood_score, date: m.logged_at })) },
      sessions: { count: sessions.length },
      tasks: { completed: completions.length, rate: taskCompletionRate },
      narrative,
    }), {
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
