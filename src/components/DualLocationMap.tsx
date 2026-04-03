import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBhJerwaPCqwEK7suSoBW0sBj7dQZ5sN4Q';

interface DualLocationMapProps {
  donorLocation: { lat: number; lng: number };
  requestorLocation: { lat: number; lng: number };
  height?: number | string;
}

export default function DualLocationMap({ donorLocation, requestorLocation, height = 240 }: DualLocationMapProps) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  const centerLat = (donorLocation.lat + requestorLocation.lat) / 2;
  const centerLng = (donorLocation.lng + requestorLocation.lng) / 2;

  if (!isLoaded) {
    return (
      <div style={{ height: typeof height === 'number' ? `${height}px` : height, borderRadius: 'var(--radius-lg)', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)', fontSize: '0.875rem', gap: 8 }}>
        <span style={{ width: 16, height: 16, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'mapSpin 0.8s linear infinite' }} />
        Loading map...
      </div>
    );
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, borderRadius: 'var(--radius-lg)' }}
        center={{ lat: centerLat, lng: centerLng }}
        zoom={12}
      >
        <Marker
          position={donorLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          title="Donor Location"
        />
        <Marker
          position={requestorLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          title="Requestor Location"
        />
      </GoogleMap>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#4CAF50', display: 'inline-block' }} />
          Donor Location
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f44336', display: 'inline-block' }} />
          Requestor Location
        </div>
      </div>
    </div>
  );
}
