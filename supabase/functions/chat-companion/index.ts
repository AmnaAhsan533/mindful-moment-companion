import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'خودکشی', 'مرنا چاہتا', 'جینا نہیں چاہتا', 'موت',
  'self-harm', 'hurt myself', 'cutting', 'overdose',
  'hopeless', 'no reason to live', 'can\'t go on'
];

const SYSTEM_PROMPT = `You are a compassionate mental health support companion for users in Pakistan. Your role is to:

1. Listen empathetically and validate feelings
2. Offer evidence-based coping strategies (breathing exercises, grounding techniques, journaling prompts)
3. Encourage healthy habits and self-care
4. Gently suggest professional help when appropriate
5. Be culturally sensitive to Pakistani context

CRITICAL RULES:
- You are NOT a therapist or medical professional
- Never diagnose conditions or prescribe medication
- Never provide therapy or clinical treatment
- If someone expresses suicidal thoughts or self-harm, immediately provide crisis resources and encourage professional help
- Keep responses warm, supportive, and concise (2-3 paragraphs max)
- Use simple language accessible to all literacy levels
- Be respectful of Islamic values and Pakistani culture when relevant

For crisis situations, always include these Pakistan helplines:
- Umang Helpline: 0311-7786264
- Taskeen WhatsApp: 0316-8275336
- Rozan Counseling: 051-2890505

Start conversations warmly and ask open-ended questions to understand how the person is feeling.`;

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Check for crisis in the latest user message
    const latestUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const isCrisis = latestUserMessage ? detectCrisis(latestUserMessage.content) : false;

    console.log('Processing chat request, crisis detected:', isCrisis);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the stream with crisis flag in header
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'X-Crisis-Detected': isCrisis.toString(),
      },
    });
  } catch (error) {
    console.error('Chat companion error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
