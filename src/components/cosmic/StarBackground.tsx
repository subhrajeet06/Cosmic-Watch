import { useMemo } from 'react';

interface Star {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
}

export const StarBackground = () => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: `${Math.random() * 3}px`,
      height: `${Math.random() * 3}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-foreground rounded-full animate-pulse"
          style={{
            width: star.width,
            height: star.height,
            top: star.top,
            left: star.left,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};
