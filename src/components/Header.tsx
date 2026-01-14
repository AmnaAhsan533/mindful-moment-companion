import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  showDashboardLink?: boolean;
}

export function Header({ showDashboardLink = false }: HeaderProps) {
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
        
        <nav className="flex items-center gap-4">
          {showDashboardLink ? (
            <Button asChild variant="hero" size="sm">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
