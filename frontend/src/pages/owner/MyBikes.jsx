import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Settings, PlusCircle, MapPin } from 'lucide-react';

export default function MyBikes() {
  const { data, user } = useAuth();
  const navigate = useNavigate();

  // Sort by createdAt descending (newest first)
  const myListings = [...data.listings]
    .filter(l => l.ownerId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Compute per-bike earnings from recentEarnings
  const earningsPerBike = (data.recentEarnings || []).reduce((acc, e) => {
    acc[e.vehicleId] = (acc[e.vehicleId] || 0) + e.amount;
    return acc;
  }, {});

  const statusStyle = {
    available: { label: 'Available', badgeClass: 'badge badge-green' },
    active: { label: 'On Ride', badgeClass: 'badge badge-blue' },
    unavailable: { label: 'Unavailable', badgeClass: 'badge badge-yellow' },
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>My Fleet</h2>
          <p className="text-muted" style={{ marginBottom: 0 }}>All your listed bikes — click one to manage its settings.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>
          <PlusCircle size={18} /> Add a Bike
        </button>
      </div>

      {/* Bike list */}
      {myListings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏍️</div>
          <h3>No bikes listed yet</h3>
          <p className="text-muted" style={{ marginBottom: 24 }}>List your first bike and start earning today.</p>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>
            Create First Listing
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {myListings.map(bike => {
            const totalEarned = (earningsPerBike[bike.id] || 0) + (bike.totalBikeEarnings || 0);
            const st = statusStyle[bike.status] || statusStyle['available'];
            return (
              <div
                key={bike.id}
                onClick={() => navigate(`/owner/settings/${bike.id}`)}
                style={{
                  background: 'white',
                  border: `2px solid ${bike.status === 'active' ? '#3B82F6' : 'var(--border-color)'}`,
                  borderRadius: 20,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                {/* Bike image */}
                <img
                  src={bike.image}
                  alt={bike.vehicleName}
                  style={{ width: 110, height: 78, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                />

                {/* Main info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h4 style={{ marginBottom: 0 }}>{bike.vehicleName}</h4>
                    <span className={st.badgeClass}>{st.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <MapPin size={13} /> {bike.location}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Reg: {bike.regNumber} · {bike.totalTrips} trips
                  </div>
                </div>

                {/* Earnings + rate */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
                    <TrendingUp size={15} color="#00B14F" />
                    <span style={{ fontWeight: 800, fontSize: 20, color: '#00B14F' }}>৳{totalEarned.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>total earned</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 14 }}>৳{bike.hourlyRate}/hr</div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <Settings size={20} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
