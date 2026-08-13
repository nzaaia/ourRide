import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle, Bell, Bike, ChevronRight, Clock, X,
  MapPin, User, Phone, CreditCard, Star, DollarSign,
  Activity, Timer, CheckCircle2, ParkingSquare, HelpCircle
} from 'lucide-react';

function ActiveBikeModal({ bike, request, onClose }) {
  const [timeLeft, setTimeLeft] = useState('');

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
    ? Math.round(request.estimatedFare * 0.87)
    : '—';

  const statusInfo = {
    at_garage: { label: 'At Garage', color: '#3B82F6', bg: '#DBEAFE', icon: <ParkingSquare size={20} /> },
    in_use: { label: 'In Use', color: '#10B981', bg: '#D1FAE5', icon: <Bike size={20} /> },
    returning: { label: 'Returning', color: '#F59E0B', bg: '#FEF3C7', icon: <Timer size={20} /> },
    returned: { label: 'Returned', color: '#6B7280', bg: '#F3F4F6', icon: <CheckCircle2 size={20} /> },
  }[bikeStatus] || { label: 'Unknown', color: '#6B7280', bg: '#F3F4F6', icon: <HelpCircle size={20} /> };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16
    }} onClick={onClose}>
      <div
        style={{
          background: 'white', borderRadius: 20, overflow: 'hidden',
          width: '100%', maxWidth: 560, boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          maxHeight: '90vh', overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: 'relative' }}>
          <img src={bike.image} alt={bike.vehicleName} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <button
            onClick={onClose}
            aria-label="Close"
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

        <div style={{ padding: '20px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
            <div style={{ background: statusInfo.bg, borderRadius: 14, padding: '14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: statusInfo.color, marginBottom: 6 }}>BIKE STATUS</div>
              <div style={{ color: statusInfo.color, marginBottom: 4 }}>{statusInfo.icon}</div>
              <div style={{ fontWeight: 800, color: statusInfo.color }}>{statusInfo.label}</div>
            </div>
            <div style={{ background: '#FEE2E2', borderRadius: 14, padding: '14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', marginBottom: 6 }}>TIME REMAINING</div>
              <Timer size={20} color="#EF4444" style={{ marginBottom: 4 }} />
              <div style={{ fontWeight: 800, color: '#EF4444', fontSize: 18 }}>{timeLeft}</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-color)', borderRadius: 14, padding: '14px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>BIKE LOCATION</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{bike.exactLocation?.address || bike.location}</div>
                {bike.exactLocation && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {bike.exactLocation.lat}°N, {bike.exactLocation.lng}°E
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, var(--primary), #009E45)',
            borderRadius: 14, padding: '14px', marginBottom: 16, color: 'white'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>AMOUNT YOU'LL RECEIVE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={22} />
              <span style={{ fontSize: 30, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>৳{estimatedEarnings}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              ৳{request?.estimatedFare} fare · 13% platform fee deducted
            </div>
          </div>

          {request && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>RENTER DETAILS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'var(--bg-color)', borderRadius: 14, marginBottom: 10 }}>
                <img
                  src={request.renterAvatar}
                  alt={request.renterName}
                  style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{request.renterName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{request.renterRating} · {request.renterPastRides || 18} past rides</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { icon: <Phone size={14} />, label: 'Phone', value: request.renterPhone || '017XXXXXXXX' },
                  {
                    icon: <CreditCard size={14} />, label: 'NID',
                    value: request.renterNid ? `${request.renterNid.slice(0, 4)}••••${request.renterNid.slice(-4)}` : '••••••••••'
                  },
                  { icon: <Clock size={14} />, label: 'Duration', value: `${request.estimatedDuration}h` },
                  { icon: <Activity size={14} />, label: 'Fare', value: `৳${request.estimatedFare}` },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-color)', borderRadius: 10, padding: '11px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {item.icon}
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{item.label}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.value}</div>
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

  const myListings = [...data.listings]
    .filter(l => l.ownerId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeScooters = myListings.filter(l => l.status === 'active');
  const pendingRequests = data.incomingRequests.filter(req =>
    myListings.some(l => l.id === req.vehicleId) && req.status === 'pending'
  );

  const getActiveRequest = (bikeId) =>
    data.incomingRequests.find(r => r.vehicleId === bikeId && r.status === 'accepted');

  const earningsPerBike = (data.recentEarnings || []).reduce((acc, e) => {
    acc[e.vehicleId] = (acc[e.vehicleId] || 0) + e.amount;
    return acc;
  }, {});
  const totalEarned = Object.values(earningsPerBike).reduce((a, b) => a + b, 0) + (data.totalEarnings || 0);

  const statCards = [
    { label: 'Total Bikes', value: myListings.length, color: '#8B5CF6', bg: '#F5F3FF', route: null, icon: <Bike size={22} /> },
    { label: 'Active Now', value: activeScooters.length, color: '#3B82F6', bg: '#EFF6FF', route: null, icon: <Activity size={22} /> },
    { label: 'Total Earned', value: `৳${totalEarned.toLocaleString()}`, color: '#00B14F', bg: '#F0FDF4', route: '/owner/earnings', icon: <DollarSign size={22} /> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {selectedBike && (
        <ActiveBikeModal
          bike={selectedBike}
          request={getActiveRequest(selectedBike.id)}
          onClose={() => setSelectedBike(null)}
        />
      )}

      {/* Header */}
      <div className="page-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ marginBottom: 2 }}>Owner Dashboard</h2>
          <p className="text-muted text-sm" style={{ marginBottom: 0 }}>Welcome back, {user.name.split(' ')[0]}!</p>
        </div>
        <button className="btn btn-primary btn-sm" style={{ width: 'auto', flexShrink: 0 }} onClick={() => navigate('/owner/create')}>
          <PlusCircle size={16} /> Add a Bike
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        {statCards.map(card => (
          <div
            key={card.label}
            onClick={() => card.route && navigate(card.route)}
            style={{
              background: card.bg,
              border: `1.5px solid ${card.color}22`,
              borderRadius: 14,
              padding: '16px 14px',
              cursor: card.route ? 'pointer' : 'default',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ color: card.color, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: card.color, fontVariantNumeric: 'tabular-nums' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ── Section 1: Pending Requests ── */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color={pendingRequests.length > 0 ? 'var(--error)' : 'var(--text-muted)'} />
            <h3 style={{ marginBottom: 0, fontSize: 18 }}>Booking Requests</h3>
            {pendingRequests.length > 0 && (
              <span style={{ background: 'var(--error)', color: 'white', borderRadius: 999, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>
                {pendingRequests.length}
              </span>
            )}
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/owner/requests')}>
            View All <ChevronRight size={14} />
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 14, padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>No pending requests — all clear!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingRequests.slice(0, 3).map(req => {
              const vehicle = myListings.find(l => l.id === req.vehicleId);
              return (
                <div
                  key={req.id}
                  style={{ background: 'white', border: '2px solid #FDE68A', borderRadius: 14, padding: '14px', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={req.renterAvatar} alt={req.renterName} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.renterName} → {vehicle?.vehicleName}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{req.estimatedDuration}h · ৳{req.estimatedFare}</div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ width: 'auto', flexShrink: 0 }} onClick={() => navigate('/owner/requests')}>
                      Review
                    </button>
                  </div>
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
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Bike size={18} color={activeScooters.length > 0 ? '#3B82F6' : 'var(--text-muted)'} />
          <h3 style={{ marginBottom: 0, fontSize: 18 }}>Active Bikes</h3>
          {activeScooters.length > 0 && (
            <span style={{ background: '#3B82F6', color: 'white', borderRadius: 999, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>
              {activeScooters.length}
            </span>
          )}
        </div>

        {activeScooters.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 14, padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ParkingSquare size={20} color="#3B82F6" />
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>All bikes are parked — no active rides.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                  style={{ background: 'white', border: '2px solid #3B82F6', borderRadius: 14, padding: '14px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={scooter.image} alt={scooter.vehicleName} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <b style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scooter.vehicleName}</b>
                        <span style={{ background: statusColors.bg, color: statusColors.color, borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                          {statusColors.label}
                        </span>
                      </div>
                      {activeReq && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>
                          Renter: <strong>{activeReq.renterName}</strong> · ৳{activeReq.estimatedFare}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {activeReq?.estimatedDuration || '?'}h trip · View details <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 3: Listed Bikes ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bike size={18} color="#8B5CF6" />
            <h3 style={{ marginBottom: 0, fontSize: 18 }}>Listed Bikes</h3>
            <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 999, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>
              {myListings.length}
            </span>
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/owner/bikes')}>
            View All & Earnings <ChevronRight size={14} />
          </button>
        </div>

        {myListings.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 14, padding: '32px 20px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bike size={26} color="var(--primary)" />
              </div>
            </div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>No listings yet</h3>
            <p className="text-muted text-sm" style={{ marginBottom: 16 }}>List your first bike and start earning today.</p>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/owner/create')}>Create First Listing</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myListings.map(bike => (
              <div
                key={bike.id}
                onClick={() => navigate('/owner/bikes')}
                style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: '12px 14px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={bike.image} alt={bike.vehicleName} style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bike.vehicleName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{bike.location}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>৳{bike.hourlyRate}/hr</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <span className={bike.status === 'active' ? 'badge badge-blue' : 'badge badge-green'}>
                      {bike.status === 'active' ? 'On Ride' : 'Available'}
                    </span>
                    <ChevronRight size={16} color="var(--text-muted)" style={{ display: 'block', margin: '8px auto 0' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
