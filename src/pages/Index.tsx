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
import heroIllustration from "@/assets/mental-health-illustration.png";

const features = [
  {
    icon: Heart,
    title: "Daily Mood Tracking",
    description:
      "Log your emotions with our simple, intuitive check-in system.",
  },
  {
    icon: CalendarCheck,
    title: "Care Plan Tasks",
    description:
      "Follow personalized self-care routines from your therapy sessions.",
  },
  {
    icon: LineChart,
    title: "Progress Insights",
    description:
      "Visualize your emotional journey with clear trends and patterns.",
  },
  {
    icon: Bell,
    title: "Gentle Reminders",
    description:
      "Receive timely nudges to stay on track with your wellness goals.",
  },
  {
    icon: MessageCircleHeart,
    title: "Self-Help Resources",
    description:
      "Access curated content to support your mental wellness journey.",
  },
  {
    icon: Shield,
    title: "Crisis Support",
    description:
      "Quick access to crisis hotlines when you need immediate help.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header showDashboardLink />

      {/* Hero Section - Minimalist Split Layout */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-sm font-medium text-primary mb-4">
              Mental Wellness Companion
            </span>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
              Nurture Your Mind,{" "}
              <span className="text-primary">One Day at a Time</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Track your mood, follow your care plan, and access support — 
              all in one calm, focused space.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-muted-foreground">
              🔒 Private & secure. Not a replacement for professional care.
            </p>
          </div>

          {/* Right Illustration */}
          <div className="order-1 lg:order-2 flex justify-center">
            <img 
              src={heroIllustration} 
              alt="Mental health illustration - person with flowers growing from mind" 
              className="w-full max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Tools for Your <span className="text-primary">Wellness Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple features designed to support your mental health between therapy sessions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simple & Clean */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Begin tracking your mood and following your care plan today.
            </p>
            <Button asChild size="lg" className="rounded-full px-10">
              <Link to="/dashboard">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">MindCare Companion</span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              This tool supports wellness but is not a replacement for professional mental health care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
