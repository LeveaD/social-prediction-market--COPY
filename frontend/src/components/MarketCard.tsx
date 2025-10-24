import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  participants: number;
  odds: {
    yes: number;
    no: number;
  };
  volume: string;
  endsIn: string;
  trending?: boolean;
}

const MarketCard = ({ 
  id, 
  title, 
  category, 
  participants, 
  odds, 
  volume, 
  endsIn, 
  trending 
}: MarketCardProps) => {
  return (
    <Card className="card-glass hover:border-primary/30 transition-all duration-300 group overflow-hidden">
      {trending && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={trending ? "trust" : "outline"}>{category}</Badge>
          {trending && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="w-3 h-3" />
              <span>Hot</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Yes</span>
            <span className="font-bold text-success">{odds.yes}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">No</span>
            <span className="font-bold text-destructive">{odds.no}%</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{endsIn}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link to={`/market/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Market</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MarketCard;
