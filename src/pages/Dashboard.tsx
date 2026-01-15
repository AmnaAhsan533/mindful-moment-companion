import { Header } from "@/components/Header";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { CareTasks } from "@/components/CareTasks";
import { MoodChart } from "@/components/MoodChart";
import { CrisisResources } from "@/components/CrisisResources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Heart, LineChart, Phone } from "lucide-react";
export default function Dashboard() {
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome back 👋</h1>
          <p className="text-center text-purple-600">
            Take a moment to check in with yourself today.
          </p>
        </div>

        {/* Mobile tabs for smaller screens */}
        <div className="lg:hidden">
          <Tabs defaultValue="checkin" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-2">
              <TabsTrigger value="checkin" className="flex flex-col items-center gap-1 py-2">
                <Heart className="h-4 w-4 text-violet-950" />
                <span className="text-xs">Check-in</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex flex-col items-center gap-1 py-2">
                <CalendarDays className="h-4 w-4 text-violet-950" />
                <span className="text-xs">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex flex-col items-center gap-1 py-2">
                <LineChart className="h-4 w-4 text-violet-950" />
                <span className="text-xs">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="flex flex-col items-center gap-1 py-2">
                <Phone className="h-4 w-4 text-violet-950" />
                <span className="text-xs">Help</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="checkin">
              <MoodCheckIn />
            </TabsContent>
            <TabsContent value="tasks">
              <CareTasks />
            </TabsContent>
            <TabsContent value="progress">
              <MoodChart />
            </TabsContent>
            <TabsContent value="help">
              <CrisisResources />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop grid layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MoodCheckIn />
            <MoodChart />
          </div>
          <div className="space-y-6">
            <CareTasks />
            <CrisisResources />
          </div>
        </div>
      </main>
    </div>;
}