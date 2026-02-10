import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Pause, RotateCcw } from "lucide-react";

type Phase = "inhale" | "hold" | "exhale" | "idle";

const PHASES: { phase: Phase; duration: number }[] = [
  { phase: "inhale", duration: 4 },
  { phase: "hold", duration: 7 },
  { phase: "exhale", duration: 8 },
];

const phaseLabels: Record<Phase, { en: string; ur: string }> = {
  inhale: { en: "Breathe In", ur: "سانس اندر لیں" },
  hold: { en: "Hold", ur: "روکیں" },
  exhale: { en: "Breathe Out", ur: "سانس باہر چھوڑیں" },
  idle: { en: "Ready?", ur: "تیار ہیں؟" },
};

export default function Breathing() {
  const { isRTL, language } = useLanguage();
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const currentPhase: Phase = isRunning ? PHASES[currentPhaseIndex].phase : "idle";

  useEffect(() => {
    if (!isRunning) return;

    setSecondsLeft(PHASES[currentPhaseIndex].duration);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
          if (nextIndex === 0) setCycles((c) => c + 1);
          setCurrentPhaseIndex(nextIndex);
          return PHASES[nextIndex].duration;
        }
        return prev - 1;
      });
      setTotalSeconds((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentPhaseIndex]);

  const reset = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setSecondsLeft(0);
    setCycles(0);
    setTotalSeconds(0);
  };

  const circleScale = currentPhase === "inhale" ? "scale-100" : currentPhase === "exhale" ? "scale-50" : "scale-75";
  const circleColor = currentPhase === "inhale" 
    ? "bg-primary/20 border-primary" 
    : currentPhase === "hold" 
    ? "bg-accent border-accent-foreground" 
    : currentPhase === "exhale" 
    ? "bg-muted border-muted-foreground" 
    : "bg-primary/10 border-primary/50";

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {language === "ur" ? "سانس کی مشق" : "Breathing Exercise"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ur" ? "4-7-8 تکنیک - پرسکون اور توجہ مرکوز" : "4-7-8 Technique — Calm & Focus"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center w-64 h-64">
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ease-in-out ${circleScale} ${circleColor}`}
            />
            <div className="relative z-10 text-center">
              <p className="text-2xl font-bold">
                {phaseLabels[currentPhase][language === "ur" ? "ur" : "en"]}
              </p>
              {isRunning && (
                <p className="text-4xl font-mono font-bold text-primary mt-2">{secondsLeft}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <Card className="w-full">
            <CardContent className="p-4 flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold">{cycles}</p>
                <p className="text-xs text-muted-foreground">
                  {language === "ur" ? "سائیکل" : "Cycles"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatTime(totalSeconds)}</p>
                <p className="text-xs text-muted-foreground">
                  {language === "ur" ? "کل وقت" : "Total Time"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className="gap-2"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isRunning
                ? language === "ur" ? "روکیں" : "Pause"
                : language === "ur" ? "شروع کریں" : "Start"}
            </Button>
            <Button size="lg" variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-5 w-5" />
              {language === "ur" ? "دوبارہ" : "Reset"}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground max-w-sm">
            <p className="font-medium mb-1">
              {language === "ur" ? "4-7-8 تکنیک:" : "4-7-8 Technique:"}
            </p>
            <p>
              {language === "ur"
                ? "4 سیکنڈ سانس لیں → 7 سیکنڈ روکیں → 8 سیکنڈ میں چھوڑیں"
                : "Inhale 4s → Hold 7s → Exhale 8s"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
