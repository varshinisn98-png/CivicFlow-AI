import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon bug in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export const MapPicker = ({ lat, lng, onChange }) => {
  const defaultPos = [lat || 12.9716, lng || 77.5946];
  const [position, setPosition] = useState(defaultPos);

  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleSetPos = (pos) => {
    setPosition(pos);
    if (onChange) {
      onChange({ lat: pos[0], lng: pos[1] });
    }
  };

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-700 shadow-inner relative z-0">
      <MapContainer
        center={defaultPos}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handleSetPos} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] text-slate-300 z-[1000] border border-slate-700">
        Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)} (Click map to adjust pin)
      </div>
    </div>
  );
};

export default MapPicker;
