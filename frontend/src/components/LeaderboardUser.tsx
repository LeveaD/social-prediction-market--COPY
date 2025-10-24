import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, TrendingUp } from "lucide-react";

interface LeaderboardUserProps {
  rank: number;
  username: string;
  avatar?: string;
  accuracy: number;
  totalPredictions: number;
  winStreak: number;
  verified: boolean;
}

const LeaderboardUser = ({ 
  rank, 
  username, 
  avatar, 
  accuracy, 
  totalPredictions, 
  winStreak,
  verified 
}: LeaderboardUserProps) => {
  const getRankBadge = () => {
    if (rank === 1) return <Badge variant="gold">🏆 #1</Badge>;
    if (rank === 2) return <Badge variant="silver">🥈 #2</Badge>;
    if (rank === 3) return <Badge variant="bronze">🥉 #3</Badge>;
    return <span className="text-muted-foreground font-medium">#{rank}</span>;
  };
  
  return (
    <div className="card-glass p-4 hover:border-primary/30 transition-all duration-300 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 flex items-center justify-center">
          {getRankBadge()}
        </div>
        
        <Avatar className="w-12 h-12 border-2 border-primary/30">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{username}</span>
            {verified && (
              <ShieldCheck className="w-4 h-4 text-accent" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{totalPredictions} predictions</span>
            {winStreak > 0 && (
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{winStreak} streak</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-success">{accuracy}%</div>
          <div className="text-xs text-muted-foreground">accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardUser;
