import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CosmicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const CosmicButton = forwardRef<HTMLButtonElement, CosmicButtonProps>(
  ({ variant = 'primary', isLoading, className, children, disabled, ...props }, ref) => {
    const baseStyles = "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300";
    
    const variants = {
      primary: cn(
        "bg-gradient-to-r from-primary via-cosmic-blue to-accent text-foreground",
        "hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-[1.02] active:scale-[0.98]",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none"
      ),
      secondary: cn(
        "bg-foreground/5 border border-foreground/10 text-foreground",
        "hover:bg-foreground/10 hover:border-primary/30",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed"
      ),
      ghost: cn(
        "text-muted-foreground hover:text-primary",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed"
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

CosmicButton.displayName = 'CosmicButton';
