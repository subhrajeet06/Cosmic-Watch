import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
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
];

export const RealtimeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-gradient-to-br from-primary to-accent",
          "flex items-center justify-center",
          "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
          "transition-all duration-300 hover:scale-105",
          "border border-primary/20"
        )}
      >
        {isOpen ? (
          <X className="text-foreground" size={24} />
        ) : (
          <MessageCircle className="text-foreground" size={24} />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)]",
          "glass-panel rounded-2xl overflow-hidden",
          "shadow-2xl shadow-primary/20 border border-border",
          "transition-all duration-300 transform origin-bottom-right",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              💬 CosmicWatch Chat
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 bg-cosmic-green rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-80 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[85%] animate-in slide-in-from-bottom-2 duration-300",
                  message.isSent ? "self-end flex-row-reverse" : "self-start"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                    message.isSent
                      ? "bg-gradient-to-br from-accent to-primary text-foreground"
                      : "bg-gradient-to-br from-primary to-cosmic-blue text-foreground"
                  )}
                >
                  {message.avatar}
                </div>
                <div className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm",
                      message.isSent
                        ? "bg-gradient-to-br from-primary to-accent text-foreground rounded-br-md"
                        : "bg-foreground/5 text-foreground border border-border rounded-bl-md"
                    )}
                  >
                    {message.text}
                  </div>
                  <span className={cn(
                    "text-[10px] text-muted-foreground px-2",
                    message.isSent && "text-right"
                  )}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-cosmic-blue flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  C
                </div>
                <div className="px-4 py-3 rounded-2xl bg-foreground/5 border border-border rounded-bl-md flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-foreground/5 border-border rounded-full px-4"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
