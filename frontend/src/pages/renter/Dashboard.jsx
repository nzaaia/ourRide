import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Bookmark, Star, Map, MapPin, Users, ChevronRight, CircleUserRound, Bike } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function RenterDashboard() {
  const { data, activePassengerRides, user, renterBookingRequests } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const realActiveRentals = renterBookingRequests.filter(r => r.bikeStatus === 'in_use' || r.bikeStatus === 'returning');

  const savedCount = data.savedBikes.length;
  const tripCount = (data.pastTrips || []).length;
  const rating = data.userRating;
  const nearby = data.listings.filter(l => l.isAvailable && l.status === 'available' && l.ownerId !== user?.id).slice(0, 4);

  const statCards = [
    { icon: <Map size={20} color="var(--forest)" />, label: 'Past Trips', value: tripCount, route: '/renter/trips' },
    { icon: <Bookmark size={20} color="var(--accent-purple)" />, label: 'Saved', value: savedCount, route: '/renter/saved' },
    { icon: <Star size={20} color="#F59E0B" />, label: 'Rating', value: rating.toFixed(1), route: '/renter/ratings' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Hero header */}
      <div className="hero-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.4 }}>OurRide</div>
          <button
            onClick={() => navigate('/profile')}
            aria-label="Profile"
            style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
          >
            <CircleUserRound size={20} />
          </button>
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, marginBottom: 2 }}>Hi, {user?.name?.split(' ')[0] || 'there'}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          {nearby.length > 0 ? `${nearby.length} bikes available near you right now` : 'No bikes available right now'}
        </div>
      </div>

      {/* Active rental banner */}
      {realActiveRentals.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {realActiveRentals.map((rental, idx) => {
            const startedAt = rental.tripStartedAt || rental.startedAt;
            const hoursInMs = (rental.hours || 1) * 60 * 60 * 1000;
            const endTime = new Date(new Date(startedAt).getTime() + hoursInMs);
            const now = new Date();
            const diffMs = endTime - now;
            
            let timeStr = 'Time expired';
            let color = 'var(--error)';
            if (diffMs > 0) {
              const h = Math.floor(diffMs / 3600000);
              const m = Math.floor((diffMs % 3600000) / 60000);
              timeStr = h > 0 ? `${h}h ${m}m left` : `${m}m left`;
              color = h > 0 ? 'var(--primary)' : '#F59E0B';
            }

            return (
              <div key={idx} style={{
                background: '#fff', border: `2px solid ${color}`, borderRadius: 18,
                padding: '16px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: 'var(--shadow-sm)',
              }}>
                <img src={rental.vehicleImage || rental.image} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: color, fontWeight: 700, marginBottom: 2 }}>ACTIVE RIDE</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{rental.vehicleName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={13} color={color} /> <span style={{ color: color, fontWeight: 600 }}>{timeStr}</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ width: 'auto', flexShrink: 0, background: color, border: 'none' }} onClick={() => navigate('/renter/requests')}>
                  Manage
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/renter/browse')}
          style={{
            background: '#fff', border: '1px solid var(--border-color)', borderRadius: 16,
            padding: '14px', textAlign: 'left', boxShadow: 'var(--shadow-sm)', minHeight: 84,
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, color: 'var(--primary)' }}>
            <Search size={20} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Find a bike</div>
          <div className="text-light" style={{ fontSize: 12 }}>Browse by the hour</div>
        </button>
        <button
          onClick={() => navigate('/renter/requests')}
          style={{
            background: '#fff', border: '1px solid var(--border-color)', borderRadius: 16,
            padding: '14px', textAlign: 'left', boxShadow: 'var(--shadow-sm)', minHeight: 84,
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, color: 'var(--accent-purple)' }}>
            <Users size={20} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            Ride requests
            {data.availableRideRequests.length > 0 && (
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}> ({data.availableRideRequests.length})</span>
            )}
          </div>
          <div className="text-light" style={{ fontSize: 12 }}>Pick up passengers</div>
        </button>
      </div>

      {/* Stat cards */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        {statCards.map(card => (
          <div
            key={card.label}
            onClick={() => navigate(card.route)}
            className="stat-card"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            {card.icon}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="text-muted text-sm">{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{card.value}</div>
            </div>
            <ChevronRight size={16} color="var(--text-light)" />
          </div>
        ))}
      </div>

      {/* Nearby bikes */}
      {nearby.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ marginBottom: 0 }}>Nearby bikes</h3>
            <button onClick={() => navigate('/renter/browse')} className="btn btn-ghost btn-sm" style={{ width: 'auto', color: 'var(--primary)', fontWeight: 600 }}>
              View all <ChevronRight size={15} />
            </button>
          </div>
          <div className="cards-grid">
            {nearby.map(bike => (
              <div key={bike.id} className="bike-tile" style={{ cursor: 'pointer' }} onClick={() => navigate(`/renter/book/${bike.id}`)}>
                <div className="tile-media">
                  <img src={bike.image} alt={bike.vehicleName} loading="lazy" />
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(12,61,36,0.92)', color: '#fff', padding: '2px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    ৳{bike.hourlyRate}/hr
                  </div>
                </div>
                <div className="tile-body">
                  <div style={{ fontWeight: 800, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bike.vehicleName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 6px' }}>
                    <MapPin size={11} /> {bike.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" /> {bike.rating}
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', minHeight: 38, padding: '8px 0' }} onClick={(e) => { e.stopPropagation(); navigate(`/renter/book/${bike.id}`); }}>
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty CTA */}
      {!realActiveRentals.length && nearby.length === 0 && (
        <div style={{ background: 'var(--surface)', border: '1px dashed var(--border-color)', borderRadius: 16, padding: '36px 20px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={28} color="var(--primary)" />
          </div>
          <h3 style={{ marginBottom: 6 }}>Ready for your next ride?</h3>
          <p className="text-muted text-sm" style={{ marginBottom: 18 }}>Browse available scooters on campus and book instantly.</p>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/renter/browse')}>
            <Search size={16} /> Browse Available Bikes
          </button>
        </div>
      )}
    </div>
  );
}
