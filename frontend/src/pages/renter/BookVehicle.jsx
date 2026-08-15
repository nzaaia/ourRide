import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Phone, Star, Clock, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, user, addBookingRequest, addRenterBookingRequest, login, isAuthenticated } = useAuth();

  const vehicle = data.listings.find(v => v.id === id);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [hours, setHours] = useState(2);
  const [purpose, setPurpose] = useState('personal');
  const [booked, setBooked] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!vehicle) return <div style={{ padding: 60, textAlign: 'center' }}>Vehicle not found</div>;

  const totalFare = (vehicle.hourlyRate + vehicle.wearTearRate) * hours;

  const handleBook = () => {
    if (!isAuthenticated) login('renter');

    setSending(true);
    const sharedId = `req_${Date.now()}`;

    const ownerReq = {
      id: sharedId,
      vehicleId: vehicle.id,
      renterName: user?.name || 'Guest Renter',
      renterAvatar: user?.avatar || 'https://i.pravatar.cc/150?u=guest',
      renterRating: data.userRating || 4.8,
      renterPastRides: data.pastTrips?.length || 0,
      renterPhone: user?.phone || 'Not provided',
      renterNid: user?.nid || 'Not provided',
      pickupLocation: vehicle.location,
      estimatedDuration: hours,
      estimatedFare: totalFare,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const bookingReq = {
      id: `bk_${Date.now()}`,
      requestId: sharedId,
      vehicleId: vehicle.id,
      vehicleName: vehicle.vehicleName,
      vehicleImage: vehicle.image,
      ownerName: vehicle.ownerName,
      ownerAvatar: vehicle.ownerAvatar,
      ownerPhone: 'Chat to view phone number',
      location: vehicle.location,
      exactLocation: vehicle.exactLocation,
      selectedDay,
      selectedTime,
      hours,
      purpose,
      totalFare,
      status: 'pending',
      bikeStatus: 'at_garage',
      startedAt: new Date().toISOString(),
      canFindPassengers: purpose === 'ridesharing' || purpose === 'both'
    };

    addBookingRequest(ownerReq);
    addRenterBookingRequest(bookingReq);

    setTimeout(() => {
      setSending(false);
      setBooked(true);
    }, 600);
  };

  if (booked) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
        <div style={{ width: 72, height: 72, margin: '0 auto 20px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={38} color="var(--primary)" />
        </div>
        <h2 style={{ marginBottom: 10 }}>Request sent!</h2>
        <p className="text-muted" style={{ marginBottom: 28 }}>
          Your booking for <strong>{vehicle.vehicleName}</strong> is with {vehicle.ownerName}. Once accepted, the exact bike location will be revealed — you'll have 20 minutes to arrive.
        </p>
        <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div className="text-muted text-sm">Vehicle</div>
              <div className="font-bold">{vehicle.vehicleName}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Duration</div>
              <div className="font-bold">{hours}h · {selectedTime}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Total fare</div>
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
            My requests
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/renter/dashboard')}>
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 90 }}>

      {loading ? (
        <div>
          <div className="page-header"><span className="header-back"><ChevronLeft size={20} /></span>
            <div className="skeleton" style={{ height: 24, width: 160 }} />
          </div>
          <div className="skeleton" style={{ height: 180, borderRadius: 16, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />
        </div>
      ) : (
        <>
          {/* Vehicle card */}
          <div className="bike-tile" style={{ marginBottom: 20 }}>
            <div className="tile-media" style={{ aspectRatio: '16 / 9' }}>
              <img src={vehicle.image} alt={vehicle.vehicleName} />
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(12,61,36,0.92)', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                ৳{vehicle.hourlyRate}/hr
              </div>
            </div>
            <div className="tile-body" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ marginBottom: 2 }}>{vehicle.vehicleName}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 13 }}>
                    <MapPin size={13} /> {vehicle.location}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontWeight: 700, fontSize: 14 }}>
                  <Star size={14} fill="#F59E0B" /> {vehicle.rating}
                </div>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: 14 }}>
            <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} className="avatar" style={{ width: 46, height: 46 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-bold">{vehicle.ownerName}</div>
              <div className="text-muted text-sm">{vehicle.totalTrips} trips completed</div>
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => toast.info('Call', `Calling ${vehicle.ownerName}...`)}>
              <Phone size={14} /> Call
            </button>
          </div>

          {/* Time & duration */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <div className="micro-label" style={{ marginBottom: 12 }}>Time of booking</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 6 }}>Day</label>
                <input type="date" className="input" value={selectedDay} min={today} onChange={e => setSelectedDay(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 6 }}>Time</label>
                <input type="time" className="input" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="flex items-center gap-2 text-muted text-sm"><Clock size={15} /> Duration (hours)</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setHours(Math.max(1, hours - 1))} aria-label="Decrease hours" style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border-color)', fontWeight: 700, fontSize: 18 }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 20, minWidth: 40, textAlign: 'center' }}>{hours}h</span>
                <button onClick={() => setHours(hours + 1)} aria-label="Increase hours" style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: 18 }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <Clock size={13} /> Return within 15 mins after your time ends
            </div>
          </div>

          {/* Purpose */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <div className="micro-label" style={{ marginBottom: 12 }}>Trip purpose</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { id: 'personal', label: 'Personal' },
                { id: 'ridesharing', label: 'Ride share' },
                { id: 'both', label: 'Both' },
              ].map(o => (
                <button
                  key={o.id}
                  onClick={() => setPurpose(o.id)}
                  className={`pill ${purpose === o.id ? 'active' : ''}`}
                  style={{ textAlign: 'center', padding: '10px 4px', minHeight: 44 }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {purpose !== 'personal' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--primary-light)', borderRadius: 10, padding: 10, marginTop: 12, fontSize: 13, color: '#065F46', fontWeight: 600 }}>
                <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                Ride sharing is enabled — you can pick up passengers during this rental.
              </div>
            )}
          </div>
        </>
      )}

      {/* Sticky bottom fare + CTA */}
      {!loading && !booked && (
        <div className="sticky-action-bar">
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div className="text-xs text-muted font-semibold">Total fare</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1 }}>৳{totalFare}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>৳{vehicle.hourlyRate}/hr + wear</div>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={handleBook}
              disabled={sending}
            >
              {sending && <span className="btn-spinner" />}
              {sending ? 'Sending request…' : 'Request to Book'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
