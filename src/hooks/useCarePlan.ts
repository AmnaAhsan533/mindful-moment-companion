import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface CareTask {
  id: string;
  title: string;
  description: string;
  category: "medication" | "exercise" | "mindfulness" | "social" | "therapy";
  time?: string;
}

export interface CarePlan {
  id: string;
  title: string;
  description: string | null;
  tasks: CareTask[];
  is_active: boolean;
  generated_at: string;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  completed_at: string;
}

export function useCarePlan() {
  const { user } = useAuth();
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarePlan = async () => {
    if (!user) return;
    
    // Fetch active care plan
    const { data: planData, error: planError } = await supabase
      .from("care_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("generated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (planError) {
      console.error("Error fetching care plan:", planError);
    } else if (planData) {
      const tasks = (planData.tasks as unknown as CareTask[]) || [];
      setCarePlan({
        id: planData.id,
        title: planData.title,
        description: planData.description,
        tasks,
        is_active: planData.is_active ?? true,
        generated_at: planData.generated_at,
      });

      // Fetch today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: completionData, error: completionError } = await supabase
        .from("care_task_completions")
        .select("*")
        .eq("user_id", user.id)
        .eq("care_plan_id", planData.id)
        .gte("completed_at", today);

      if (completionError) {
        console.error("Error fetching completions:", completionError);
      } else {
        setCompletions(completionData || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarePlan();
  }, [user]);

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user || !carePlan) return;

    const isCompleted = completions.some(c => c.task_id === taskId);

    if (isCompleted) {
      // Remove completion
      const completion = completions.find(c => c.task_id === taskId);
      if (!completion) return;

      const { error } = await supabase
        .from("care_task_completions")
        .delete()
        .eq("id", completion.id);

      if (error) {
        console.error("Error removing completion:", error);
        toast({
          title: "Error",
          description: "Failed to update task.",
          variant: "destructive",
        });
      } else {
        setCompletions(prev => prev.filter(c => c.id !== completion.id));
      }
    } else {
      // Add completion
      const { data, error } = await supabase
        .from("care_task_completions")
        .insert({
          user_id: user.id,
          care_plan_id: carePlan.id,
          task_id: taskId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding completion:", error);
        toast({
          title: "Error",
          description: "Failed to update task.",
          variant: "destructive",
        });
      } else {
        setCompletions(prev => [...prev, data]);
      }
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return completions.some(c => c.task_id === taskId);
  };

  return { 
    carePlan, 
    completions, 
    loading, 
    toggleTaskCompletion, 
    isTaskCompleted,
    refetch: fetchCarePlan 
  };
}
