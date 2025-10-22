import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Send, 
  Shield,
  Clock,
  DollarSign
} from "lucide-react";

const MarketRoom = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  
  // Mock data
  const market = {
    title: "Will Bitcoin reach $100,000 by end of 2025?",
    category: "Crypto",
    description: "This market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange by December 31, 2025, 23:59:59 UTC.",
    odds: { yes: 67, no: 33 },
    totalVolume: "$45,234",
    participants: 1234,
    endsIn: "3 days 14 hours",
  };
  
  const messages = [
    {
      username: "CryptoOracle",
      message: "Based on the halving cycle and institutional adoption, I'm highly confident we'll hit 100K by Q4.",
      timestamp: "2m ago",
      accuracy: 94,
      verified: true,
    },
    {
      username: "MarketGuru",
      message: "The macro environment is still uncertain. I'd give it 50/50 odds at best.",
      timestamp: "5m ago",
      accuracy: 89,
      verified: true,
    },
    {
      username: "TrendAnalyst",
      message: "ETF inflows are stronger than ever. This looks bullish to me.",
      timestamp: "8m ago",
      accuracy: 86,
      verified: true,
    },
  ];
  
  const participants = [
    { username: "CryptoOracle", accuracy: 94, verified: true, position: "YES" },
    { username: "PredictMaster", accuracy: 92, verified: true, position: "NO" },
    { username: "MarketGuru", accuracy: 89, verified: true, position: "YES" },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message logic here
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Column - Market Details & Predictions */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto">
            {/* Market Info */}
            <Card className="card-glass">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Badge variant="trust">{market.category}</Badge>
                    <CardTitle className="text-2xl">{market.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{market.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Volume
                    </div>
                    <div className="font-bold">{market.totalVolume}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Participants
                    </div>
                    <div className="font-bold">{market.participants}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Ends In
                    </div>
                    <div className="font-bold">{market.endsIn}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Prediction Interface */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-lg">Make Your Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Odds Display */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Odds</span>
                    <Badge variant="trust">
                      <Shield className="w-3 h-3 mr-1" />
                      AI Monitored
                    </Badge>
                  </div>
                  <Progress value={market.odds.yes} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-success font-bold text-lg">{market.odds.yes}%</span>
                      <span className="text-muted-foreground">YES</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">NO</span>
                      <span className="text-destructive font-bold text-lg">{market.odds.no}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Prediction Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 border-success/30 hover:bg-success/10 hover:border-success/50"
                  >
                    <TrendingUp className="w-6 h-6 text-success" />
                    <span className="font-semibold">Predict YES</span>
                    <span className="text-xs text-muted-foreground">Win if BTC hits $100K</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                  >
                    <TrendingUp className="w-6 h-6 text-destructive rotate-180" />
                    <span className="font-semibold">Predict NO</span>
                    <span className="text-xs text-muted-foreground">Win if BTC stays below</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Active Participants */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {participants.map((participant, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participant.username}</span>
                        {participant.verified && <Shield className="w-3 h-3 text-accent" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="success" className="text-xs">{participant.accuracy}%</Badge>
                        <Badge variant={participant.position === "YES" ? "default" : "destructive"}>
                          {participant.position}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Live Chat */}
          <div className="lg:col-span-1">
            <Card className="card-glass h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Live Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} {...msg} />
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Input
                    placeholder="Share your analysis..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="glow"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketRoom;
