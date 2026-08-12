import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle, Bell, Bike, ChevronRight, Clock, X,
  MapPin, User, Phone, CreditCard, Star, DollarSign,
  Activity, Timer
} from 'lucide-react';

function ActiveBikeModal({ bike, request, onClose }) {
  const [timeLeft, setTimeLeft] = useState('');

  // Compute remaining time from tripStartedAt + estimatedDuration
  useEffect(() => {
    const calcTime = () => {
      if (!request?.tripStartedAt || !request?.estimatedDuration) {
        setTimeLeft('—');
        return;
      }
      const start = new Date(request.tripStartedAt);
      const end = new Date(start.getTime() + request.estimatedDuration * 3600000);
      const diff = end - Date.now();
      if (diff <= 0) { setTimeLeft('Trip ended'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    calcTime();
    const t = setInterval(calcTime, 30000);
    return () => clearInterval(t);
  }, [request]);

  const bikeStatus = request?.bikeStatus || 'at_garage';
  const estimatedEarnings = request
    ? Math.round(request.estimatedFare * 0.87) // 13% platform fee
    : '—';

  const statusInfo = {
    at_garage: { label: 'At Garage', color: '#3B82F6', bg: '#DBEAFE', emoji: '🅿️' },
    in_use: { label: 'In Use', color: '#10B981', bg: '#D1FAE5', emoji: '🏍️' },
    returning: { label: 'Returning', color: '#F59E0B', bg: '#FEF3C7', emoji: '↩️' },
    returned: { label: 'Returned', color: '#6B7280', bg: '#F3F4F6', emoji: '✅' },
  }[bikeStatus] || { label: 'Unknown', color: '#6B7280', bg: '#F3F4F6', emoji: '❓' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }} onClick={onClose}>
      <div
        style={{
          background: 'white', borderRadius: 24, overflow: 'hidden',
          width: '100%', maxWidth: 560, boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          maxHeight: '90vh', overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header image */}
        <div style={{ position: 'relative' }}>
          <img src={bike.image} alt={bike.vehicleName} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ position: 'absolute', bottom: 14, left: 20 }}>
            <h3 style={{ color: 'white', margin: 0, marginBottom: 4 }}>{bike.vehicleName}</h3>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{bike.regNumber}</div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Status + Timer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div style={{ background: statusInfo.bg, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: statusInfo.color, marginBottom: 6 }}>BIKE STATUS</div>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{statusInfo.emoji}</div>
              <div style={{ fontWeight: 800, color: statusInfo.color }}>{statusInfo.label}</div>
            </div>
            <div style={{ background: '#FEE2E2', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', marginBottom: 6 }}>TIME REMAINING</div>
              <Timer size={20} color="#EF4444" style={{ marginBottom: 4 }} />
              <div style={{ fontWeight: 800, color: '#EF4444', fontSize: 18 }}>{timeLeft}</div>
            </div>
          </div>

          {/* Bike Location */}
          <div style={{ background: 'var(--bg-color)', borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>BIKE LOCATION</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{bike.exactLocation?.address || bike.location}</div>
                {bike.exactLocation && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {bike.exactLocation.lat}°N, {bike.exactLocation.lng}°E
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), #009E45)',
            borderRadius: 14, padding: '16px 18px', marginBottom: 20, color: 'white'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 6 }}>AMOUNT YOU'LL RECEIVE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={22} />
              <span style={{ fontSize: 32, fontWeight: 900 }}>৳{estimatedEarnings}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              ৳{request?.estimatedFare} fare · 13% platform fee deducted
            </div>
          </div>

          {/* Renter Details */}
          {request && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14 }}>RENTER DETAILS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: 'var(--bg-color)', borderRadius: 14, marginBottom: 12 }}>
                <img
                  src={request.renterAvatar}
                  alt={request.renterName}
                  style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{request.renterName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{request.renterRating} · {request.renterPastRides || 18} past rides</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: <Phone size={15} />, label: 'Phone', value: request.renterPhone || '017XXXXXXXX' },
                  {
                    icon: <CreditCard size={15} />, label: 'NID',
                    value: request.renterNid ? `${request.renterNid.slice(0, 4)}••••${request.renterNid.slice(-4)}` : '••••••••••'
                  },
                  { icon: <Clock size={15} />, label: 'Duration', value: `${request.estimatedDuration}h` },
                  { icon: <Activity size={15} />, label: 'Fare', value: `৳${request.estimatedFare}` },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-color)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {item.icon}
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{item.label}</span>
                    </div>
                    <div style={{ fontWeight: 700 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const { data, user } = useAuth();
  const navigate = useNavigate();
  const [selectedBike, setSelectedBike] = useState(null);

  // Sort newest first
  const myListings = [...data.listings]
    .filter(l => l.ownerId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeScooters = myListings.filter(l => l.status === 'active');
  const pendingRequests = data.incomingRequests.filter(req =>
    myListings.some(l => l.id === req.vehicleId) && req.status === 'pending'
  );

  // Find active request for a bike
  const getActiveRequest = (bikeId) =>
    data.incomingRequests.find(r => r.vehicleId === bikeId && r.status === 'accepted');

  // Compute total earnings
  const earningsPerBike = (data.recentEarnings || []).reduce((acc, e) => {
    acc[e.vehicleId] = (acc[e.vehicleId] || 0) + e.amount;
    return acc;
  }, {});
  const totalEarned = Object.values(earningsPerBike).reduce((a, b) => a + b, 0) + (data.totalEarnings || 0);

  const statCards = [
    { label: 'Total Bikes', value: myListings.length, color: '#8B5CF6', bg: '#F5F3FF', route: null },
    { label: 'Active Now', value: activeScooters.length, color: '#3B82F6', bg: '#EFF6FF', route: null },
    { label: 'Total Earned', value: `৳${totalEarned.toLocaleString()}`, color: '#00B14F', bg: '#F0FDF4', route: '/owner/earnings' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Modal */}
      {selectedBike && (
        <ActiveBikeModal
          bike={selectedBike}
          request={getActiveRequest(selectedBike.id)}
          onClose={() => setSelectedBike(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 28 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Owner Dashboard</h2>
          <p className="text-muted" style={{ marginBottom: 0 }}>Welcome back, {user.name.split(' ')[0]}! Manage your bikes.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>
          <PlusCircle size={18} /> Add a Bike
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
        {statCards.map(card => (
          <div
            key={card.label}
            onClick={() => card.route && navigate(card.route)}
            style={{
              background: card.bg,
              border: `1.5px solid ${card.color}22`,
              borderRadius: 16,
              padding: '20px 24px',
              cursor: card.route ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => { if (card.route) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: card.color }}>{card.value}</div>
            </div>
            {card.route && <ChevronRight size={18} color={card.color} style={{ marginLeft: 'auto' }} />}
          </div>
        ))}
      </div>

      {/* ── Section 1: Pending Requests ── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={20} color={pendingRequests.length > 0 ? 'var(--error)' : 'var(--text-muted)'} />
            <h3 style={{ marginBottom: 0 }}>Booking Requests</h3>
            {pendingRequests.length > 0 && (
              <span style={{
                background: 'var(--error)', color: 'white',
                borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700
              }}>{pendingRequests.length}</span>
            )}
          </div>
          <button
            className="btn btn-outline btn-sm"
            style={{ width: 'auto' }}
            onClick={() => navigate('/owner/requests')}
          >
            View All <ChevronRight size={15} />
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '28px', textAlign: 'center',
            border: '1px solid var(--border-color)', color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 600 }}>No pending requests — all clear!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingRequests.slice(0, 3).map(req => {
              const vehicle = myListings.find(l => l.id === req.vehicleId);
              return (
                <div
                  key={req.id}
                  style={{
                    background: 'white', border: '2px solid #FDE68A',
                    borderRadius: 16, padding: '16px 20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={req.renterAvatar} alt={req.renterName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{req.renterName} → {vehicle?.vehicleName}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{req.estimatedDuration}h · ৳{req.estimatedFare}</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: 'auto' }}
                    onClick={() => navigate('/owner/requests')}
                  >
                    Review
                  </button>
                </div>
              );
            })}
            {pendingRequests.length > 3 && (
              <button className="btn btn-outline btn-sm" style={{ width: 'auto', alignSelf: 'center' }} onClick={() => navigate('/owner/requests')}>
                +{pendingRequests.length - 3} more requests
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Section 2: Active Bikes ── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Bike size={20} color={activeScooters.length > 0 ? '#3B82F6' : 'var(--text-muted)'} />
          <h3 style={{ marginBottom: 0 }}>Active Bikes</h3>
          {activeScooters.length > 0 && (
            <span style={{ background: '#3B82F6', color: 'white', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
              {activeScooters.length}
            </span>
          )}
        </div>

        {activeScooters.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '28px', textAlign: 'center',
            border: '1px solid var(--border-color)', color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🅿️</div>
            <div style={{ fontWeight: 600 }}>All bikes are parked — no active rides.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeScooters.map(scooter => {
              const activeReq = getActiveRequest(scooter.id);
              const bikeStatus = activeReq?.bikeStatus || 'at_garage';
              const statusColors = {
                at_garage: { color: '#3B82F6', label: 'At Garage', bg: '#DBEAFE' },
                in_use: { color: '#10B981', label: 'In Use', bg: '#D1FAE5' },
                returning: { color: '#F59E0B', label: 'Returning', bg: '#FEF3C7' },
                returned: { color: '#6B7280', label: 'Returned', bg: '#F3F4F6' },
              }[bikeStatus] || { color: '#3B82F6', label: 'Active', bg: '#DBEAFE' };

              return (
                <div
                  key={scooter.id}
                  onClick={() => setSelectedBike(scooter)}
                  style={{
                    background: 'white',
                    border: `2px solid #3B82F6`,
                    borderRadius: 18,
                    padding: '18px 22px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.15s, box-shadow 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img src={scooter.image} alt={scooter.vehicleName} style={{ width: 90, height: 64, objectFit: 'cover', borderRadius: 10 }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{ marginBottom: 0 }}>{scooter.vehicleName}</h4>
                        <span style={{ background: statusColors.bg, color: statusColors.color, borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                          {statusColors.label}
                        </span>
                      </div>
                      {activeReq && (
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          Renter: <strong>{activeReq.renterName}</strong> · ৳{activeReq.estimatedFare}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                        <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {activeReq?.estimatedDuration || '?'}h trip
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
                    Click to view details <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 3: Listed Bikes ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bike size={20} color="#8B5CF6" />
            <h3 style={{ marginBottom: 0 }}>Listed Bikes</h3>
            <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
              {myListings.length}
            </span>
          </div>
          <button
            className="btn btn-outline btn-sm"
            style={{ width: 'auto' }}
            onClick={() => navigate('/owner/bikes')}
          >
            View All & Earnings <ChevronRight size={15} />
          </button>
        </div>

        {myListings.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '40px', textAlign: 'center',
            border: '1px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏍️</div>
            <h3>No listings yet</h3>
            <p className="text-muted" style={{ marginBottom: 20 }}>List your first bike and start earning today.</p>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>Create First Listing</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myListings.map(bike => (
              <div
                key={bike.id}
                onClick={() => navigate('/owner/bikes')}
                style={{
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border-color 0.15s, box-shadow 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={bike.image} alt={bike.vehicleName} style={{ width: 72, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{bike.vehicleName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{bike.location}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>৳{bike.hourlyRate}/hr</div>
                    <span className={bike.status === 'active' ? 'badge badge-blue' : 'badge badge-green'} style={{ marginTop: 4 }}>
                      {bike.status === 'active' ? 'On Ride' : 'Available'}
                    </span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
