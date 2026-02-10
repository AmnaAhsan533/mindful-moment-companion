import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Loader2, Printer, Calendar, TrendingUp, CheckCircle } from "lucide-react";

interface ReportData {
  period: { from: string; to: string };
  mood: { entries: number; average: string; scores: { score: number; date: string }[] };
  sessions: { count: number };
  tasks: { completed: number; rate: number };
  narrative: string;
}

export function ProgressReport() {
  const { user } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: { session } } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-progress-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to generate report");
      setReport(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!report) {
    return (
      <Button onClick={generateReport} disabled={loading} variant="outline" className="w-full gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        {loading ? "Generating..." : "Generate Progress Report"}
      </Button>
    );
  }

  return (
    <Card className="shadow-lg border-border/50 print:shadow-none" id="progress-report">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Progress Report
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => window.print()} className="print:hidden gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {report.period.from} — {report.period.to}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{report.mood.average}/5</p>
            <p className="text-xs text-muted-foreground">Avg Mood</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{report.sessions.count}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <CheckCircle className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{report.tasks.completed}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm font-medium mb-1">AI Summary</p>
          <p className="text-sm text-muted-foreground">{report.narrative}</p>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Share this report with your therapist for a more informed session.
        </p>
      </CardContent>
    </Card>
  );
}
