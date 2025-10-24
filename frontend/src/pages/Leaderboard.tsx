import Header from "@/components/Header";
import LeaderboardUser from "@/components/LeaderboardUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar } from "lucide-react";

const Leaderboard = () => {
  // Mock data - expanded leaderboard
  const users = [
    { rank: 1, username: "CryptoOracle", accuracy: 94, totalPredictions: 156, winStreak: 12, verified: true },
    { rank: 2, username: "PredictMaster", accuracy: 92, totalPredictions: 203, winStreak: 8, verified: true },
    { rank: 3, username: "MarketGuru", accuracy: 89, totalPredictions: 178, winStreak: 5, verified: true },
    { rank: 4, username: "FutureSeeker", accuracy: 87, totalPredictions: 145, winStreak: 7, verified: true },
    { rank: 5, username: "TrendAnalyst", accuracy: 86, totalPredictions: 192, winStreak: 4, verified: true },
    { rank: 6, username: "DataDriven", accuracy: 84, totalPredictions: 167, winStreak: 3, verified: false },
    { rank: 7, username: "InsightKing", accuracy: 83, totalPredictions: 134, winStreak: 6, verified: true },
    { rank: 8, username: "SmartBet", accuracy: 82, totalPredictions: 189, winStreak: 2, verified: true },
    { rank: 9, username: "PredictPro", accuracy: 81, totalPredictions: 156, winStreak: 5, verified: false },
    { rank: 10, username: "MarketWhiz", accuracy: 80, totalPredictions: 143, winStreak: 1, verified: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 glow-effect">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground text-lg">
              Top predictors ranked by their on-chain accuracy score
            </p>
          </div>
          
          {/* Time Period Selector */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="default" size="sm">
              <Calendar className="w-4 h-4" />
              This Week
            </Button>
            <Button variant="ghost" size="sm">This Month</Button>
            <Button variant="ghost" size="sm">All Time</Button>
          </div>
          
          {/* Leaderboard */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.map((user) => (
                <LeaderboardUser key={user.rank} {...user} />
              ))}
            </CardContent>
          </Card>
          
          {/* Info Card */}
          <Card className="card-glass border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">How Rankings Work</h3>
                  <p className="text-sm text-muted-foreground">
                    Your accuracy score is calculated from all your resolved predictions. Win streaks 
                    and early predictions on trending markets boost your ranking. All scores are 
                    verified on-chain and sybil-resistant.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
