import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  userId: string;
  type: "mood_checkin" | "care_tasks" | "custom";
  customMessage?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured. Please add it to enable email reminders.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, type, customMessage }: ReminderRequest = await req.json();

    if (!userId || !type) {
      throw new Error("userId and type are required");
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.email) {
      throw new Error("User profile or email not found");
    }

    let subject = "";
    let htmlContent = "";
    const userName = profile.full_name || "there";

    switch (type) {
      case "mood_checkin":
        subject = "Time for your daily mood check-in 🌸";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7c3aed;">Hi ${userName}! 👋</h1>
            <p>This is your gentle reminder to check in with yourself today.</p>
            <p>Taking a moment to reflect on how you're feeling can make a big difference in your wellness journey.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px;">How are you feeling right now?</p>
              <p style="margin: 10px 0 0 0; color: #6b7280;">😊 Great • 🙂 Good • 😐 Okay • 😔 Low • 😢 Struggling</p>
            </div>
            <p>Open MindfulCare to log your mood and see your progress.</p>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              You're doing amazing. Keep taking care of yourself! 💜
            </p>
          </div>
        `;
        break;

      case "care_tasks":
        // Fetch today's care plan
        const { data: carePlan } = await supabase
          .from("care_plans")
          .select("title, tasks")
          .eq("user_id", userId)
          .eq("is_active", true)
          .single();

        const tasks = carePlan?.tasks as Array<{ title: string; time?: string }> || [];
        const taskList = tasks.map(t => 
          `<li style="margin: 8px 0;">${t.title}${t.time ? ` - ${t.time}` : ''}</li>`
        ).join("");

        subject = "Your daily care plan is ready 📋";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7c3aed;">Good morning, ${userName}! 🌅</h1>
            <p>Here's your personalized care plan for today:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #374151;">${carePlan?.title || "Today's Care Tasks"}</h2>
              <ul style="color: #374151;">
                ${taskList || '<li>Check your app for your personalized tasks</li>'}
              </ul>
            </div>
            <p>Remember, each small step counts. You've got this! 💪</p>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              Open MindfulCare to check off tasks as you complete them.
            </p>
          </div>
        `;
        break;

      case "custom":
        subject = "A message from MindfulCare 💜";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7c3aed;">Hi ${userName}!</h1>
            <p>${customMessage || "Just a friendly reminder to take care of yourself today."}</p>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              With love, MindfulCare 💜
            </p>
          </div>
        `;
        break;
    }

    // Send email using Resend REST API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MindfulCare <onboarding@resend.dev>",
        to: [profile.email],
        subject,
        html: htmlContent,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent:", emailData);

    // Record the reminder
    await supabase.from("reminders").insert({
      user_id: userId,
      title: subject,
      message: customMessage || null,
      channel: "email",
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      status: "sent",
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
