import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface ChatMessageProps {
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  accuracy: number;
  verified: boolean;
}

const ChatMessage = ({ 
  username, 
  avatar, 
  message, 
  timestamp, 
  accuracy, 
  verified 
}: ChatMessageProps) => {
  return (
    <div className="flex gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
      <Avatar className="w-8 h-8 border border-primary/20">
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback className="text-xs">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{username}</span>
          {verified && <ShieldCheck className="w-3 h-3 text-accent" />}
          <Badge variant="success" className="text-[10px] py-0 px-1.5">
            {accuracy}%
          </Badge>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-sm text-foreground/90 break-words">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
