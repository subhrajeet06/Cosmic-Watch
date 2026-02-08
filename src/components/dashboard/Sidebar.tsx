import { 
  LayoutDashboard, 
  Map, 
  Database, 
  MessageCircle, 
  Radio 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import cosmicWatchLogo from '@/assets/cosmic-watch-logo.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Mission Control' },
  { id: '3d-viz', icon: Map, label: '3D Visualisation' },
  { id: 'asteroid-db', icon: Database, label: 'Asteroid DB' },
  { id: 'realtime-chat', icon: MessageCircle, label: 'Real-Time Chat' },
];

export const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-border",
        "transform transition-transform duration-300 ease-in-out flex flex-col",
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        "md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <img 
            src={cosmicWatchLogo} 
            alt="Cosmic Watch Logo" 
            className="w-12 h-12 rounded-full object-contain"
          />
          <div>
            <h1 className="font-bold text-xl tracking-wide">
              Cosmic<span className="text-primary">Watch</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Mission Control</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id
                  ? "bg-gradient-to-r from-primary/10 to-cosmic-blue/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  activeTab === item.id 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                )} 
              />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
              )}
            </button>
          ))}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-accent/20 to-cosmic-blue/20 rounded-xl p-4 border border-border relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent mb-1">
                <Radio size={12} className="animate-pulse" />
                SYSTEM STATUS
              </div>
              <div className="text-sm font-bold text-foreground mb-2">Connected to DSN</div>
              <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                <div className="h-full bg-cosmic-green w-full animate-pulse" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Latency: 42ms</span>
                <span>Up: 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
