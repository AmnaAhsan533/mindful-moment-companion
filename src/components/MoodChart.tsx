import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const moodLabels: Record<number, string> = {
  1: "😢",
  2: "😔",
  3: "😐",
  4: "🙂",
  5: "😊",
};

const moodTextLabels: Record<number, string> = {
  1: "Struggling",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-2xl">{moodLabels[mood]}</p>
        <p className="text-sm text-muted-foreground">{moodTextLabels[mood]}</p>
      </div>
    );
  }
  return null;
};

export function MoodChart() {
  const { entries, loading } = useMoodEntries();

  const chartData = useMemo(() => {
    if (!entries.length) return [];

    // Group entries by day and calculate average mood per day
    const dayMap = new Map<string, { total: number; count: number; date: Date }>();
    
    entries.forEach(entry => {
      const date = new Date(entry.logged_at);
      const dayKey = date.toISOString().split('T')[0];
      
      if (dayMap.has(dayKey)) {
        const existing = dayMap.get(dayKey)!;
        existing.total += entry.mood_score;
        existing.count += 1;
      } else {
        dayMap.set(dayKey, { total: entry.mood_score, count: 1, date });
      }
    });

    // Convert to array, sort by date, and take last 7 days
    return Array.from(dayMap.entries())
      .map(([key, value]) => ({
        day: value.date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: Math.round(value.total / value.count),
        date: value.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-7);
  }, [entries]);

  const avgMood = useMemo(() => {
    if (!chartData.length) return 0;
    return (chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length).toFixed(1);
  }, [chartData]);

  if (loading) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Weekly Mood Trends
          </CardTitle>
          {chartData.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Average</p>
              <p className="text-2xl font-bold text-primary">{avgMood}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-4xl block mb-4">📊</span>
            <p>No mood data yet</p>
            <p className="text-sm mt-1">Log your first mood to see trends!</p>
          </div>
        ) : (
          <>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => moodLabels[value] || ""}
                    className="text-sm"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>😢 Struggling</span>
              <span>😊 Great</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
