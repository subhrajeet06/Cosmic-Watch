import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CosmicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const CosmicInput = forwardRef<HTMLInputElement, CosmicInputProps>(
  ({ label, error, rightElement, className, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full px-4 py-3 bg-foreground/5 border rounded-xl text-foreground placeholder-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300",
              error ? "border-destructive" : "border-foreground/10",
              rightElement && "pr-12",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

CosmicInput.displayName = 'CosmicInput';
