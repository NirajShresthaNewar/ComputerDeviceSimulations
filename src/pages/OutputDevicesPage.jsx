import { deviceCatalog } from '../data/deviceCatalog';
import DeviceCard from '../components/simulation-shell/DeviceCard';

export default function OutputDevicesPage() {
  const devices = deviceCatalog.filter((d) => d.category === 'output');

  return (
    <div>
      <h1>Output Devices</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '24px' }}>
        How a physical action becomes data the computer can use.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}