import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCarePlan } from "@/hooks/useCarePlan";
import { Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const categoryConfig = {
  medication: { label: "Medication", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
  exercise: { label: "Exercise", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  mindfulness: { label: "Mindfulness", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  social: { label: "Social", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  therapy: { label: "Therapy", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
};

export function CareTasks() {
  const { carePlan, loading, toggleTaskCompletion, isTaskCompleted, completions } = useCarePlan();

  if (loading) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!carePlan) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Today's Care Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">No care plan yet</p>
          <Button asChild variant="hero">
            <Link to="/care-plan">Generate Care Plan</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tasks = carePlan.tasks || [];
  const completedCount = completions.length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

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
        {tasks.map((task) => {
          const completed = isTaskCompleted(task.id);
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                completed
                  ? "bg-muted/50 border-muted"
                  : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
              )}
            >
              <Checkbox
                checked={completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("font-medium transition-all", completed && "line-through text-muted-foreground")}>
                    {task.title}
                  </span>
                  <Badge className={cn("text-xs", categoryConfig[task.category]?.className)}>
                    {categoryConfig[task.category]?.label || task.category}
                  </Badge>
                </div>
                <p className="text-sm mt-1 text-muted-foreground">{task.description}</p>
                {task.time && <p className="text-xs text-muted-foreground mt-1">⏰ {task.time}</p>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
