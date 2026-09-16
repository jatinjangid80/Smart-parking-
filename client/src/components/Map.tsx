import React from "react";
import { MapPin } from "lucide-react";

export interface ParkingLocationMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available: number;
  total: number;
  price: string;
  address: string;
}

export const DEFAULT_MAP_LOCATIONS: ParkingLocationMarker[] = [
  {
    id: "loc1",
    name: "Downtown Parking",
    lat: 28.6315,
    lng: 77.2167,
    available: 24,
    total: 150,
    price: "₹50.00/hr",
    address: "102 Main Street, City Center",
  },
  {
    id: "loc2",
    name: "Central Plaza",
    lat: 28.6280,
    lng: 77.2090,
    available: 8,
    total: 100,
    price: "₹40.00/hr",
    address: "45 Broadway Ave, Sector 4",
  },
  {
    id: "loc3",
    name: "Mall Parking",
    lat: 28.5355,
    lng: 77.2180,
    available: 45,
    total: 200,
    price: "₹30.00/hr",
    address: "Grand Galleria Mall, West Gate",
  },
];

interface LiveParkingMapProps {
  locations?: ParkingLocationMarker[];
  selectedLocationName?: string;
  onSelectLocation?: (name: string) => void;
  className?: string;
}

export function LiveParkingMap({
  locations = DEFAULT_MAP_LOCATIONS,
  selectedLocationName,
  onSelectLocation,
  className = "h-80",
}: LiveParkingMapProps) {
  const selectedLoc =
    locations.find((l) => l.name === selectedLocationName) || locations[0];

  // Coordinates centered on selected location
  const centerLat = selectedLoc ? selectedLoc.lat : 28.6139;
  const centerLng = selectedLoc ? selectedLoc.lng : 77.2090;

  const googleEmbedUrl = `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=15&output=embed`;

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 ${className}`}>
      {/* Live Google Map Frame */}
      <iframe
        title="Live Parking Map"
        src={googleEmbedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
      />

      {/* Top Map Location Badge */}
      <div className="absolute top-3 left-3 flex items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {selectedLoc.name} ({selectedLoc.available} slots free)
          </span>
        </div>
      </div>

      {/* Bottom Live Interactive Markers Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto scrollbar-none">
        {locations.map((loc) => {
          const isSelected = loc.name === selectedLoc.name;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation?.(loc.name)}
              className={`text-left px-3 py-1.5 rounded-lg text-xs transition-all shadow-md backdrop-blur-md whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-700 font-semibold scale-105"
                  : "bg-white/90 hover:bg-white text-slate-800 border-slate-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  loc.available > 10 ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>{loc.name}</span>
              <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                ({loc.available} slots • {loc.price})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { LiveParkingMap as MapView };
