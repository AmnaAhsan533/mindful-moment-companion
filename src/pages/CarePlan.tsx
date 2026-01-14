import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCarePlan, CareTask } from "@/hooks/useCarePlan";

const categoryConfig = {
  medication: { label: "Medication", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
  exercise: { label: "Exercise", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  mindfulness: { label: "Mindfulness", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  social: { label: "Social", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  therapy: { label: "Therapy", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
};

export default function CarePlanPage() {
  const { user } = useAuth();
  const { carePlan, loading, refetch } = useCarePlan();
  const [generating, setGenerating] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");

  const handleGenerateCarePlan = async () => {
    if (!user) return;
    
    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-care-plan", {
        body: { 
          userId: user.id,
          sessionNotes: sessionNotes || undefined
        },
      });

      if (error) throw error;

      toast({
        title: "Care plan generated! ✨",
        description: "Your personalized care plan is ready.",
      });
      
      setSessionNotes("");
      refetch();
    } catch (error: any) {
      console.error("Error generating care plan:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate care plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Care Plan
          </h1>
          <p className="text-muted-foreground">
            Generate a personalized care plan based on your therapy sessions and wellness goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Generation Card */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Generate New Plan
              </CardTitle>
              <CardDescription>
                Optionally add notes from your therapy session to personalize your care plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-notes">Session Notes (Optional)</Label>
                <Textarea
                  id="session-notes"
                  placeholder="Share key takeaways from your therapy session, goals discussed, or areas you want to focus on..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              <Button 
                onClick={handleGenerateCarePlan}
                disabled={generating}
                variant="hero"
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating your care plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Care Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Care Plan */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle>Current Care Plan</CardTitle>
              <CardDescription>
                {carePlan 
                  ? `Generated on ${new Date(carePlan.generated_at).toLocaleDateString()}`
                  : "No active care plan yet"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : carePlan ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{carePlan.title}</h3>
                    {carePlan.description && (
                      <p className="text-muted-foreground text-sm mt-1">{carePlan.description}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {carePlan.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border bg-card border-border"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{task.title}</span>
                          <Badge className={categoryConfig[task.category]?.className || ""}>
                            {categoryConfig[task.category]?.label || task.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                        {task.time && (
                          <p className="text-xs text-muted-foreground mt-1">⏰ {task.time}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate your first care plan to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
