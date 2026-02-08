import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
  avatar: string;
}

const autoResponses = [
  "That's interesting! Tell me more 😊",
  "I totally agree with you!",
  "Thanks for sharing that!",
  "Haha, that's funny! 😄",
  "Really? I didn't know that!",
  "That makes a lot of sense!",
  "Cool! What else is new?",
  "I see what you mean 👍",
  "Welcome to CosmicWatch! 🚀",
  "Great question about asteroids!",
  "The cosmos is vast and beautiful ✨",
  "Have you checked the latest NEO data?",
];

export const DashboardChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! Welcome to CosmicWatch Chat 👋🚀",
      isSent: false,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      avatar: 'C'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const addMessage = (text: string, isSent: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isSent,
      timestamp: getCurrentTime(),
      avatar: isSent ? 'Y' : 'C'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateResponse = () => {
    setIsTyping(true);
    const delay = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      addMessage(randomResponse, false);
    }, delay);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    
    addMessage(text, true);
    setInputValue('');
    
    // 70% chance to get a response
    if (Math.random() > 0.3) {
      simulateResponse();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl h-full max-h-[700px] glass-panel rounded-2xl overflow-hidden border border-border flex flex-col shadow-2xl shadow-primary/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl flex items-center gap-3">
              💬 CosmicWatch Chat
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2.5 h-2.5 bg-cosmic-green rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="flex flex-col gap-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 max-w-[75%] animate-in slide-in-from-bottom-2 duration-300",
                  message.isSent ? "self-end flex-row-reverse" : "self-start"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0 shadow-lg",
                    message.isSent
                      ? "bg-gradient-to-br from-accent to-primary text-foreground"
                      : "bg-gradient-to-br from-primary to-cosmic-blue text-foreground"
                  )}
                >
                  {message.avatar}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div
                    className={cn(
                      "px-5 py-3 rounded-2xl text-sm shadow-md",
                      message.isSent
                        ? "bg-gradient-to-br from-primary to-accent text-foreground rounded-br-md"
                        : "bg-foreground/5 text-foreground border border-border rounded-bl-md"
                    )}
                  >
                    {message.text}
                  </div>
                  <span className={cn(
                    "text-xs text-muted-foreground px-2",
                    message.isSent && "text-right"
                  )}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4 max-w-[75%] animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-cosmic-blue flex items-center justify-center text-base font-semibold flex-shrink-0 shadow-lg">
                  C
                </div>
                <div className="px-5 py-4 rounded-2xl bg-foreground/5 border border-border rounded-bl-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-5 border-t border-border bg-background/50">
          <div className="flex gap-4">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-foreground/5 border-border rounded-full px-5 py-6 text-base"
            />
            <Button
              onClick={handleSend}
              size="lg"
              className="rounded-full bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity px-6"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
