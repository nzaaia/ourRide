import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, CheckCircle, XCircle, Phone, MessageCircle } from 'lucide-react';

export default function RenterRequests() {
  const { renterBookingRequests, data, activeRentals, acceptPassengerRide, makeCounterOffer } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('sent'); // 'sent' | 'passengers' | 'past'
  const [counterAmounts, setCounterAmounts] = useState({});

  const activeReqs = renterBookingRequests.filter(r => r.status === 'active');
  const pastReqs = renterBookingRequests.filter(r => r.status === 'completed');

  const hasActiveBike = activeRentals.length > 0;
  const passReqs = data.availableRideRequests;

  const sentCount = renterBookingRequests.length;
  const receivedCount = passReqs.length;
  
  // Combine past requests for display
  const pastSent = renterBookingRequests.filter(r => r.status === 'completed').map(r => ({ ...r, type: 'sent', displayStatus: 'accepted' }));
  const pastReceived = (data.pastTrips || []).map(t => ({ ...t, type: 'received', displayStatus: 'accepted' }));
  // Add a dummy rejected request to show the UI
  const dummyRejected = { id: 'dummy_rej', type: 'received', displayStatus: 'rejected', passengerName: 'Kamal', passengerAvatar: 'https://i.pravatar.cc/150?u=kamal', pickup: 'Banani', dropoff: 'Gulshan', estimatedFare: 150 };
  const allPastRequests = [...pastSent, ...pastReceived, dummyRejected];

  const handleAcceptPassenger = (rideId) => {
    acceptPassengerRide(rideId);
    navigate('/renter/dashboard');
  };

  const handleCounterOffer = (rideId) => {
    const amt = counterAmounts[rideId];
    if (!amt || isNaN(amt)) { alert('Please enter a valid amount'); return; }
    makeCounterOffer(rideId, Number(amt), 'Nazia Putul');
    alert(`Counter offer of ৳${amt} sent!`);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>Requests</h2>
      <p className="text-muted" style={{ marginBottom: 28 }}>Manage your bike bookings and incoming passenger requests.</p>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
        <div
          onClick={() => setTab('sent')}
          style={{
            background: tab === 'sent' ? 'var(--primary)' : 'var(--primary-light)',
            border: `2px solid var(--primary)`,
            borderRadius: 14,
            padding: '20px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900, color: tab === 'sent' ? 'white' : 'var(--primary)', marginBottom: 4 }}>{sentCount}</div>
          <div style={{ fontWeight: 600, color: tab === 'sent' ? 'white' : 'var(--primary)', opacity: 0.9 }}>Sent requests</div>
        </div>
        <div
          onClick={() => setTab('passengers')}
          style={{
            background: tab === 'passengers' ? '#F59E0B' : '#FEF3C7',
            border: `2px solid #F59E0B`,
            borderRadius: 14,
            padding: '20px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900, color: tab === 'passengers' ? 'white' : '#92400E', marginBottom: 4 }}>{receivedCount}</div>
          <div style={{ fontWeight: 600, color: tab === 'passengers' ? 'white' : '#92400E', opacity: 0.9 }}>Received requests</div>
        </div>
        <div
          onClick={() => setTab('past')}
          style={{
            background: tab === 'past' ? '#10B981' : '#D1FAE5',
            border: `2px solid #10B981`,
            borderRadius: 14,
            padding: '20px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900, color: tab === 'past' ? 'white' : '#065F46', marginBottom: 4 }}>{allPastRequests.length}</div>
          <div style={{ fontWeight: 600, color: tab === 'past' ? 'white' : '#065F46', opacity: 0.9 }}>Past requests</div>
        </div>
      </div>

      {/* === SENT REQUESTS TAB === */}
      {tab === 'sent' && (
        <div>
          <h3 style={{ marginBottom: 20 }}>Sent requests</h3>

          {renterBookingRequests.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 56, marginBottom: 16 }}>🏍️</div>
              <h3>No booking requests yet</h3>
              <p>When you book a bike, your requests will appear here.</p>
              <button className="btn btn-primary" style={{ width: 'auto', marginTop: 16 }} onClick={() => navigate('/renter/browse')}>
                Browse Bikes
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {renterBookingRequests.map(req => (
                <div key={req.id} style={{
                  background: 'white',
                  border: `2px solid ${req.status === 'active' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <img src={req.vehicleImage} alt={req.vehicleName} style={{ width: 100, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <h4 style={{ marginBottom: 0 }}>{req.vehicleName}</h4>
                      <span className={req.status === 'active' ? 'badge badge-green' : 'badge badge-blue'}>
                        {req.status === 'active' ? '● Active' : 'Completed'}
                      </span>
                    </div>
                    <div className="text-sm text-muted" style={{ marginBottom: 4 }}>{req.location}</div>
                    <div className="text-sm text-muted" style={{ marginBottom: 6 }}>{req.selectedDay} at {req.selectedTime} · {req.hours}h</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>Total fare ৳{req.totalFare}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/chat')}>
                      <MessageCircle size={14} /> Message
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => alert(`Calling ${req.ownerName}...`)}>
                      <Phone size={14} /> Call
                    </button>
                    {req.canFindPassengers && req.status === 'active' && (
                      <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/passenger/search')}>
                        Find Passengers
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === PASSENGER REQUESTS TAB === */}
      {tab === 'passengers' && (
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 0 }}>Received requests</h3>
            {!hasActiveBike && (
              <span className="badge badge-yellow">⚠ Book a bike first to accept passengers</span>
            )}
          </div>

          {passReqs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 56, marginBottom: 16 }}>👤</div>
              <h3>No passenger requests</h3>
              <p>When passengers post ride requests, they'll appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {passReqs.map(ride => (
                <div key={ride.id} style={{
                  background: 'white',
                  border: '2px solid var(--border-color)',
                  borderRadius: 16,
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Passenger info header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div className="flex items-center gap-3">
                      <img src={ride.passengerAvatar} alt={ride.passengerName} className="avatar" style={{ width: 52, height: 52 }} />
                      <div>
                        <div className="font-bold">{ride.passengerName}</div>
                        <div className="text-sm" style={{ color: '#F59E0B' }}>★ {ride.passengerRating}</div>
                        <div className="text-xs text-muted">{ride.time}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>৳{ride.estimatedFare}</div>
                      <div className="text-xs text-muted">passenger's offer · ~{ride.estimatedTime}</div>
                    </div>
                  </div>

                  {/* Route */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px', background: 'var(--bg-color)', borderRadius: 10, marginBottom: 20 }}>
                    <div className="flex gap-2">
                      <MapPin size={18} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div className="text-xs text-muted font-semibold" style={{ marginBottom: 2 }}>PICKUP</div>
                        <div className="font-semibold text-sm">{ride.pickup}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Navigation size={18} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div className="text-xs text-muted font-semibold" style={{ marginBottom: 2 }}>DROPOFF</div>
                        <div className="font-semibold text-sm">{ride.dropoff}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={!hasActiveBike}
                      onClick={() => handleAcceptPassenger(ride.id)}
                      title={!hasActiveBike ? 'Book a bike first' : ''}
                    >
                      <CheckCircle size={16} /> Accept ৳{ride.estimatedFare}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div className="text-xs text-muted font-semibold" style={{ marginBottom: 4 }}>Counter Offer (৳)</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="number"
                          className="input"
                          placeholder={`e.g. ${ride.estimatedFare - 30}`}
                          disabled={!hasActiveBike}
                          value={counterAmounts[ride.id] || ''}
                          onChange={e => setCounterAmounts(prev => ({ ...prev, [ride.id]: e.target.value }))}
                          style={{ flex: 1 }}
                        />
                        <button
                          className="btn btn-outline"
                          style={{ width: 'auto' }}
                          disabled={!hasActiveBike}
                          onClick={() => handleCounterOffer(ride.id)}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === PAST REQUESTS TAB === */}
      {tab === 'past' && (
        <div>
          <h3 style={{ marginBottom: 20 }}>Past requests</h3>
          
          {allPastRequests.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 56, marginBottom: 16 }}>🕒</div>
              <h3>No past requests</h3>
              <p>Your history of sent and received requests will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {allPastRequests.map((req, idx) => (
                <div key={req.id || idx} style={{
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div className="flex items-center gap-4">
                    {req.type === 'sent' ? (
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Navigation size={24} />
                      </div>
                    ) : (
                      <img src={req.passengerAvatar} alt={req.passengerName || req.owner} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                        <h4 style={{ margin: 0, fontSize: 16 }}>
                          {req.type === 'sent' ? `Sent: ${req.vehicleName}` : `Received: ${req.passengerName || req.owner}`}
                        </h4>
                        <span className={req.displayStatus === 'accepted' ? 'badge badge-green' : 'badge badge-red'}>
                          {req.displayStatus === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      </div>
                      <div className="text-sm text-muted">
                        {req.type === 'sent' ? `${req.location} · ৳${req.totalFare}` : `${req.pickup} → ${req.dropoff} · ৳${req.totalFare || req.estimatedFare}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
