import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { SolarSystem3D } from '@/components/dashboard/SolarSystem3D';
import { AsteroidDB } from '@/components/dashboard/AsteroidDB';
import { DashboardChat } from '@/components/dashboard/DashboardChat';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col h-full relative z-0">
        {/* Noise overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" 
          }} 
        />

        <TopBar onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 relative overflow-hidden">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === '3d-viz' && <SolarSystem3D />}
          {activeTab === 'asteroid-db' && <AsteroidDB />}
          {activeTab === 'realtime-chat' && <DashboardChat />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
