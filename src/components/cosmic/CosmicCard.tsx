import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CosmicCardProps {
  children: ReactNode;
  className?: string;
}

export const CosmicCard = ({ children, className }: CosmicCardProps) => {
  return (
    <div className={cn(
      "relative z-10 w-full max-w-md transition-all duration-1000",
      className
    )}>
      <div className="backdrop-blur-xl bg-foreground/5 rounded-3xl shadow-2xl border border-foreground/10 p-8 md:p-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-cosmic-blue rounded-3xl opacity-20 blur-xl" />
        <div className="relative">
          {children}
        </div>
      </div>
      {/* Bottom glow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-r from-primary/20 via-accent/20 to-cosmic-blue/20 blur-2xl" />
    </div>
  );
};
