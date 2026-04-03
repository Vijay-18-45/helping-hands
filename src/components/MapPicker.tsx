import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useCallback } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBhJerwaPCqwEK7suSoBW0sBj7dQZ5sN4Q';
const DEFAULT_CENTER = { lat: 16.5062, lng: 80.648 };

interface MapPickerProps {
  location: { lat: number; lng: number } | null;
  onChange: (loc: { lat: number; lng: number }) => void;
  height?: number | string;
}

export default function MapPicker({ location, onChange, height = 300 }: MapPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, [onChange]);

  if (!isLoaded) {
    return (
      <div style={{
        height, borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-container-low)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--on-surface-variant)', gap: 10,
      }}>
        <span style={{
          width: 22, height: 22, border: '3px solid var(--primary-fixed)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, borderRadius: 'var(--radius-lg)' }}
      center={location ?? DEFAULT_CENTER}
      zoom={location ? 14 : 11}
      onClick={handleClick}
    >
      {location && <Marker position={location} />}
    </GoogleMap>
  );
}
