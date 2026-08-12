import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Navigation, CheckCircle, XCircle,
  Phone, MessageCircle, Clock, AlertTriangle, Camera, DollarSign
} from 'lucide-react';
import TripPhotoCapture from './TripPhotoCapture';

// Countdown timer hook
function useCountdown(startIso, limitMinutes = 20) {
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    if (!startIso) return;
    const deadline = new Date(new Date(startIso).getTime() + limitMinutes * 60000);
    const calc = () => {
      const diff = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [startIso, limitMinutes]);

  if (secondsLeft === null) return null;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return { secondsLeft, label: `${m}:${s.toString().padStart(2, '0')}`, expired: secondsLeft === 0 };
}

function AcceptedBikeCard({ req }) {
  const { submitBeforePhoto, submitAfterPhoto, completeTrip } = useAuth();
  const countdown = useCountdown(req.acceptedAt, 20);
  const [photoPhase, setPhotoPhase] = useState(null); // 'before' | 'after' | null

  const bikeStatus = req.bikeStatus || 'accepted'; // accepted → in_use → returning → completed

  const locationLines = req.exactLocation
    ? [req.exactLocation.address, `${req.exactLocation.lat}°N, ${req.exactLocation.lng}°E`]
    : [req.location || req.pickupLocation || 'Location pending'];

  return (
    <>
      {photoPhase && (
        <TripPhotoCapture
          phase={photoPhase}
          onCapture={(dataUrl) => {
            if (photoPhase === 'before') submitBeforePhoto(req.requestId || req.id, dataUrl);
            else submitAfterPhoto(req.requestId || req.id, dataUrl);
            setPhotoPhase(null);
          }}
          onCancel={() => setPhotoPhase(null)}
        />
      )}

      <div style={{
        background: 'white',
        border: `2px solid ${bikeStatus === 'in_use' ? 'var(--primary)' : bikeStatus === 'returning' ? '#F59E0B' : '#3B82F6'}`,
        borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <img src={req.vehicleImage} alt={req.vehicleName} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: 2 }}>
              {bikeStatus === 'in_use' ? '● ACTIVE RIDE' : bikeStatus === 'returning' ? '↩ RETURNING' : '✓ ACCEPTED'}
            </div>
            <h4 style={{ color: 'white', margin: 0 }}>{req.vehicleName}</h4>
          </div>
        </div>

        <div style={{ padding: '20px 22px' }}>

          {/* Location (revealed after acceptance) */}
          <div style={{ background: 'var(--primary-light)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>📍 EXACT PICKUP LOCATION (REVEALED)</div>
            {locationLines.map((line, i) => (
              <div key={i} style={{ fontWeight: i === 0 ? 700 : 500, fontSize: i === 0 ? 15 : 12, color: i === 0 ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: 2 }}>{line}</div>
            ))}
          </div>

          {/* 20-minute timer (only while status is 'accepted' i.e. not yet in_use) */}
          {bikeStatus === 'accepted' && countdown && !countdown.expired && (
            <div style={{
              background: countdown.secondsLeft < 300 ? '#FEE2E2' : '#FEF3C7',
              borderRadius: 14, padding: '14px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <Clock size={22} color={countdown.secondsLeft < 300 ? 'var(--error)' : '#92400E'} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: countdown.secondsLeft < 300 ? 'var(--error)' : '#92400E', marginBottom: 2 }}>
                  TIME TO ARRIVE
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: countdown.secondsLeft < 300 ? 'var(--error)' : '#92400E', fontVariantNumeric: 'tabular-nums' }}>
                  {countdown.label}
                </div>
              </div>
              <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: countdown.secondsLeft < 300 ? 'var(--error)' : '#92400E', fontWeight: 600 }}>
                Go to the bike location within 20 minutes or you'll have to rebook.
              </div>
            </div>
          )}

          {/* Expired */}
          {bikeStatus === 'accepted' && countdown?.expired && (
            <div style={{ background: '#FEE2E2', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={20} color="var(--error)" />
              <div style={{ fontWeight: 700, color: 'var(--error)' }}>Time expired. Please rebook.</div>
            </div>
          )}

          {/* "I'm Here" → before photo (only when status is accepted and timer not expired) */}
          {bikeStatus === 'accepted' && countdown && !countdown.expired && (
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 12 }}
              onClick={() => setPhotoPhase('before')}
            >
              <Camera size={18} /> I'm Here — Take Before Photo
            </button>
          )}

          {/* During ride: return flow */}
          {bikeStatus === 'in_use' && (
            <div style={{ background: '#D1FAE5', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>🏍️ Ride in progress</div>
              <div style={{ fontSize: 13, color: '#047857' }}>Return the bike and submit an after photo + payment to complete the trip.</div>
            </div>
          )}

          {bikeStatus === 'in_use' && (
            <button
              className="btn btn-primary"
              style={{ width: '100%', background: '#F59E0B', boxShadow: 'none', marginBottom: 12 }}
              onClick={() => setPhotoPhase('after')}
            >
              <Camera size={18} /> Return Bike — Take After Photo
            </button>
          )}

          {/* Payment step */}
          {bikeStatus === 'returning' && (
            <>
              <div style={{ background: '#FEF3C7', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>↩ After photo submitted!</div>
                <div style={{ fontSize: 13, color: '#92400E' }}>Please pay to complete the trip.</div>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', background: 'var(--bg-color)', borderRadius: 12, marginBottom: 14
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL FARE</div>
                  <div style={{ fontWeight: 900, fontSize: 28, color: 'var(--primary)' }}>৳{req.totalFare}</div>
                </div>
                <DollarSign size={28} color="var(--primary)" />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => completeTrip(req.requestId || req.id)}
              >
                ✓ Confirm Payment & Complete Trip
              </button>
            </>
          )}

          {/* Fare */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, marginTop: 10 }}>
            <span className="text-muted">Estimated fare:</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 18 }}>৳{req.totalFare}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RenterRequests() {
  const { renterBookingRequests, data, activeRentals, acceptPassengerRide, makeCounterOffer } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('sent');
  const [counterAmounts, setCounterAmounts] = useState({});

  const activeReqs = renterBookingRequests.filter(r => r.status === 'active');
  const acceptedReqs = renterBookingRequests.filter(r => r.status === 'accepted');
  const allActive = [...activeReqs, ...acceptedReqs];

  const pastReqs = renterBookingRequests.filter(r => r.status === 'completed');
  const pendingReqs = renterBookingRequests.filter(r => r.status === 'pending');

  const hasActiveBike = activeRentals.length > 0;
  const passReqs = data.availableRideRequests;

  const sentCount = renterBookingRequests.length;
  const receivedCount = passReqs.length;
  const pastSent = renterBookingRequests.filter(r => r.status === 'completed').map(r => ({ ...r, type: 'sent', displayStatus: 'accepted' }));
  const pastReceived = (data.pastTrips || []).map(t => ({ ...t, type: 'received', displayStatus: 'accepted' }));
  const allPastRequests = [...pastSent, ...pastReceived];

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

  const tabs = [
    { id: 'sent', label: 'Sent', count: sentCount },
    { id: 'passengers', label: 'Passenger Requests', count: receivedCount },
    { id: 'past', label: 'Past', count: allPastRequests.length },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>Requests</h2>
      <p className="text-muted" style={{ marginBottom: 28 }}>Manage your bike bookings and incoming passenger requests.</p>

      {/* Tab bar */}
      <div className="tabs" style={{ marginBottom: 32 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count > 0 && (
              <span style={{
                marginLeft: 8, background: tab === t.id ? 'var(--primary)' : 'var(--border-color)',
                color: tab === t.id ? 'white' : 'var(--text-muted)',
                borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 700
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* === SENT REQUESTS === */}
      {tab === 'sent' && (
        <div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Accepted/Active bookings — show rich card with location + timer + photo flow */}
              {(acceptedReqs.length > 0 || activeReqs.length > 0) && (
                <div>
                  <h4 style={{ marginBottom: 14, color: 'var(--primary)' }}>● Active & Accepted Bookings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[...acceptedReqs, ...activeReqs].map(req => (
                      <AcceptedBikeCard key={req.id} req={req} />
                    ))}
                  </div>
                </div>
              )}

              {/* Pending bookings */}
              {pendingReqs.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: 14, color: 'var(--text-muted)' }}>Pending Approval</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pendingReqs.map(req => (
                      <div key={req.id} style={{
                        background: 'white', border: '2px solid var(--border-color)',
                        borderRadius: 16, padding: '18px 22px',
                        display: 'flex', gap: 18, alignItems: 'center', boxShadow: 'var(--shadow-sm)'
                      }}>
                        <img src={req.vehicleImage} alt={req.vehicleName} style={{ width: 90, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h4 style={{ marginBottom: 0 }}>{req.vehicleName}</h4>
                            <span className="badge badge-yellow">Pending</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{req.location}</div>
                          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 17 }}>৳{req.totalFare}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/chat')}>
                            <MessageCircle size={14} /> Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* === PASSENGER REQUESTS === */}
      {tab === 'passengers' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
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
                  background: 'white', border: '2px solid var(--border-color)',
                  borderRadius: 18, padding: '24px', boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img src={ride.passengerAvatar} alt={ride.passengerName} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{ride.passengerName}</div>
                        <div style={{ fontSize: 13, color: '#F59E0B', fontWeight: 600 }}>★ {ride.passengerRating}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ride.time}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>৳{ride.estimatedFare}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>~{ride.estimatedTime}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px', background: 'var(--bg-color)', borderRadius: 12, marginBottom: 18 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <MapPin size={17} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>PICKUP</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{ride.pickup}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Navigation size={17} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>DROPOFF</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{ride.dropoff}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <button
                      className="btn btn-primary" style={{ flex: 1 }}
                      disabled={!hasActiveBike}
                      onClick={() => handleAcceptPassenger(ride.id)}
                    >
                      <CheckCircle size={16} /> Accept ৳{ride.estimatedFare}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Counter Offer (৳)</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="number" className="input"
                          placeholder={`e.g. ${ride.estimatedFare - 30}`}
                          disabled={!hasActiveBike}
                          value={counterAmounts[ride.id] || ''}
                          onChange={e => setCounterAmounts(prev => ({ ...prev, [ride.id]: e.target.value }))}
                          style={{ flex: 1 }}
                        />
                        <button className="btn btn-outline" style={{ width: 'auto' }} disabled={!hasActiveBike} onClick={() => handleCounterOffer(ride.id)}>
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

      {/* === PAST === */}
      {tab === 'past' && (
        <div>
          {allPastRequests.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 56, marginBottom: 16 }}>🕒</div>
              <h3>No past requests</h3>
              <p>Your history of requests will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {allPastRequests.map((req, idx) => (
                <div key={req.id || idx} style={{
                  background: 'white', border: '1px solid var(--border-color)',
                  borderRadius: 16, padding: '18px 22px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {req.type === 'sent' ? (
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Navigation size={22} />
                      </div>
                    ) : (
                      <img src={req.passengerAvatar || req.ownerAvatar} alt={req.owner} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                        {req.type === 'sent' ? `Sent: ${req.vehicleName || req.vehicle}` : `Ride: ${req.owner}`}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {req.type === 'sent'
                          ? `৳${req.totalFare}`
                          : `${req.pickup || req.date} → ${req.dropoff || ''} · ৳${req.totalFare || req.estimatedFare}`}
                      </div>
                    </div>
                  </div>
                  <span className={req.displayStatus === 'accepted' ? 'badge badge-green' : 'badge badge-red'}>
                    {req.displayStatus === 'accepted' ? 'Completed' : 'Rejected'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
