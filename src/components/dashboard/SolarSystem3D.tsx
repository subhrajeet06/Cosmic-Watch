import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Pause, Play, Eye, EyeOff, RotateCcw, Tag, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';

// Planet data configuration
const PLANET_DATA = [
  { name: 'Mercury', distance: 15, size: 1.5, color: '#8C7853', speed: 0.04, tilt: 0.034 },
  { name: 'Venus', distance: 22, size: 2.3, color: '#FFC649', speed: 0.015, tilt: 2.64 },
  { name: 'Earth', distance: 30, size: 2.5, color: '#4a9eff', speed: 0.01, tilt: 23.5, hasMoon: true },
  { name: 'Mars', distance: 40, size: 2, color: '#ff6b4a', speed: 0.008, tilt: 25.2 },
  { name: 'Jupiter', distance: 60, size: 8, color: '#DAA520', speed: 0.002, tilt: 3.13 },
  { name: 'Saturn', distance: 80, size: 7, color: '#F4C542', speed: 0.0009, tilt: 26.73, hasRings: true },
  { name: 'Uranus', distance: 100, size: 5, color: '#4FD0E7', speed: 0.0004, tilt: 97.77 },
  { name: 'Neptune', distance: 120, size: 5, color: '#4166F5', speed: 0.0001, tilt: 28.32 },
];

interface AsteroidData {
  name: string;
  isHazardous: boolean;
  distance: number;
  diameter: number;
  velocity: number;
  orbitDistance: number;
  speed: number;
  angle: number;
  yOffset: number;
}

// Generate sample asteroids
const generateAsteroids = (): AsteroidData[] => {
  const asteroids: AsteroidData[] = [];
  for (let i = 0; i < 15; i++) {
    asteroids.push({
      name: `Asteroid ${i + 1}`,
      isHazardous: Math.random() > 0.7,
      distance: parseFloat((Math.random() * 2).toFixed(4)),
      diameter: parseFloat((Math.random() * 500).toFixed(2)),
      velocity: Math.floor(Math.random() * 50000),
      orbitDistance: 35 + Math.random() * 30,
      speed: 0.005 + Math.random() * 0.01,
      angle: (i / 15) * Math.PI * 2,
      yOffset: (Math.random() - 0.5) * 10,
    });
  }
  return asteroids;
};

// Sun component
const Sun = ({ onClick }: { onClick: (name: string, data: any) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        onClick={() => onClick('Sun', { type: 'Star', temperature: '5,500°C' })}
      >
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#FDB813" transparent opacity={0.3} />
      </mesh>
      {/* Point light from sun */}
      <pointLight color="#ffffff" intensity={2} distance={500} />
    </group>
  );
};

// Planet component
const Planet = ({ 
  data, 
  showOrbits, 
  showLabels,
  isAnimating,
  onClick 
}: { 
  data: typeof PLANET_DATA[0]; 
  showOrbits: boolean;
  showLabels: boolean;
  isAnimating: boolean;
  onClick: (name: string, data: any) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    if (meshRef.current && isAnimating) {
      angleRef.current += data.speed;
      meshRef.current.position.x = Math.cos(angleRef.current) * data.distance;
      meshRef.current.position.z = Math.sin(angleRef.current) * data.distance;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * data.distance,
        0,
        Math.sin(angle) * data.distance
      ));
    }
    return points;
  }, [data.distance]);

  return (
    <group>
      {/* Orbit line */}
      {showOrbits && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitPoints.length}
              array={new Float32Array(orbitPoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4a9eff" transparent opacity={0.3} />
        </line>
      )}

      {/* Planet */}
      <mesh
        ref={meshRef}
        position={[data.distance, 0, 0]}
        onClick={() => onClick(data.name, { 
          type: 'Planet', 
          orbit: `${data.distance} AU (scaled)`,
          orbitalSpeed: data.speed.toFixed(4),
          axialTilt: `${data.tilt}°`
        })}
      >
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshPhongMaterial 
          color={data.color} 
          emissive={data.color} 
          emissiveIntensity={0.2} 
          shininess={30}
        />

        {/* Moon for Earth */}
        {data.hasMoon && (
          <mesh position={[5, 0, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshPhongMaterial color="#aaaaaa" />
          </mesh>
        )}

        {/* Rings for Saturn */}
        {data.hasRings && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.size * 1.5, data.size * 2.5, 64]} />
            <meshBasicMaterial color="#C8A870" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
        )}

        {/* Label */}
        {showLabels && (
          <Html
            position={[0, data.size + 2, 0]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-xs px-2 py-1 rounded bg-background/80 text-foreground whitespace-nowrap border border-border">
              {data.name}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};

// Asteroid component
const Asteroid = ({ 
  data, 
  isAnimating,
  showLabels,
  onClick 
}: { 
  data: AsteroidData; 
  isAnimating: boolean;
  showLabels: boolean;
  onClick: (name: string, data: any) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(data.angle);

  useFrame(() => {
    if (meshRef.current && isAnimating) {
      angleRef.current += data.speed;
      meshRef.current.position.x = Math.cos(angleRef.current) * data.orbitDistance;
      meshRef.current.position.z = Math.sin(angleRef.current) * data.orbitDistance;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  const color = data.isHazardous ? '#ff4444' : '#44ff44';

  return (
    <mesh
      ref={meshRef}
      position={[
        Math.cos(data.angle) * data.orbitDistance,
        data.yOffset,
        Math.sin(data.angle) * data.orbitDistance
      ]}
      onClick={() => onClick(data.name, {
        type: 'Asteroid',
        status: data.isHazardous ? 'HAZARDOUS' : 'Safe',
        distance: `${data.distance} AU`,
        diameter: `${data.diameter} km`,
        velocity: `${data.velocity.toLocaleString()} km/h`
      })}
    >
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshPhongMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={data.isHazardous ? 0.5 : 0.2} 
      />
      {showLabels && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div className={cn(
            "text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap border",
            data.isHazardous 
              ? "bg-destructive/80 text-destructive-foreground border-destructive" 
              : "bg-cosmic-green/20 text-cosmic-green border-cosmic-green/40"
          )}>
            {data.name}
          </div>
        </Html>
      )}
    </mesh>
  );
};

// Camera reset component
const CameraController = ({ resetTrigger }: { resetTrigger: number }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (resetTrigger > 0) {
      camera.position.set(50, 80, 150);
      camera.lookAt(0, 0, 0);
    }
  }, [resetTrigger, camera]);

  return null;
};

// Main scene component
const SolarSystemScene = ({ 
  isAnimating, 
  showOrbits, 
  showLabels,
  resetTrigger,
  onObjectClick 
}: { 
  isAnimating: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  resetTrigger: number;
  onObjectClick: (name: string, data: any) => void;
}) => {
  const asteroids = useMemo(() => generateAsteroids(), []);

  return (
    <>
      <CameraController resetTrigger={resetTrigger} />
      <ambientLight intensity={0.4} />
      <Stars radius={1000} depth={500} count={10000} factor={4} fade speed={1} />
      <fog attach="fog" args={['#000000', 100, 1000]} />
      
      <Sun onClick={onObjectClick} />
      
      {PLANET_DATA.map((planet) => (
        <Planet 
          key={planet.name} 
          data={planet} 
          showOrbits={showOrbits}
          showLabels={showLabels}
          isAnimating={isAnimating}
          onClick={onObjectClick}
        />
      ))}
      
      {asteroids.map((asteroid, i) => (
        <Asteroid 
          key={i} 
          data={asteroid} 
          isAnimating={isAnimating}
          showLabels={showLabels}
          onClick={onObjectClick}
        />
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={30}
        maxDistance={500}
      />
    </>
  );
};

// Legend items
const LEGEND_ITEMS = [
  { name: 'Sun', color: '#FDB813' },
  { name: 'Mercury', color: '#8C7853' },
  { name: 'Venus', color: '#FFC649' },
  { name: 'Earth', color: '#4a9eff' },
  { name: 'Mars', color: '#ff6b4a' },
  { name: 'Jupiter', color: '#DAA520' },
  { name: 'Saturn', color: '#F4C542' },
  { name: 'Uranus', color: '#4FD0E7' },
  { name: 'Neptune', color: '#4166F5' },
  { name: 'Hazardous Asteroids', color: '#ff4444' },
  { name: 'Safe Asteroids', color: '#44ff44' },
];

export const SolarSystem3D = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedObject, setSelectedObject] = useState<{ name: string; data: any } | null>(null);

  const handleObjectClick = (name: string, data: any) => {
    setSelectedObject({ name, data });
  };

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas
        camera={{ position: [50, 80, 150], fov: 75, near: 0.1, far: 10000 }}
        style={{ background: '#000' }}
      >
        <SolarSystemScene 
          isAnimating={isAnimating}
          showOrbits={showOrbits}
          showLabels={showLabels}
          resetTrigger={resetTrigger}
          onObjectClick={handleObjectClick}
        />
      </Canvas>

      {/* Info Panel */}
      <div className="absolute top-4 left-4 glass-panel p-4 rounded-xl max-w-[320px] z-10">
        <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
          🌌 Cosmic Watch 3D
        </h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p><strong className="text-foreground">View Mode:</strong> Solar System Explorer</p>
          <p><strong className="text-foreground">Planets Visible:</strong> 8</p>
          <p><strong className="text-foreground">Asteroids Tracked:</strong> 15</p>
          <p><strong className="text-foreground">Camera:</strong> Free rotation (drag to rotate)</p>
        </div>
        
        {selectedObject && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm mb-2">
              <strong className="text-foreground">Selected Object:</strong>{' '}
              <span className="text-primary">{selectedObject.name}</span>
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              {Object.entries(selectedObject.data).map(([key, value]) => (
                <p key={key}>
                  <strong className="text-foreground capitalize">{key}:</strong>{' '}
                  <span className={
                    value === 'HAZARDOUS' ? 'text-destructive font-bold' : 
                    value === 'Safe' ? 'text-cosmic-green' : ''
                  }>
                    {String(value)}
                  </span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 glass-panel p-4 rounded-xl z-10">
        <h3 className="text-sm font-bold text-primary mb-3">Legend</h3>
        <div className="space-y-2">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}`
                }} 
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-xl z-10 flex gap-2 flex-wrap">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            isAnimating 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {isAnimating ? <Pause size={14} /> : <Play size={14} />}
          {isAnimating ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            showOrbits 
              ? "bg-primary/20 text-primary border border-primary/30" 
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {showOrbits ? <Eye size={14} /> : <EyeOff size={14} />}
          Orbits
        </button>
        
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            showLabels 
              ? "bg-primary/20 text-primary border border-primary/30" 
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {showLabels ? <Tag size={14} /> : <Tags size={14} />}
          Labels
        </button>
        
        <button
          onClick={() => setResetTrigger(t => t + 1)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
};
