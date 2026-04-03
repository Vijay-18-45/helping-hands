import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBhJerwaPCqwEK7suSoBW0sBj7dQZ5sN4Q';

interface LocationViewerProps {
  location: { lat: number; lng: number };
  markerColor?: 'green' | 'red' | 'blue';
  height?: number | string;
}

const markerIcons = {
  green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  blue: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
};

export default function LocationViewer({ location, markerColor = 'blue', height = 200 }: LocationViewerProps) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  if (!isLoaded) {
    return (
      <div style={{ height: typeof height === 'number' ? `${height}px` : height, borderRadius: 'var(--radius-lg)', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)', fontSize: '0.875rem', gap: 8 }}>
        <span style={{ width: 16, height: 16, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'mapSpin 0.8s linear infinite' }} />
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, borderRadius: 'var(--radius-lg)' }}
      center={location}
      zoom={14}
    >
      <Marker position={location} icon={markerIcons[markerColor]} />
    </GoogleMap>
  );
}
