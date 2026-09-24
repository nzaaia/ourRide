import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Phone, Star, Clock, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import './BookVehicle.css';

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

  if (!vehicle) return <div className="book-vehicle__not-found">Vehicle not found</div>;

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
      <div className="book-vehicle__success">
        <div className="book-vehicle__success-icon">
          <CheckCircle2 size={38} color="var(--primary)" />
        </div>
        <h2 className="book-vehicle__success-title">Request sent!</h2>
        <p className="text-muted book-vehicle__success-desc">
          Your booking for <strong>{vehicle.vehicleName}</strong> is with {vehicle.ownerName}. Once accepted, the exact bike location will be revealed — you'll have 20 minutes to arrive.
        </p>
        <div className="card book-vehicle__success-summary">
          <div className="book-vehicle__success-grid">
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
              <div className="font-bold text-primary book-vehicle__success-fare">৳{totalFare}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Purpose</div>
              <div className="font-bold book-vehicle__success-purpose">{purpose.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
        <div className="book-vehicle__success-actions">
          <button className="btn btn-outline book-vehicle__success-btn" onClick={() => navigate('/renter/requests')}>
            My requests
          </button>
          <button className="btn btn-primary book-vehicle__success-btn" onClick={() => navigate('/renter/dashboard')}>
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-vehicle">

      {loading ? (
        <div>
          <div className="page-header"><span className="header-back"><ChevronLeft size={20} /></span>
            <div className="skeleton book-vehicle__skeleton-header" />
          </div>
          <div className="skeleton book-vehicle__skeleton-hero" />
          <div className="skeleton book-vehicle__skeleton-detail" />
        </div>
      ) : (
        <>
          {/* Vehicle card */}
          <div className="bike-tile book-vehicle__vehicle-card">
            <div className="tile-media book-vehicle__image-wrapper">
              <img src={vehicle.image} alt={vehicle.vehicleName} />
              <div className="book-vehicle__price-badge">
                ৳{vehicle.hourlyRate}/hr
              </div>
            </div>
            <div className="tile-body book-vehicle__tile-body">
              <div className="book-vehicle__tile-meta">
                <div className="book-vehicle__tile-name-block">
                  <h3 className="book-vehicle__vehicle-name">{vehicle.vehicleName}</h3>
                  <div className="book-vehicle__vehicle-location">
                    <MapPin size={13} /> {vehicle.location}
                  </div>
                </div>
                <div className="book-vehicle__vehicle-rating">
                  <Star size={14} fill="#F59E0B" /> {vehicle.rating}
                </div>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className="card book-vehicle__owner-card">
            <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} className="avatar book-vehicle__owner-avatar" />
            <div className="book-vehicle__owner-info">
              <div className="font-bold">{vehicle.ownerName}</div>
              <div className="text-muted text-sm">{vehicle.totalTrips} trips completed</div>
            </div>
            <button className="btn btn-outline btn-sm book-vehicle__call-btn" onClick={() => toast.info('Call', `Calling ${vehicle.ownerName}...`)}>
              <Phone size={14} /> Call
            </button>
          </div>

          {/* Time & duration */}
          <div className="card book-vehicle__time-card">
            <div className="micro-label book-vehicle__time-label">Time of booking</div>
            <div className="book-vehicle__time-grid">
              <div>
                <label className="text-sm font-semibold book-vehicle__field-label">Day</label>
                <input type="date" className="input" value={selectedDay} min={today} onChange={e => setSelectedDay(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold book-vehicle__field-label">Time</label>
                <input type="time" className="input" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
              </div>
            </div>

            <div className="book-vehicle__duration-row">
              <div className="flex items-center gap-2 text-muted text-sm"><Clock size={15} /> Duration (hours)</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setHours(Math.max(1, hours - 1))} aria-label="Decrease hours" className="book-vehicle__duration-dec">−</button>
                <span className="book-vehicle__duration-value">{hours}h</span>
                <button onClick={() => setHours(hours + 1)} aria-label="Increase hours" className="book-vehicle__duration-inc">+</button>
              </div>
            </div>

            <div className="book-vehicle__return-note">
              <Clock size={13} /> Return within 15 mins after your time ends
            </div>
          </div>

          {/* Purpose */}
          <div className="card book-vehicle__purpose-card">
            <div className="micro-label book-vehicle__purpose-label">Trip purpose</div>
            <div className="book-vehicle__purpose-grid">
              {[
                { id: 'personal', label: 'Personal' },
                { id: 'ridesharing', label: 'Ride share' },
                { id: 'both', label: 'Both' },
              ].map(o => (
                <button
                  key={o.id}
                  onClick={() => setPurpose(o.id)}
                  className={`pill book-vehicle__purpose-pill ${purpose === o.id ? 'active' : ''}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {purpose !== 'personal' && (
              <div className="book-vehicle__rideshare-note">
                <ShieldCheck size={16} className="book-vehicle__rideshare-icon" />
                Ride sharing is enabled — you can pick up passengers during this rental.
              </div>
            )}
          </div>
        </>
      )}

      {/* Sticky bottom fare + CTA */}
      {!loading && !booked && (
        <div className="sticky-action-bar">
          <div className="book-vehicle__action-inner">
            <div className="book-vehicle__fare-info">
              <div className="text-xs text-muted font-semibold">Total fare</div>
              <div className="book-vehicle__fare-value">৳{totalFare}</div>
              <div className="book-vehicle__fare-breakdown">৳{vehicle.hourlyRate}/hr + wear</div>
            </div>
            <button
              className="btn btn-primary btn-lg book-vehicle__book-btn"
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