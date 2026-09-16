import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

export const HeatmapView = ({ points }) => {
  const center = [12.9716, 77.5946];

  const getColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f97316'; // Orange
      case 'Medium': return '#eab308'; // Yellow
      default: return '#3b82f6'; // Blue
    }
  };

  return (
    <div className="h-96 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points && points.map((p) => {
          const color = getColor(p.priority);
          return (
            <React.Fragment key={p.id}>
              {/* Outer heatmap glow circle */}
              <CircleMarker
                center={[p.lat, p.lng]}
                radius={p.priority === 'Critical' ? 24 : p.priority === 'High' ? 18 : 12}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.35,
                  color: color,
                  opacity: 0.8,
                  weight: 2
                }}
              />
              
              {/* Inner Pin */}
              <CircleMarker
                center={[p.lat, p.lng]}
                radius={6}
                pathOptions={{
                  fillColor: '#ffffff',
                  fillOpacity: 1,
                  color: color,
                  weight: 3
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 text-slate-900">
                    <div className="text-xs font-bold mb-1">{p.title}</div>
                    <div className="text-[11px] text-slate-600 mb-1">
                      📍 {p.location_name || 'Campus Location'}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-semibold">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-800">
                        {p.category}
                      </span>
                      <span style={{ color: color }}>
                        {p.priority} Priority
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatmapView;
