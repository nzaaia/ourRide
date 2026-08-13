import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Save, Clock, MapPin, DollarSign, Sliders, CalendarDays, Lock, CheckCircle2 } from 'lucide-react';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function VehicleSettings() {
  const { id } = useParams();
  const { data, updateListing } = useAuth();
  const navigate = useNavigate();

  const vehicle = data.listings.find(l => l.id === id);
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setSettings({
        isAvailable: vehicle.isAvailable,
        autoAccept: vehicle.autoAccept,
        hourlyRate: vehicle.hourlyRate,
        wearTearRate: vehicle.wearTearRate,
        maxRadiusKm: vehicle.maxRadiusKm,
        availableDays: vehicle.availableDays || ALL_DAYS,
        availableFrom: vehicle.availableFrom || '08:00',
        availableTo: vehicle.availableTo || '20:00',
      });
    }
  }, [vehicle]);

  if (!vehicle || !settings) return <div className="container">Vehicle not found</div>;

  if (vehicle.status === 'active') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button className="btn btn-ghost" style={{ width: 'auto', marginBottom: 20 }} onClick={() => navigate('/owner/bikes')}>
          <ChevronLeft size={18} /> Back to My Fleet
        </button>
        <h2 style={{ marginBottom: 24 }}>{vehicle.vehicleName}</h2>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={28} color="var(--error)" />
            </div>
          </div>
          <h3 style={{ color: 'var(--error)' }}>Settings Locked</h3>
          <p className="text-muted">This vehicle is currently on an active ride. Settings are locked until the trip is completed.</p>
          <button className="btn btn-outline" style={{ marginTop: 20, width: 'auto' }} onClick={() => navigate('/owner/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toggleDay = (day) => {
    setSettings(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSave = () => {
    updateListing(id, {
      ...settings,
      hourlyRate: Number(settings.hourlyRate),
      wearTearRate: Number(settings.wearTearRate),
      maxRadiusKm: Number(settings.maxRadiusKm),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SectionTitle = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
        {icon}
      </div>
      <h4 style={{ margin: 0 }}>{title}</h4>
    </div>
  );

  const Toggle = ({ checked, onChange, label, sublabel }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sublabel}</div>
      </div>
      <div
        onClick={onChange}
        style={{
          width: 48, height: 28, borderRadius: 14, background: checked ? 'var(--primary)' : '#D1D5DB',
          position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 22, height: 22, borderRadius: '50%', background: 'white',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <button className="btn btn-ghost" style={{ width: 'auto', marginBottom: 20, padding: '8px 0' }} onClick={() => navigate('/owner/bikes')}>
        <ChevronLeft size={18} /> Back to My Fleet
      </button>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 28 }}>
        <img src={vehicle.image} alt={vehicle.vehicleName} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
        <div>
          <h2 style={{ marginBottom: 4 }}>{vehicle.vehicleName}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
            <MapPin size={13} /> {vehicle.location}
          </div>
        </div>
      </div>

      {/* Visibility & Booking */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border-color)', padding: '24px 28px', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <SectionTitle icon={<Sliders size={17} />} title="Visibility & Booking" />
        <Toggle
          checked={settings.isAvailable}
          onChange={() => setSettings(s => ({ ...s, isAvailable: !s.isAvailable }))}
          label="Available to rent"
          sublabel="Show this vehicle in search results"
        />
        <Toggle
          checked={settings.autoAccept}
          onChange={() => setSettings(s => ({ ...s, autoAccept: !s.autoAccept }))}
          label="Auto-accept bookings"
          sublabel="Automatically approve incoming requests"
        />
      </div>

      {/* Pricing */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border-color)', padding: '24px 28px', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <SectionTitle icon={<DollarSign size={17} />} title="Pricing" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Hourly Rate (৳)', key: 'hourlyRate' },
            { label: 'Wear & Tear Charge (৳/hr)', key: 'wearTearRate' },
            { label: 'Max Renter Radius (km)', key: 'maxRadiusKm' },
          ].map(field => (
            <div key={field.key} style={{ gridColumn: field.key === 'maxRadiusKm' ? '1 / -1' : 'auto' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>{field.label}</label>
              <input
                type="number"
                className="input"
                value={settings[field.key]}
                onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Availability Schedule */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border-color)', padding: '24px 28px', boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
        <SectionTitle icon={<CalendarDays size={17} />} title="Availability Schedule" />

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Available Days</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALL_DAYS.map(day => {
              const active = settings.availableDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: `2px solid ${active ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: active ? 'var(--primary)' : 'white',
                    color: active ? 'white' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Available From
            </label>
            <input
              type="time"
              className="input"
              value={settings.availableFrom}
              onChange={e => setSettings(s => ({ ...s, availableFrom: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Available Until
            </label>
            <input
              type="time"
              className="input"
              value={settings.availableTo}
              onChange={e => setSettings(s => ({ ...s, availableTo: e.target.value }))}
            />
          </div>
        </div>

        {settings.availableDays.length > 0 && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 10, fontSize: 13, color: '#065F46', fontWeight: 600 }}>
            <CheckCircle2 size={15} /> Bike available: {settings.availableDays.join(', ')} · {settings.availableFrom} – {settings.availableTo}
          </div>
        )}
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: 16 }}
        onClick={handleSave}
      >
        {saved ? <><CheckCircle2 size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
      </button>
    </div>
  );
}
