import { Heart, LogOut, Sparkles, Calendar, Menu, Languages, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  showDashboardLink?: boolean;
}

export function Header({ showDashboardLink = false }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => setOpen(false);

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => {
    if (!user) {
      if (showDashboardLink) {
        return (
          <Button asChild variant="hero" size="sm" onClick={handleNavClick}>
            <Link to="/auth">{t.getStarted}</Link>
          </Button>
        );
      }
      return (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className={cn(isActive("/") && "bg-accent text-accent-foreground")}
            onClick={handleNavClick}
          >
            <Link to="/">{t.home}</Link>
          </Button>
          <Button variant="hero" size="sm" asChild onClick={handleNavClick}>
            <Link to="/auth">{t.signIn}</Link>
          </Button>
        </>
      );
    }

    return (
      <div className={cn(mobile ? "flex flex-col gap-2" : "flex items-center gap-2")}>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className={cn(
            isActive("/dashboard") && "bg-accent text-accent-foreground",
            mobile && "justify-start"
          )}
          onClick={handleNavClick}
        >
          <Link to="/dashboard">{t.dashboard}</Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className={cn(
            isActive("/care-plan") && "bg-accent text-accent-foreground",
            mobile && "justify-start"
          )}
          onClick={handleNavClick}
        >
          <Link to="/care-plan" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>{t.carePlan}</span>
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className={cn(
            isActive("/support") && "bg-accent text-accent-foreground",
            mobile && "justify-start"
          )}
          onClick={handleNavClick}
        >
          <Link to="/support" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{t.support}</span>
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className={cn(
            isActive("/sessions") && "bg-accent text-accent-foreground",
            mobile && "justify-start"
          )}
          onClick={handleNavClick}
        >
          <Link to="/sessions" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{t.sessions}</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className={cn(mobile && "justify-start")}>
          <LogOut className="h-4 w-4 mr-1" />
          <span>{t.signOut}</span>
        </Button>
      </div>
    );
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg", isRTL && "font-urdu")} dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold">
            MindCare<span className="text-primary">Companion</span>
          </span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1"
          >
            <Languages className="h-4 w-4" />
            <span>{language === "en" ? "اردو" : "English"}</span>
          </Button>
          <NavItems />
        </nav>

        {/* Mobile hamburger menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>MindCare</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-1 justify-start"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "اردو" : "English"}</span>
              </Button>
              <NavItems mobile />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
