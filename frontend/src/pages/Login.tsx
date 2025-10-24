import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  Mail, 
  Phone, 
  Shield, 
  Activity,
  Sparkles
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Activity className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
            <span className="text-2xl font-bold text-gradient">Predify</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Connect your account to start predicting
            </p>
          </div>
          <Badge variant="trust" className="inline-flex">
            <Shield className="w-3 h-3 mr-1" />
            Sybil-Resistant Verification
          </Badge>
        </div>
        
        {/* Login Card */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wallet">
                  <Wallet className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Connect your Web3 wallet to sign in securely
                  </p>
                </div>
                <Button variant="glow" className="w-full" size="lg">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-accent" />
                  <span>Supports MetaMask, WalletConnect, Coinbase Wallet</span>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button variant="default" className="w-full" size="lg">
                  <Mail className="w-5 h-5" />
                  Send Verification Code
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>Spam detection enabled</span>
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button variant="default" className="w-full" size="lg">
                  <Phone className="w-5 h-5" />
                  Send OTP Code
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-accent" />
                  <span>Verified numbers only • No burner phones</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Trust Indicators */}
        <Card className="card-glass border-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-sm">Enhanced Security</h3>
                <p className="text-xs text-muted-foreground">
                  Real-time bot detection and sybil resistance for authentic predictions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
