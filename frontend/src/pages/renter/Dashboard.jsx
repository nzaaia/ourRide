import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Bookmark, Star, Map, Users, ChevronRight } from 'lucide-react';

export default function RenterDashboard() {
  const { data, activeRentals, activePassengerRides } = useAuth();
  const navigate = useNavigate();

  const savedCount = data.savedBikes.length;
  const tripCount = (data.pastTrips || []).length;
  const rating = data.userRating;

  const statCards = [
    { icon: <Map size={24} color="var(--primary)" />, label: 'Past Trips', value: tripCount, route: '/renter/trips', bg: 'white' },
    { icon: <Bookmark size={24} color="#8B5CF6" />, label: 'Saved Bikes', value: savedCount, route: '/renter/saved', bg: 'white' },
    { icon: <Star size={24} color="#F59E0B" />, label: 'Your Rating', value: `${rating}★`, route: '/renter/ratings', bg: 'white' },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>My Dashboard</h2>
          <p className="text-muted" style={{ marginBottom: 0 }}>Welcome back! Here's what's going on.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/renter/browse')}>
          <Search size={18} /> Find a Bike
        </button>
      </div>

      {/* Active Rental Banner */}
      {activeRentals.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          {activeRentals.map((rental, idx) => (
            <div key={idx} style={{
              background: 'white',
              border: '2px solid var(--primary)',
              borderRadius: 16,
              padding: '24px 28px',
              color: 'var(--text-main)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div className="flex items-center gap-4">
                <img src={rental.image} alt={rental.vehicleName} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 10 }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>● ACTIVE RIDE</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{rental.vehicleName}</div>
                  <div style={{ fontSize: 15, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={15} color="var(--error)" /> <span style={{ color: 'var(--error)' }}>Time Remaining: <strong>1h 45m</strong></span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => navigate('/passenger/search')}
                  style={{ background: 'var(--primary)', color: 'white', padding: '10px 18px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Users size={16} /> Find Passengers
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  style={{ background: 'white', color: 'var(--text-main)', padding: '10px 18px', borderRadius: 10, fontWeight: 600, border: '1.5px solid var(--border-color)', cursor: 'pointer' }}
                >
                  Message Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Passengers */}
      {activePassengerRides.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={20} /> Passengers On Board</h3>
          {activePassengerRides.map((ride, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #3B82F6' }}>
              <div className="flex items-center gap-3">
                <img src={ride.passengerAvatar} alt={ride.passengerName} className="avatar" style={{ width: 48, height: 48 }} />
                <div>
                  <div className="font-semibold">{ride.passengerName}</div>
                  <div className="text-sm text-muted">{ride.pickup} → {ride.dropoff}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/chat')}>Chat</button>
                <button className="btn btn-primary btn-sm" style={{ width: 'auto' }}>Navigate</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <div className="dashboard-grid" style={{ marginBottom: 32 }}>
        {statCards.map(card => (
          <div
            key={card.label}
            onClick={() => navigate(card.route)}
            style={{
              background: card.bg,
              border: '1px solid var(--border-color)',
              borderRadius: 16,
              padding: '24px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            {card.icon}
            <div>
              <div className="text-muted text-sm">{card.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{card.value}</div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
          </div>
        ))}
      </div>

      {/* CTA */}
      {!activeRentals.length && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏍️</div>
          <h3 style={{ marginBottom: 8 }}>Ready for your next ride?</h3>
          <p className="text-muted" style={{ marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Browse available scooters on campus and book instantly.
          </p>
          <button className="btn btn-primary btn-lg" style={{ width: 'auto' }} onClick={() => navigate('/renter/browse')}>
            Browse Available Bikes
          </button>
        </div>
      )}
    </div>
  );
}
