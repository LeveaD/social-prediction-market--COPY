import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MarketCard from "@/components/MarketCard";
import LeaderboardUser from "@/components/LeaderboardUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Users, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"trending" | "new" | "ending">("trending");
  
  // Mock data
  const markets = [
    {
      id: "1",
      title: "Will Bitcoin reach $100,000 by end of 2025?",
      category: "Crypto",
      participants: 1234,
      odds: { yes: 67, no: 33 },
      volume: "$45.2K",
      endsIn: "3 days",
      trending: true,
    },
    {
      id: "2",
      title: "Will SpaceX successfully land on Mars in 2026?",
      category: "Technology",
      participants: 892,
      odds: { yes: 42, no: 58 },
      volume: "$32.1K",
      endsIn: "5 days",
      trending: true,
    },
    {
      id: "3",
      title: "Next US President to be from Democratic Party?",
      category: "Politics",
      participants: 2105,
      odds: { yes: 55, no: 45 },
      volume: "$78.5K",
      endsIn: "7 days",
      trending: false,
    },
    {
      id: "4",
      title: "Will AI replace 50% of jobs by 2030?",
      category: "Technology",
      participants: 1567,
      odds: { yes: 38, no: 62 },
      volume: "$51.3K",
      endsIn: "2 days",
      trending: false,
    },
  ];
  
  const topUsers = [
    { rank: 1, username: "CryptoOracle", accuracy: 94, totalPredictions: 156, winStreak: 12, verified: true },
    { rank: 2, username: "PredictMaster", accuracy: 92, totalPredictions: 203, winStreak: 8, verified: true },
    { rank: 3, username: "MarketGuru", accuracy: 89, totalPredictions: 178, winStreak: 5, verified: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="trust" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Sybil-Resistant
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Predict the Future,
              <br />
              <span className="text-gradient">Earn Reputation</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the most credible prediction market. Make accurate calls, build on-chain reputation, 
              and earn rewards in real-time community rooms.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/login">
                <Button variant="glow" size="lg" className="text-base">
                  <Zap className="w-5 h-5" />
                  Start Predicting
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg" className="text-base">
                  <TrendingUp className="w-5 h-5" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gradient">12.5K+</div>
                <div className="text-sm text-muted-foreground">Active Predictors</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gradient">$2.4M</div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gradient">87%</div>
                <div className="text-sm text-muted-foreground">Avg. Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Markets Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Live Markets</h2>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === "trending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("trending")}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </Button>
              <Button 
                variant={activeTab === "new" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("new")}
              >
                New
              </Button>
              <Button 
                variant={activeTab === "ending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("ending")}
              >
                Ending Soon
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => (
              <MarketCard key={market.id} {...market} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Top Predictors */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Top Predictors This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topUsers.map((user) => (
                  <LeaderboardUser key={user.rank} {...user} />
                ))}
                <Link to="/leaderboard" className="block pt-4">
                  <Button variant="outline" className="w-full">
                    View Full Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
