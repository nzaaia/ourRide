import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VehicleSettings() {
  const { id } = useParams();
  const { data, updateListing } = useAuth();
  const navigate = useNavigate();
  
  const vehicle = data.listings.find(l => l.id === id);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (vehicle) {
      setSettings({
        isAvailable: vehicle.isAvailable,
        autoAccept: vehicle.autoAccept,
        hourlyRate: vehicle.hourlyRate,
        wearTearRate: vehicle.wearTearRate,
        maxRadiusKm: vehicle.maxRadiusKm
      });
    }
  }, [vehicle]);

  if (!vehicle || !settings) return <div className="container">Vehicle not found</div>;

  if (vehicle.status === 'active') {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: 'var(--space-6)' }}>Settings: {vehicle.vehicleName}</h2>
        <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
          <h3 className="text-error">Settings Locked</h3>
          <p className="text-muted">This vehicle is currently on an active ride. You cannot modify its settings until the ride is completed.</p>
          <button className="btn btn-outline" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigate('/owner/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateListing(id, {
      ...settings,
      hourlyRate: Number(settings.hourlyRate),
      wearTearRate: Number(settings.wearTearRate),
      maxRadiusKm: Number(settings.maxRadiusKm)
    });
    alert('Settings saved successfully!');
    navigate('/owner/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-6)' }}>Settings: {vehicle.vehicleName}</h2>

      <div className="card flex-col gap-6">
        <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div className="font-semibold">Available to rent</div>
            <div className="text-sm text-muted">Show this vehicle in search results</div>
          </div>
          <input 
            type="checkbox" 
            checked={settings.isAvailable} 
            onChange={e => setSettings({...settings, isAvailable: e.target.checked})} 
            style={{ width: '24px', height: '24px' }}
          />
        </div>

        <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div className="font-semibold">Auto-accept bookings</div>
            <div className="text-sm text-muted">Automatically approve incoming requests</div>
          </div>
          <input 
            type="checkbox" 
            checked={settings.autoAccept} 
            onChange={e => setSettings({...settings, autoAccept: e.target.checked})} 
            style={{ width: '24px', height: '24px' }}
          />
        </div>

        <div className="flex-col gap-2">
          <label className="font-semibold">Hourly Rate (৳)</label>
          <input type="number" className="input" style={{ padding: '8px', border: '1px solid var(--border-color)' }}
            value={settings.hourlyRate} onChange={e => setSettings({...settings, hourlyRate: e.target.value})} />
        </div>

        <div className="flex-col gap-2">
          <label className="font-semibold">Wear & Tear Charge (৳/hr)</label>
          <input type="number" className="input" style={{ padding: '8px', border: '1px solid var(--border-color)' }}
            value={settings.wearTearRate} onChange={e => setSettings({...settings, wearTearRate: e.target.value})} />
        </div>

        <div className="flex-col gap-2">
          <label className="font-semibold">Max Renter Radius (km)</label>
          <input type="number" className="input" style={{ padding: '8px', border: '1px solid var(--border-color)' }}
            value={settings.maxRadiusKm} onChange={e => setSettings({...settings, maxRadiusKm: e.target.value})} />
        </div>
        
        <div className="flex-col gap-2">
          <label className="font-semibold">Availability Schedule</label>
          <div className="text-sm text-muted mb-2">Select the days and hours the vehicle is available.</div>
          <div className="flex gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={{ padding: '4px 8px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', fontSize: '14px', border: '1px solid var(--border-color)' }}>{day}</div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: 'var(--space-4)' }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
