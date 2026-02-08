export const FloatingAsteroids = () => {
  return (
    <>
      {/* Asteroid 1 - Cyan */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <svg width="80" height="80" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.3" />
          <circle cx="35" cy="40" r="8" fill="currentColor" />
          <circle cx="60" cy="55" r="6" fill="currentColor" />
          <circle cx="50" cy="35" r="5" fill="currentColor" />
        </svg>
      </div>

      {/* Asteroid 2 - Purple Planet */}
      <div className="absolute bottom-32 right-16 opacity-15 animate-float-slow">
        <svg width="120" height="120" viewBox="0 0 100 100" className="text-accent">
          <ellipse cx="50" cy="50" rx="40" ry="20" fill="currentColor" opacity="0.2" transform="rotate(25 50 50)" />
          <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.4" />
          <circle cx="50" cy="50" r="15" fill="currentColor" />
        </svg>
      </div>
    </>
  );
};
