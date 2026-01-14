import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface MoodEntry {
  id: string;
  mood_score: number;
  note: string | null;
  logged_at: string;
  created_at: string;
}

export function useMoodEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching mood entries:", error);
      toast({
        title: "Error loading mood data",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const logMood = async (moodScore: number, note: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: user.id,
        mood_score: moodScore,
        note: note || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error logging mood:", error);
      return { error };
    }

    setEntries(prev => [data, ...prev]);
    return { error: null, data };
  };

  return { entries, loading, logMood, refetch: fetchEntries };
}
