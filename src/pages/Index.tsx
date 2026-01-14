import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import {
  Heart,
  CalendarCheck,
  LineChart,
  Bell,
  MessageCircleHeart,
  Shield,
  ArrowRight,
} from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

const features = [
  {
    icon: Heart,
    title: "Daily Mood Tracking",
    description:
      "Log your emotions with our simple, intuitive check-in system. Track patterns over time.",
  },
  {
    icon: CalendarCheck,
    title: "Care Plan Tasks",
    description:
      "Follow personalized self-care routines created from your therapy sessions.",
  },
  {
    icon: LineChart,
    title: "Progress Insights",
    description:
      "Visualize your emotional journey with charts that show trends and improvements.",
  },
  {
    icon: Bell,
    title: "Gentle Reminders",
    description:
      "Receive timely nudges via SMS or WhatsApp to stay on track with your care plan.",
  },
  {
    icon: MessageCircleHeart,
    title: "Self-Help Resources",
    description:
      "Access curated content and exercises to support your mental wellness journey.",
  },
  {
    icon: Shield,
    title: "Crisis Support",
    description:
      "Quick access to crisis hotlines and resources when you need immediate help.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header showDashboardLink />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Supporting your wellness journey
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Mental Health{" "}
              <span className="text-primary">Companion</span>{" "}
              Between Sessions
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Track your mood, follow your care plan, and access support resources —
              all in one place. Stay engaged with your wellness journey between
              therapy visits.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/dashboard">
                  Start Your Check-In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/dashboard">Learn More</Link>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              🔒 Private & secure. Not a replacement for professional care.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Stay on Track</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed with care to support your mental health journey between sessions
              with your therapist or healthcare provider.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent to-primary/5 p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Take Control of Your Wellness?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start tracking your mood and following your care plan today.
                Your mental health matters, and we're here to support you.
              </p>
              <Button asChild variant="hero" size="xl">
                <Link to="/dashboard">
                  Get Started — It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">MindCare Companion</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This tool supports wellness but is not a replacement for professional mental health care.
              If you're in crisis, please contact a crisis hotline or emergency services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
