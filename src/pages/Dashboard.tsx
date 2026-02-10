import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { CareTasks } from "@/components/CareTasks";
import { MoodChart } from "@/components/MoodChart";
import { CrisisResources } from "@/components/CrisisResources";
import { DashboardStats } from "@/components/DashboardStats";
import { MoodInsights } from "@/components/MoodInsights";
import { ProgressReport } from "@/components/ProgressReport";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Heart, LineChart, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();
      if (data && !(data as any).onboarding_completed) {
        setShowOnboarding(true);
      }
    };
    checkOnboarding();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome back 👋</h1>
          <p className="text-center text-muted-foreground">
            Take a moment to check in with yourself today.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <DashboardStats />
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden">
          <Tabs defaultValue="checkin" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-2">
              <TabsTrigger value="checkin" className="flex flex-col items-center gap-1 py-2">
                <Heart className="h-4 w-4" />
                <span className="text-xs">Check-in</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex flex-col items-center gap-1 py-2">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex flex-col items-center gap-1 py-2">
                <LineChart className="h-4 w-4" />
                <span className="text-xs">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="flex flex-col items-center gap-1 py-2">
                <Phone className="h-4 w-4" />
                <span className="text-xs">Help</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checkin">
              <MoodCheckIn />
            </TabsContent>
            <TabsContent value="tasks">
              <CareTasks />
            </TabsContent>
            <TabsContent value="progress" className="space-y-6">
              <MoodInsights />
              <MoodChart />
              <ProgressReport />
            </TabsContent>
            <TabsContent value="help">
              <CrisisResources />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MoodCheckIn />
            <MoodInsights />
            <MoodChart />
            <ProgressReport />
          </div>
          <div className="space-y-6">
            <CareTasks />
            <CrisisResources />
          </div>
        </div>
      </main>
    </div>
  );
}
