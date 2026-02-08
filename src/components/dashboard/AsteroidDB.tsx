import { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Satellite,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface NEO {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
    };
    orbiting_body: string;
  }>;
}

interface NASAResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: NEO[];
  };
}

type SortField = 'name' | 'diameter' | 'distance' | 'velocity' | 'hazardous';
type SortDirection = 'asc' | 'desc';

const NASA_API_KEY = '4bhhHVjuBD0zQ1sTDewJLgxD1by6bafyhEQEXush'; // Free demo key - users can get their own at api.nasa.gov

export const AsteroidDB = () => {
  const [asteroids, setAsteroids] = useState<NEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('distance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 7);
      
      const startStr = today.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];
      
      setDateRange({ start: startStr, end: endStr });
      
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${endStr}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data: NASAResponse = await response.json();
      
      // Flatten all NEOs from all dates
      const allNeos: NEO[] = [];
      Object.values(data.near_earth_objects).forEach(dateNeos => {
        allNeos.push(...dateNeos);
      });
      
      setAsteroids(allNeos);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asteroid data');
      console.error('NASA API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-muted-foreground" />;
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-primary" /> 
      : <ArrowDown size={14} className="text-primary" />;
  };

  const filteredAndSortedAsteroids = useMemo(() => {
    let result = [...asteroids];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(neo => 
        neo.name.toLowerCase().includes(query) ||
        neo.id.includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'diameter':
          comparison = a.estimated_diameter.kilometers.estimated_diameter_max - 
                       b.estimated_diameter.kilometers.estimated_diameter_max;
          break;
        case 'distance':
          const distA = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers || '0');
          const distB = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers || '0');
          comparison = distA - distB;
          break;
        case 'velocity':
          const velA = parseFloat(a.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0');
          const velB = parseFloat(b.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0');
          comparison = velA - velB;
          break;
        case 'hazardous':
          comparison = (a.is_potentially_hazardous_asteroid ? 1 : 0) - 
                       (b.is_potentially_hazardous_asteroid ? 1 : 0);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [asteroids, searchQuery, sortField, sortDirection]);

  const getRiskBadge = (isHazardous: boolean) => {
    if (isHazardous) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border text-destructive bg-destructive/10 border-destructive/20">
          <AlertTriangle size={10} />
          HAZARDOUS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border text-cosmic-green bg-cosmic-green/10 border-cosmic-green/20">
        SAFE
      </span>
    );
  };

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="glass-panel rounded-2xl p-8 text-center max-w-md">
          <AlertTriangle className="mx-auto mb-4 text-destructive" size={48} />
          <h3 className="text-lg font-bold mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchAsteroids} className="gap-2">
            <RefreshCw size={16} />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 overflow-y-auto h-[calc(100vh-64px)] pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Database size={20} />
            </div>
            Asteroid Database
          </h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Satellite size={14} />
            Live data from NASA NEO API
            {lastUpdated && (
              <span className="text-xs">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search asteroids..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-background/50 border-border"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchAsteroids}
            disabled={loading}
            className="border-border"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-2xl font-bold text-primary">{asteroids.length}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Objects</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="text-2xl font-bold text-destructive">
            {asteroids.filter(a => a.is_potentially_hazardous_asteroid).length}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Hazardous</div>
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{dateRange.start}</div>
            <div className="text-xs text-muted-foreground">to {dateRange.end}</div>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="text-2xl font-bold text-cosmic-green">
            {filteredAndSortedAsteroids.length}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Filtered Results</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <ScrollArea className="h-[calc(100vh-380px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Designation {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('diameter')}
                >
                  <div className="flex items-center gap-2">
                    Diameter (km) {getSortIcon('diameter')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('distance')}
                >
                  <div className="flex items-center gap-2">
                    Miss Distance (km) {getSortIcon('distance')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('velocity')}
                >
                  <div className="flex items-center gap-2">
                    Velocity (km/h) {getSortIcon('velocity')}
                  </div>
                </TableHead>
                <TableHead>Approach Date</TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('hazardous')}
                >
                  <div className="flex items-center gap-2">
                    Status {getSortIcon('hazardous')}
                  </div>
                </TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedAsteroids.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No asteroids found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedAsteroids.map((neo) => {
                  const approach = neo.close_approach_data[0];
                  return (
                    <TableRow 
                      key={neo.id} 
                      className="border-border hover:bg-foreground/[0.02] transition-colors group"
                    >
                      <TableCell className="font-mono text-primary group-hover:text-primary/80">
                        {neo.name.replace(/[()]/g, '')}
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_min, 3)} - {formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_max, 3)}
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {formatNumber(parseFloat(approach?.miss_distance.kilometers || '0'), 0)}
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {formatNumber(parseFloat(approach?.relative_velocity.kilometers_per_hour || '0'), 0)}
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {approach?.close_approach_date || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getRiskBadge(neo.is_potentially_hazardous_asteroid)}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={neo.nasa_jpl_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground">
        Data provided by{' '}
        <a 
          href="https://api.nasa.gov" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          NASA Open APIs
        </a>
        {' '}• Near Earth Object Web Service (NeoWs)
      </div>
    </div>
  );
};
