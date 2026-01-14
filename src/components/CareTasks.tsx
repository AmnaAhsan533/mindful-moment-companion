import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CareTask {
  id: string;
  title: string;
  description: string;
  category: "medication" | "exercise" | "mindfulness" | "social" | "therapy";
  completed: boolean;
  time?: string;
}

const initialTasks: CareTask[] = [
  {
    id: "1",
    title: "Morning Meditation",
    description: "10-minute guided breathing exercise",
    category: "mindfulness",
    completed: false,
    time: "8:00 AM",
  },
  {
    id: "2",
    title: "Take Medication",
    description: "Daily prescribed medication",
    category: "medication",
    completed: false,
    time: "9:00 AM",
  },
  {
    id: "3",
    title: "30-min Walk",
    description: "Light outdoor exercise as recommended",
    category: "exercise",
    completed: false,
    time: "12:00 PM",
  },
  {
    id: "4",
    title: "Journal Entry",
    description: "Write about your day and feelings",
    category: "therapy",
    completed: false,
    time: "8:00 PM",
  },
  {
    id: "5",
    title: "Call a Friend",
    description: "Connect with someone you trust",
    category: "social",
    completed: false,
  },
];

const categoryConfig = {
  medication: { label: "Medication", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
  exercise: { label: "Exercise", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  mindfulness: { label: "Mindfulness", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  social: { label: "Social", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  therapy: { label: "Therapy", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
};

export function CareTasks() {
  const [tasks, setTasks] = useState<CareTask[]>(initialTasks);

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Today's Care Plan
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {completedCount}/{tasks.length} done
          </Badge>
        </div>
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
              task.completed
                ? "bg-muted/50 border-muted"
                : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
            )}
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "font-medium transition-all",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </span>
                <Badge className={cn("text-xs", categoryConfig[task.category].className)}>
                  {categoryConfig[task.category].label}
                </Badge>
              </div>
              <p className={cn(
                "text-sm mt-1",
                task.completed ? "text-muted-foreground" : "text-muted-foreground"
              )}>
                {task.description}
              </p>
              {task.time && (
                <p className="text-xs text-muted-foreground mt-1">⏰ {task.time}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
