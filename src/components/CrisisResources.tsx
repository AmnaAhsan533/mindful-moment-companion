import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ExternalLink } from "lucide-react";

const resources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, 24/7 support for people in distress",
    phone: "988",
    sms: "988",
    icon: "🆘",
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to 741741 for free crisis counseling",
    sms: "741741",
    icon: "💬",
  },
  {
    name: "SAMHSA National Helpline",
    description: "Treatment referrals and information",
    phone: "1-800-662-4357",
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
                  {resource.sms && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={`sms:${resource.sms}`}>
                        <MessageCircle className="h-3 w-3" />
                        Text {resource.sms}
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
