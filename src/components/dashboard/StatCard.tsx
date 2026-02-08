import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  colorClass: string;
  trend?: number;
}

export const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }: StatCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity",
        colorClass
      )} />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-foreground">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg bg-foreground/5", colorClass.replace('bg-', 'text-'))}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded",
            trend > 0 
              ? "bg-destructive/20 text-destructive" 
              : "bg-cosmic-green/20 text-cosmic-green"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
};
