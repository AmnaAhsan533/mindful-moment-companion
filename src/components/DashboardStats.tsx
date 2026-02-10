import { Card, CardContent } from "@/components/ui/card";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useCarePlan } from "@/hooks/useCarePlan";
import { Flame, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import { useMemo } from "react";

export function DashboardStats() {
  const { entries } = useMoodEntries();
  const { carePlan, completions } = useCarePlan();

  const streak = useMemo(() => {
    if (!entries.length) return 0;
    const days = new Set(
      entries.map((e) => new Date(e.logged_at).toISOString().split("T")[0])
    );
    const sortedDays = Array.from(days).sort().reverse();
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (days.has(key)) {
        count++;
      } else if (i === 0) {
        continue; // today might not be logged yet
      } else {
        break;
      }
    }
    return count;
  }, [entries]);

  const totalCheckIns = entries.length;

  const taskCompletionRate = useMemo(() => {
    if (!carePlan?.tasks?.length) return null;
    return Math.round((completions.length / carePlan.tasks.length) * 100);
  }, [carePlan, completions]);

  const streakMessage = useMemo(() => {
    if (streak >= 14) return "You're unstoppable! 🏆";
    if (streak >= 7) return "Amazing consistency! 🌟";
    if (streak >= 3) return "Great momentum! 💪";
    if (streak >= 1) return "Keep it going! 🔥";
    return "Start your streak today! ✨";
  }, [streak]);

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: streak,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Calendar,
      label: "Total Check-ins",
      value: totalCheckIns,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      label: "Tasks Done",
      value: taskCompletionRate !== null ? `${taskCompletionRate}%` : "—",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm border-border/50">
            <CardContent className="p-4 flex flex-col items-center text-center gap-1">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">{streakMessage}</p>
    </div>
  );
}
