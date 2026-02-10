import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { Brain, AlertTriangle, RefreshCw, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MoodInsight {
  trend: string;
  risk_level: string;
  summary: string;
  suggestions: string[];
  analyzed_at: string;
}

export function MoodInsights() {
  const { user } = useAuth();
  const { entries } = useMoodEntries();
  const [insight, setInsight] = useState<MoodInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCachedInsight = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("mood_insights")
      .select("*")
      .eq("user_id", user.id)
      .gte("analyzed_at", today)
      .order("analyzed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setInsight({
        trend: data.trend,
        risk_level: data.risk_level,
        summary: data.summary,
        suggestions: (data.suggestions as any) || [],
        analyzed_at: data.analyzed_at,
      });
      return true;
    }
    return false;
  };

  const analyzePatterns = async () => {
    if (!user || entries.length < 3) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-mood-patterns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            entries: entries.slice(0, 14).map((e) => ({
              mood_score: e.mood_score,
              note: e.note,
              logged_at: e.logged_at,
            })),
            user_id: user.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to analyze patterns");

      const result = await response.json();
      setInsight(result);

      // Cache the result
      await supabase.from("mood_insights").insert({
        user_id: user.id,
        trend: result.trend,
        risk_level: result.risk_level,
        summary: result.summary,
        suggestions: result.suggestions,
      });
    } catch (err) {
      setError("Unable to generate insights right now.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const cached = await fetchCachedInsight();
      if (!cached && entries.length >= 3) {
        await analyzePatterns();
      }
    };
    if (user && entries.length > 0) init();
  }, [user, entries.length]);

  if (entries.length < 3) return null;

  const TrendIcon = insight?.trend === "improving" ? TrendingUp : insight?.trend === "declining" ? TrendingDown : Minus;

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Mood Insights
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={analyzePatterns} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && !insight && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Analyzing your patterns...</span>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {insight && (
          <>
            {insight.risk_level === "high" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>We notice you've been struggling</AlertTitle>
                <AlertDescription>
                  Your mood has been consistently low. Please consider reaching out to a professional or calling Umang Helpline: 0311-7786264.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <TrendIcon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
              <p className="text-sm">{insight.summary}</p>
            </div>

            {insight.suggestions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggestions for you:</p>
                <ul className="space-y-1">
                  {insight.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
