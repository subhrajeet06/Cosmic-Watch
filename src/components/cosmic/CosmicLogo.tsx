import cosmicWatchLogo from '@/assets/cosmic-watch-logo.png';

interface CosmicLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const CosmicLogo = ({ size = 'md' }: CosmicLogoProps) => {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  return (
    <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
      <img 
        src={cosmicWatchLogo} 
        alt="Cosmic Watch Logo" 
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
};
