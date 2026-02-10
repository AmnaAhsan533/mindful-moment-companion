import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, BarChart3, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Heart,
    title: "Welcome to MindCare Companion! 👋",
    titleUr: "!MindCare Companion میں خوش آمدید 👋",
    description: "Your personal mental wellness companion. We help you stay on track between therapy sessions with daily mood tracking, AI-powered insights, and structured care plans.",
    descriptionUr: "آپ کا ذاتی ذہنی صحت کا ساتھی۔ ہم آپ کو تھراپی سیشنز کے درمیان روزانہ موڈ ٹریکنگ، AI بصیرت، اور منظم نگہداشت کے منصوبوں کے ساتھ ٹریک پر رکھتے ہیں۔",
  },
  {
    icon: BarChart3,
    title: "Track Your Mood Daily 📊",
    titleUr: "روزانہ اپنا موڈ ٹریک کریں 📊",
    description: "Log how you're feeling each day. Over time, our AI analyzes your patterns to spot trends and provide personalized insights — helping you and your therapist make better decisions.",
    descriptionUr: "ہر روز اپنے احساسات ریکارڈ کریں۔ وقت کے ساتھ، ہمارا AI آپ کے پیٹرنز کا تجزیہ کرتا ہے تاکہ رجحانات کی نشاندہی اور ذاتی بصیرت فراہم کر سکے۔",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Care Plans ✨",
    titleUr: "AI سے چلنے والے نگہداشت کے منصوبے ✨",
    description: "After therapy sessions, log your key takeaways and let our AI generate a personalized daily care plan with actionable tasks — medication reminders, exercises, mindfulness, and more.",
    descriptionUr: "تھراپی سیشنز کے بعد، اپنے اہم نکات لکھیں اور ہمارے AI کو آپ کے لیے روزانہ نگہداشت کا منصوبہ بنانے دیں۔",
  },
];

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  const handleComplete = async () => {
    if (user) {
      await supabase.from("profiles").update({ onboarding_completed: true } as any).eq("id", user.id);
    }
    onComplete();
  };

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-muted"}`}
              />
            ))}
          </div>

          <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
            <Icon className="h-10 w-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold">{current.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{current.description}</p>

          <div className="flex gap-3 justify-center pt-4">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button
              onClick={isLast ? handleComplete : () => setStep(step + 1)}
              className="gap-2"
            >
              {isLast ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {!isLast && (
            <button onClick={handleComplete} className="text-sm text-muted-foreground hover:underline">
              Skip
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
