import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Star, Wallet, Bike, Bell, ChevronRight, Clock, Settings } from 'lucide-react';

export default function OwnerDashboard() {
  const { data, user } = useAuth();
  const navigate = useNavigate();

  const myListings = data.listings.filter(l => l.ownerId === user.id);
  const activeScooters = myListings.filter(l => l.status === 'active');
  const pendingRequests = data.incomingRequests.filter(req =>
    myListings.some(l => l.id === req.vehicleId) && req.status === 'pending'
  );

  const statCards = [
    {
      icon: <Bell size={28} color="white" />,
      label: 'Pending Requests',
      value: pendingRequests.length,
      route: '/owner/requests',
      bg: pendingRequests.length > 0 ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #6B7280, #4B5563)',
      badge: pendingRequests.length > 0 ? 'Action needed' : 'All clear'
    },
    {
      icon: <Wallet size={28} color="white" />,
      label: 'Total Earnings',
      value: `৳${data.totalEarnings}`,
      route: '/owner/earnings',
      bg: 'linear-gradient(135deg, #00B14F, #009E45)',
      badge: 'View details'
    },
    {
      icon: <Bike size={28} color="white" />,
      label: 'Active Now',
      value: activeScooters.length,
      route: null,
      bg: activeScooters.length > 0 ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
      badge: activeScooters.length > 0 ? 'On the road' : 'All parked'
    },
    {
      icon: <Bike size={28} color="white" />,
      label: 'Listed Bikes',
      value: myListings.length,
      route: '/owner/create',
      bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      badge: 'Add more'
    },
    {
      icon: <Star size={28} color="white" />,
      label: 'Avg Rating',
      value: `${data.userRating}★`,
      route: '/owner/ratings',
      bg: 'linear-gradient(135deg, #F59E0B, #D97706)',
      badge: 'See reviews'
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Owner Dashboard</h2>
          <p className="text-muted" style={{ marginBottom: 0 }}>Manage your bikes and track your earnings.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>
          <PlusCircle size={18} /> Add a Bike
        </button>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid" style={{ marginBottom: 48 }}>
        {statCards.map(card => (
          <div
            key={card.label}
            onClick={() => card.route && navigate(card.route)}
            style={{
              background: card.bg,
              borderRadius: 16,
              padding: '24px 20px',
              cursor: card.route ? 'pointer' : 'default',
              color: 'white',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => { if (card.route) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            {card.icon}
            <div style={{ marginTop: 12, fontSize: 30, fontWeight: 900 }}>{card.value}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{card.label}</div>
            {card.route && (
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                {card.badge} <ChevronRight size={12} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Scooters */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 20 }}>Active Scooters</h3>
        {activeScooters.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-color)', border: 'none' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🅿️</div>
            <p className="text-muted" style={{ marginBottom: 0 }}>No bikes are currently rented out. All your bikes are parked.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeScooters.map(scooter => (
              <div key={scooter.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #3B82F6', padding: '20px 24px' }}>
                <div className="flex items-center gap-4">
                  <img src={scooter.image} alt={scooter.vehicleName} style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 10 }} />
                  <div>
                    <div className="badge badge-blue" style={{ marginBottom: 6 }}>● On Active Ride</div>
                    <h4 style={{ marginBottom: 4 }}>{scooter.vehicleName}</h4>
                    <div className="text-sm text-muted">Reg: {scooter.regNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--error)', fontWeight: 700, marginBottom: 12 }}>
                    <Clock size={16} /> Time left: 1h 45m
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/chat')}>
                      Message Renter
                    </button>
                    <button
                      className="btn btn-outline btn-sm text-muted"
                      style={{ width: 'auto', opacity: 0.5, cursor: 'not-allowed' }}
                      disabled
                      title="Settings locked during active ride"
                    >
                      <Settings size={14} /> Locked
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Listings */}
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 0 }}>All My Listings</h3>
          <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>
            <PlusCircle size={15} /> Add Bike
          </button>
        </div>
        {myListings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏍️</div>
            <h3>No listings yet</h3>
            <p className="text-muted" style={{ marginBottom: 20 }}>List your first bike and start earning today.</p>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>Create First Listing</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myListings.map(bike => (
              <div key={bike.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                <div className="flex items-center gap-4">
                  <img src={bike.image} alt={bike.vehicleName} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                  <div>
                    <h4 style={{ marginBottom: 4 }}>{bike.vehicleName}</h4>
                    <div className="text-sm text-muted">{bike.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>৳{bike.hourlyRate}/hr</div>
                    <span className={bike.status === 'active' ? 'badge badge-blue' : 'badge badge-green'} style={{ marginTop: 4 }}>
                      {bike.status === 'active' ? 'On Ride' : 'Available'}
                    </span>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ width: 'auto' }}
                    disabled={bike.status === 'active'}
                    onClick={() => navigate(`/owner/settings/${bike.id}`)}
                  >
                    <Settings size={14} /> Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
