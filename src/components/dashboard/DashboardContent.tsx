import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Rocket, 
  Zap, 
  Database,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  Download,
  Filter,
  Wifi,
  Server,
  Clock
} from 'lucide-react';
import { StatCard } from './StatCard';
import { OrbitViz } from './OrbitViz';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NEO {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

const NASA_API_KEY = '4bhhHVjuBD0zQ1sTDewJLgxD1by6bafyhEQEXush';

export const DashboardContent = () => {
  const [neos, setNeos] = useState<NEO[]>([]);
  const [filteredNeos, setFilteredNeos] = useState<NEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, hazardous: 0, close: 0, avgVelocity: 0 });
  const [isFilteredByRisk, setIsFilteredByRisk] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const { toast } = useToast();

  const getRiskLevel = useCallback((neo: NEO) => {
    if (neo.is_potentially_hazardous_asteroid) return 'High';
    const dist = parseFloat(neo.close_approach_data[0].miss_distance.kilometers);
    if (dist < 5000000) return 'Medium';
    return 'Low';
  }, []);

  const getRiskPriority = useCallback((risk: string) => {
    switch (risk) {
      case 'High': return 0;
      case 'Medium': return 1;
      default: return 2;
    }
  }, []);

  // Measure real network latency
  const measureLatency = useCallback(async () => {
    const start = performance.now();
    try {
      await fetch('https://api.nasa.gov/planetary/apod?api_key=4bhhHVjuBD0zQ1sTDewJLgxD1by6bafyhEQEXush', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      const end = performance.now();
      setLatency(Math.round(end - start));
      setApiStatus('online');
    } catch {
      setApiStatus('offline');
      setLatency(null);
    }
  }, []);

  // Fetch real data from NASA API
  const fetchNeoData = useCallback(async () => {
    setLoading(true);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const startDate = today.toISOString().split('T')[0];
    const endDate = nextWeek.toISOString().split('T')[0];

    try {
      const startTime = performance.now();
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
      );
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setApiStatus('online');

      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const allNeos: NEO[] = [];
      
      Object.values(data.near_earth_objects).forEach((dayNeos: any) => {
        dayNeos.forEach((neo: any) => {
          allNeos.push({
            id: neo.id,
            name: neo.name,
            estimated_diameter: neo.estimated_diameter,
            is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid,
            close_approach_data: neo.close_approach_data
          });
        });
      });

      // Sort by closest approach
      const sorted = [...allNeos].sort((a, b) => {
        const distA = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
        const distB = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
        return distA - distB;
      });

      const hazardousCount = sorted.filter(n => n.is_potentially_hazardous_asteroid).length;
      const totalVelocity = sorted.reduce((acc, curr) => 
        acc + parseFloat(curr.close_approach_data[0].relative_velocity.kilometers_per_hour), 0
      );

      setStats({
        total: sorted.length,
        hazardous: hazardousCount,
        close: sorted.length ? parseFloat((parseFloat(sorted[0].close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)) : 0,
        avgVelocity: sorted.length ? parseFloat((totalVelocity / sorted.length).toFixed(0)) : 0
      });
      
      setNeos(sorted);
      setFilteredNeos(sorted);
      setIsFilteredByRisk(false);
    } catch (error) {
      console.error('Error fetching NEO data:', error);
      setApiStatus('offline');
      toast({
        title: "API Error",
        description: "Failed to fetch data from NASA API. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNeoData();
    
    // Measure latency every 30 seconds
    const latencyInterval = setInterval(measureLatency, 30000);
    return () => clearInterval(latencyInterval);
  }, [fetchNeoData, measureLatency]);

  // Filter by risk level
  const handleFilter = () => {
    if (isFilteredByRisk) {
      // Reset to original order (by distance)
      setFilteredNeos([...neos]);
      setIsFilteredByRisk(false);
    } else {
      // Sort by risk: High -> Medium -> Low
      const sorted = [...neos].sort((a, b) => {
        const riskA = getRiskPriority(getRiskLevel(a));
        const riskB = getRiskPriority(getRiskLevel(b));
        return riskA - riskB;
      });
      setFilteredNeos(sorted);
      setIsFilteredByRisk(true);
    }
  };

  // Download report as CSV
  const handleDownloadReport = () => {
    const headers = ['Object Designation', 'Diameter (km)', 'Miss Distance (km)', 'Velocity (km/h)', 'Risk Level', 'Hazardous'];
    const rows = filteredNeos.map(neo => [
      neo.name,
      neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3),
      parseInt(neo.close_approach_data[0].miss_distance.kilometers).toString(),
      parseInt(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toString(),
      getRiskLevel(neo),
      neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `neo_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Downloaded",
      description: `Downloaded ${filteredNeos.length} objects to CSV file.`
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'Medium': return 'text-cosmic-gold bg-cosmic-gold/10 border-cosmic-gold/20';
      default: return 'text-cosmic-green bg-cosmic-green/10 border-cosmic-green/20';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-primary" size={40} />
          <p className="text-primary font-mono text-sm animate-pulse">ESTABLISHING UPLINK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 overflow-y-auto h-[calc(100vh-64px)] pb-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active NEOs"
          value={stats.total}
          subtext="Objects tracked today"
          icon={Activity}
          colorClass="bg-cosmic-blue"
          trend={12}
        />
        <StatCard
          title="Hazardous"
          value={stats.hazardous}
          subtext="Potentially dangerous"
          icon={AlertTriangle}
          colorClass="bg-destructive"
          trend={0}
        />
        <StatCard
          title="Nearest Approach"
          value={`${stats.close}M km`}
          subtext="Closest object today"
          icon={Rocket}
          colorClass="bg-accent"
        />
        <StatCard
          title="Avg Velocity"
          value={`${(stats.avgVelocity / 1000).toFixed(1)}k km/h`}
          subtext="Relative orbital speed"
          icon={Zap}
          colorClass="bg-cosmic-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Database size={18} className="text-primary" />
              Approach Manifest
              <span className="text-xs text-muted-foreground font-normal">({filteredNeos.length} objects)</span>
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleFilter}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all",
                  isFilteredByRisk 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-foreground/5 text-muted-foreground hover:text-foreground"
                )}
              >
                <Filter size={12} />
                {isFilteredByRisk ? 'Clear Filter' : 'Sort by Risk'}
              </button>
              <button 
                onClick={handleDownloadReport}
                className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium border border-primary/30 flex items-center gap-1 hover:bg-primary/30 transition-all"
              >
                <Download size={12} />
                Download Report
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-foreground/[0.02] text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                  <th className="p-4">Object Designation</th>
                  <th className="p-4">Diameter (km)</th>
                  <th className="p-4">Miss Dist (km)</th>
                  <th className="p-4">Velocity (km/h)</th>
                  <th className="p-4">Risk Assessment</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredNeos.slice(0, 20).map(neo => {
                  const risk = getRiskLevel(neo);
                  return (
                    <tr key={neo.id} className="hover:bg-foreground/[0.02] transition-colors group">
                      <td className="p-4 font-mono text-primary group-hover:text-primary/80">{neo.name}</td>
                      <td className="p-4 text-foreground/80">{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}</td>
                      <td className="p-4 text-foreground/80">{parseInt(neo.close_approach_data[0].miss_distance.kilometers).toLocaleString()}</td>
                      <td className="p-4 text-foreground/80">{parseInt(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          getRiskColor(risk)
                        )}>
                          {risk === 'High' && <AlertTriangle size={10} />}
                          {risk.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <ChevronDown size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Widgets */}
        <div className="space-y-6">
          {/* Live Map Widget */}
          <div className="glass-panel rounded-2xl p-1 h-64 relative overflow-hidden group">
            <div className="absolute inset-0 z-0">
              <OrbitViz />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent z-10">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-bold text-foreground mb-1">Live Orrery</h4>
                  <p className="text-xs text-muted-foreground">Heliocentric Projection</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shadow-[0_0_10px_hsl(var(--destructive))]" />
              </div>
            </div>
          </div>

          {/* System Status Widget */}
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Server size={16} className="text-primary" />
              System Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi size={14} className={apiStatus === 'online' ? 'text-cosmic-green' : 'text-destructive'} />
                  <span className="text-sm text-muted-foreground">API Status</span>
                </div>
                <span className={cn(
                  "text-xs font-semibold uppercase",
                  apiStatus === 'online' ? 'text-cosmic-green' : apiStatus === 'offline' ? 'text-destructive' : 'text-cosmic-gold'
                )}>
                  {apiStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-cosmic-blue" />
                  <span className="text-sm text-muted-foreground">Latency</span>
                </div>
                <span className={cn(
                  "text-xs font-mono font-semibold",
                  latency && latency < 200 ? 'text-cosmic-green' : latency && latency < 500 ? 'text-cosmic-gold' : 'text-destructive'
                )}>
                  {latency ? `${latency}ms` : '---'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-accent" />
                  <span className="text-sm text-muted-foreground">Data Feed</span>
                </div>
                <span className="text-xs text-cosmic-green font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cosmic-green rounded-full animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Alert Widget */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary">
            <h4 className="font-bold text-foreground mb-2">Automated Alert</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {stats.hazardous > 0 
                ? `System detected ${stats.hazardous} hazardous objects in the current tracking window. Monitoring active.`
                : 'All tracked objects within safe parameters. No immediate threats detected.'}
            </p>
            <button 
              onClick={fetchNeoData}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              <RefreshCw size={12} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
