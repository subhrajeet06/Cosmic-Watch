import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, LogOut } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      const namePart = email.split('@')[0];
      // Capitalize first letter of each word
      const formattedName = namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setUserName(formattedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <header className="h-16 border-b border-border glass-panel flex items-center justify-between px-4 md:px-8 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5"
        >
          <Menu size={24} />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex items-center bg-foreground/5 border border-border rounded-full px-4 py-2 w-64 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <Search size={18} className="text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Data designation..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-foreground w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <div className="relative">
          <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border border-background" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-border" />

        {/* User Profile */}
        <div className="flex items-center gap-3 group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {userName}
            </div>
            <div className="text-xs text-muted-foreground">Level 5 Clearance</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-muted to-muted-foreground/20 border border-border overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=b6e3f4`}
              alt="User" 
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="h-8 w-[1px] bg-border" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
          title="Log Out"
        >
          <LogOut size={20} />
          <span className="hidden md:inline text-sm">Log Out</span>
        </button>
      </div>
    </header>
  );
};
