import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const mockMoodData = [
  { day: "Mon", mood: 3, label: "Okay" },
  { day: "Tue", mood: 4, label: "Good" },
  { day: "Wed", mood: 3, label: "Okay" },
  { day: "Thu", mood: 2, label: "Low" },
  { day: "Fri", mood: 4, label: "Good" },
  { day: "Sat", mood: 5, label: "Great" },
  { day: "Sun", mood: 4, label: "Good" },
];

const moodLabels: Record<number, string> = {
  1: "😢",
  2: "😔",
  3: "😐",
  4: "🙂",
  5: "😊",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-2xl">{moodLabels[mood]}</p>
        <p className="text-sm text-muted-foreground">
          {mockMoodData.find(d => d.day === label)?.label}
        </p>
      </div>
    );
  }
  return null;
};

export function MoodChart() {
  const avgMood = (mockMoodData.reduce((sum, d) => sum + d.mood, 0) / mockMoodData.length).toFixed(1);

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Weekly Mood Trends
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-2xl font-bold text-primary">{avgMood}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockMoodData}>
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
      </CardContent>
    </Card>
  );
}
