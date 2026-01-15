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
    // Authenticate the user via JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Create client with user's auth token
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims?.sub) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get verified userId from JWT claims
    const userId = claimsData.claims.sub;

    // Parse request body - only sessionNotes, userId comes from JWT
    const { sessionNotes } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use service role key for database operations
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch recent mood entries for context
    const { data: moodEntries } = await supabase
      .from("mood_entries")
      .select("mood_score, note, logged_at")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(7);

    // Fetch recent session summaries
    const { data: sessions } = await supabase
      .from("session_summaries")
      .select("summary, key_takeaways, session_date")
      .eq("user_id", userId)
      .order("session_date", { ascending: false })
      .limit(3);

    // Build context for AI
    let context = "Generate a personalized daily mental health care plan with 5-6 tasks.\n\n";
    
    if (moodEntries && moodEntries.length > 0) {
      const avgMood = moodEntries.reduce((sum, e) => sum + e.mood_score, 0) / moodEntries.length;
      context += `Recent mood average: ${avgMood.toFixed(1)}/5\n`;
      context += `Recent mood notes: ${moodEntries.filter(e => e.note).map(e => e.note).join("; ")}\n\n`;
    }

    if (sessions && sessions.length > 0) {
      context += "Recent therapy sessions:\n";
      sessions.forEach(s => {
        context += `- ${s.summary}\n`;
        if (s.key_takeaways?.length) {
          context += `  Takeaways: ${s.key_takeaways.join(", ")}\n`;
        }
      });
      context += "\n";
    }

    if (sessionNotes) {
      context += `Additional notes from user: ${sessionNotes}\n\n`;
    }

    context += `Create a care plan with tasks in these categories: medication, exercise, mindfulness, social, therapy.
Each task should have: id (unique string), title, description, category, and optional time (like "8:00 AM").
Make tasks specific, actionable, and compassionate.`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a compassionate mental health care assistant. You create personalized daily care plans based on therapy insights and mood patterns. Always respond with valid JSON only, no markdown.`
          },
          {
            role: "user",
            content: context
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_care_plan",
              description: "Create a structured care plan with tasks",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "A warm, encouraging title for the care plan" },
                  description: { type: "string", description: "A brief supportive description" },
                  tasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        category: { 
                          type: "string", 
                          enum: ["medication", "exercise", "mindfulness", "social", "therapy"] 
                        },
                        time: { type: "string" }
                      },
                      required: ["id", "title", "description", "category"]
                    }
                  }
                },
                required: ["title", "description", "tasks"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_care_plan" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response:", JSON.stringify(aiResponse));

    // Extract the care plan from tool call
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const carePlanData = JSON.parse(toolCall.function.arguments);

    // Deactivate existing care plans
    await supabase
      .from("care_plans")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true);

    // Insert new care plan
    const { data: newCarePlan, error: insertError } = await supabase
      .from("care_plans")
      .insert({
        user_id: userId,
        title: carePlanData.title,
        description: carePlanData.description,
        tasks: carePlanData.tasks,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting care plan:", insertError);
      throw insertError;
    }

    console.log("Care plan created:", newCarePlan.id);

    return new Response(JSON.stringify({ success: true, carePlan: newCarePlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-care-plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
