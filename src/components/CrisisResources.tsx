import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const resources = [
  {
    name: "Umang Helpline",
    description: "Mental health support and counseling services",
    phone: "0311-7786264",
    whatsapp: "923117786264",
    icon: "💚",
  },
  {
    name: "Taskeen",
    description: "Free mental health support via WhatsApp",
    phone: "0316-8275336",
    whatsapp: "923168275336",
    icon: "🤝",
  },
  {
    name: "Rozan Counseling",
    description: "Trauma, abuse, and emotional support services",
    phone: "051-2890505",
    icon: "🌸",
  },
  {
    name: "Pakistan Mental Health Helpline",
    description: "24/7 toll-free mental health support",
    phone: "0800-22444",
    icon: "🏥",
  },
];

export function CrisisResources() {
  return (
    <Card className="shadow-lg border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          Crisis Resources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          If you're in crisis or need immediate support, help is available 24/7.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.name}
            className="p-4 rounded-lg bg-card border border-border"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{resource.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{resource.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.description}
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {resource.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={`tel:${resource.phone}`}>
                        <Phone className="h-3 w-3" />
                        Call {resource.phone}
                      </a>
                    </Button>
                  )}
                  {resource.whatsapp && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a 
                        href={`https://wa.me/${resource.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Remember: This app supports your wellness journey but is not a replacement for professional care.
            Always reach out to a mental health professional or emergency services if you're in crisis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
