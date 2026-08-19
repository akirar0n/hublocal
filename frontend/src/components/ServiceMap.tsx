import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet markers in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center: [number, number];
  markers: Array<{
    id: number;
    lat: number;
    lng: number;
    title: string;
    description: string;
  }>;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const ServiceMap = ({ center, markers }: MapProps) => {
  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador do Cliente (Origem) */}
        <Marker position={center} icon={L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: iconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        })}>
          <Popup>Sua Localização</Popup>
        </Marker>

        {/* Marcadores dos Trabalhadores */}
        {markers.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.title}</strong><br/>
              {m.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
