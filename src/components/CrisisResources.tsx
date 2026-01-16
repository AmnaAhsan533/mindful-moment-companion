import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function CrisisResources() {
  const { t, isRTL } = useLanguage();

  const resources = [
    {
      name: t.umangName,
      description: t.umangDesc,
      phone: "0311-7786264",
      whatsapp: "923117786264",
      icon: "💚",
    },
    {
      name: t.taskeenName,
      description: t.taskeenDesc,
      phone: "0316-8275336",
      whatsapp: "923168275336",
      icon: "🤝",
    },
    {
      name: t.rozanName,
      description: t.rozanDesc,
      phone: "051-2890505",
      icon: "🌸",
    },
    {
      name: t.pakistanHelplineName,
      description: t.pakistanHelplineDesc,
      phone: "0800-22444",
      icon: "🏥",
    },
  ];
  return (
    <Card className={cn("shadow-lg border-destructive/20 bg-gradient-to-br from-card to-destructive/5", isRTL && "font-urdu")} dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          {t.crisisResources}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t.crisisDescription}
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
                        {t.call} {resource.phone}
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
                        {t.whatsApp}
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
            {t.crisisDisclaimer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
