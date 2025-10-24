import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Trophy, LogIn } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Activity className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors" />
          <span className="text-xl font-bold text-gradient">Predify</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Markets
          </Link>
          <Link 
            to="/leaderboard" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isActive('/leaderboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
        </nav>
        
        <Link to="/login">
          <Button variant="glow" size="sm">
            <LogIn className="w-4 h-4" />
            Connect
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
