import { Heart, LogOut, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  showDashboardLink?: boolean;
}

export function Header({ showDashboardLink = false }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold">
            MindCare<span className="text-primary">Companion</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/care-plan" className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Care Plan</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sessions" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Sessions</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : showDashboardLink ? (
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">Get Started</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
