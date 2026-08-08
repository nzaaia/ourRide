import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Phone, Star, Clock, User, CheckCircle } from 'lucide-react';

export default function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, user, startRental, addRenterBookingRequest, login, isAuthenticated } = useAuth();

  const vehicle = data.listings.find(v => v.id === id);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [hours, setHours] = useState(2);
  const [purpose, setPurpose] = useState('personal'); // 'personal', 'ridesharing', 'both'
  const [booked, setBooked] = useState(false);

  if (!vehicle) return <div style={{ padding: 40, textAlign: 'center' }}>Vehicle not found</div>;

  const totalFare = (vehicle.hourlyRate + vehicle.wearTearRate) * hours;

  const handleBook = () => {
    if (!isAuthenticated) {
      login('renter');
    }

    // Record the renter's booking request
    const bookingReq = {
      id: `bk_${Date.now()}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.vehicleName,
      vehicleImage: vehicle.image,
      ownerName: vehicle.ownerName,
      ownerAvatar: vehicle.ownerAvatar,
      ownerPhone: '+880 1711-123456',
      location: vehicle.location,
      selectedDay,
      selectedTime,
      hours,
      purpose,
      totalFare,
      status: 'active', // active, completed
      startedAt: new Date().toISOString(),
      canFindPassengers: purpose === 'ridesharing' || purpose === 'both'
    };

    addRenterBookingRequest(bookingReq);
    startRental(vehicle, hours, purpose);
    setBooked(true);
  };

  if (booked) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
        <h2 style={{ marginBottom: 12 }}>Booking Confirmed!</h2>
        <p className="text-muted" style={{ marginBottom: 32 }}>
          Your booking for <strong>{vehicle.vehicleName}</strong> is now active. Go to your dashboard to manage it.
        </p>
        <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="text-muted text-sm">Vehicle</div>
              <div className="font-bold">{vehicle.vehicleName}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Duration</div>
              <div className="font-bold">{hours} hours</div>
            </div>
            <div>
              <div className="text-muted text-sm">Total Fare</div>
              <div className="font-bold text-primary" style={{ fontSize: 20 }}>৳{totalFare}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Purpose</div>
              <div className="font-bold" style={{ textTransform: 'capitalize' }}>{purpose.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/renter/requests')}>
            View My Requests
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/renter/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ width: 'auto', marginBottom: 20, padding: '8px 0' }}>
        <ChevronLeft size={20} /> Back to Search
      </button>

      <h1 style={{ marginBottom: 32 }}>Book Vehicle</h1>

      {/* Section 1: Owner Details */}
      <div style={{ marginBottom: 28 }}>
        <div className="text-muted font-semibold text-sm" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Owner details</div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
          <div className="flex items-center gap-4">
            <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} className="avatar" style={{ width: 52, height: 52 }} />
            <div>
              <div className="font-bold" style={{ fontSize: 17 }}>{vehicle.ownerName}</div>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#F59E0B', marginTop: 2 }}>
                {'★'.repeat(Math.round(vehicle.rating))} <span className="text-muted">{vehicle.rating}</span>
              </div>
              <div className="text-sm text-muted">{vehicle.totalTrips} trips completed</div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: 'auto' }}
            onClick={() => alert(`Calling ${vehicle.ownerName}...`)}
          >
            <Phone size={16} /> Call the owner
          </button>
        </div>
      </div>

      {/* Section 2: Time of Booking */}
      <div style={{ marginBottom: 28 }}>
        <div className="text-muted font-semibold text-sm" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Time of booking</div>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 6 }}>Select day</label>
              <input
                type="date"
                className="input"
                value={selectedDay}
                min={today}
                onChange={e => setSelectedDay(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 6 }}>Select time</label>
              <input
                type="time"
                className="input"
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="flex items-center gap-2 text-muted text-sm"><Clock size={16} /> Duration (hours)</div>
            <div className="flex items-center gap-4">
              <button onClick={() => setHours(Math.max(1, hours - 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border-color)', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
              <span style={{ fontWeight: 800, fontSize: 20, minWidth: 40, textAlign: 'center' }}>{hours}h</span>
              <button onClick={() => setHours(hours + 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>

          <div className="text-muted text-sm" style={{ marginBottom: 12 }}>You must return within 15 mins after your time ends</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <div>
              <div className="text-muted text-sm">৳{vehicle.hourlyRate}/hr + ৳{vehicle.wearTearRate} wear & tear</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>
              Total fare ৳{totalFare}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Purpose */}
      <div style={{ marginBottom: 36 }}>
        <div className="text-muted font-semibold text-sm" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Purpose</div>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div className="text-sm font-semibold" style={{ marginBottom: 16 }}>Select purpose of renting</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { id: 'personal', label: 'Personal use only' },
              { id: 'ridesharing', label: 'Ride sharing only' },
              { id: 'both', label: 'Both' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setPurpose(opt.id)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  border: `2px solid ${purpose === opt.id ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: purpose === opt.id ? 'var(--primary-light)' : 'var(--surface)',
                  color: purpose === opt.id ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                {purpose === opt.id && <CheckCircle size={15} />}
                {opt.label}
              </button>
            ))}
          </div>
          {(purpose === 'ridesharing' || purpose === 'both') && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 8, fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
              ✓ You'll be able to accept passenger ride requests while you have this bike!
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        className="btn btn-primary btn-lg"
        style={{ width: '100%', fontSize: 18 }}
        onClick={handleBook}
      >
        Request to Book
      </button>
    </div>
  );
}
