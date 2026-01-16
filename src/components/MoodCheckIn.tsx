import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function MoodCheckIn() {
  const { logMood } = useMoodEntries();
  const { t, isRTL } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { emoji: "😊", label: t.moodGreat, value: 5 },
    { emoji: "🙂", label: t.moodGood, value: 4 },
    { emoji: "😐", label: t.moodOkay, value: 3 },
    { emoji: "😔", label: t.moodBad, value: 2 },
    { emoji: "😢", label: t.moodAwful, value: 1 },
  ];

  const handleSubmit = async () => {
    if (selectedMood === null) return;
    
    setIsSubmitting(true);
    const { error } = await logMood(selectedMood, note);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: t.moodLogged + " ✨",
        description: t.moodLoggedDesc,
      });
      setSelectedMood(null);
      setNote("");
    }
  };

  return (
    <Card className={cn("shadow-lg border-border/50", isRTL && "font-urdu")} dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          {t.howAreYouFeeling}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-3 flex-wrap">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedMood(mood.value)}
              className="flex flex-col items-center h-auto py-3 px-4"
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs mt-1">{mood.label}</span>
            </Button>
          ))}
        </div>
        
        <Textarea
          placeholder={t.addNote}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="resize-none bg-background"
          rows={3}
          dir={isRTL ? "rtl" : "ltr"}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={selectedMood === null || isSubmitting}
          className="w-full"
          variant="hero"
          size="lg"
        >
          {isSubmitting ? t.loading : t.logMood}
        </Button>
      </CardContent>
    </Card>
  );
}
