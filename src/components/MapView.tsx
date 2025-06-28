
import { useRef } from 'react';

interface MapViewProps {
  latitude: number;
  longitude: number;
  ipAddress: string;
  country?: string;
}

export const MapView = ({ latitude, longitude, ipAddress, country }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };
  
  return (
    <div ref={mapRef} className="w-full h-full flex flex-col">
      <div className="flex flex-col items-center justify-center h-full bg-muted p-4 text-center">
        <div className="mb-2 text-sm font-semibold">Map Preview</div>
        <div className="text-xs text-muted-foreground mb-3">
          Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>
        <div className="relative w-full h-48 bg-muted-foreground/10 rounded flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0.5">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="bg-muted-foreground/5"></div>
            ))}
          </div>
          <div className="absolute">
            <div className="h-6 w-6 rounded-full bg-destructive/80 animate-pulse"></div>
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">
            Map preview
          </div>
        </div>
        <button 
          onClick={openInGoogleMaps}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Open in Google Maps
        </button>
      </div>
    </div>
  );
};
