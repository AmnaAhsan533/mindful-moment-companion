import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const moods = [
  { emoji: "😊", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😢", label: "Struggling", value: 1 },
];

interface MoodCheckInProps {
  onMoodLogged?: (mood: number, note: string) => void;
}

export function MoodCheckIn({ onMoodLogged }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedMood === null) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onMoodLogged?.(selectedMood, note);
    
    toast({
      title: "Mood logged ✨",
      description: "Great job checking in today! Keep it up.",
    });
    
    setSelectedMood(null);
    setNote("");
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-3 flex-wrap">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "moodActive" : "mood"}
              size="mood"
              onClick={() => setSelectedMood(mood.value)}
              className="flex flex-col items-center"
            >
              <span className="text-2xl">{mood.emoji}</span>
            </Button>
          ))}
        </div>
        
        {selectedMood !== null && (
          <p className="text-center text-sm text-muted-foreground">
            You selected: <span className="font-medium text-foreground">{moods.find(m => m.value === selectedMood)?.label}</span>
          </p>
        )}
        
        <Textarea
          placeholder="Add a note about how you're feeling... (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="resize-none bg-background"
          rows={3}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={selectedMood === null || isSubmitting}
          className="w-full"
          variant="hero"
          size="lg"
        >
          {isSubmitting ? "Logging..." : "Log Mood"}
        </Button>
      </CardContent>
    </Card>
  );
}
