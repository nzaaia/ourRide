import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Navigation, CheckCircle2, Phone, MessageCircle,
  Clock, AlertTriangle, Camera, DollarSign, Bike, Star, Timer
} from 'lucide-react';
import TripPhotoCapture from './TripPhotoCapture';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import './RenterRequests.css';

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

export function AcceptedBikeCard({ req }) {
  const { submitBeforePhoto, submitAfterPhoto, completeTrip, requestMoreTime, cancelBookingRequest } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const arrivalCountdown = useCountdown(req.acceptedAt, 20); // 20-min window to reach bike
  const tripCountdown = useCountdown(req.tripStartedAt || req.startedAt, (req.estimatedDuration || req.hours || req.duration || 0) * 60); // full trip duration
  const [photoPhase, setPhotoPhase] = useState(null);
  const [requestingTime, setRequestingTime] = useState(false);

  const bikeStatus = req.bikeStatus || 'accepted';

  const locationLines = req.exactLocation
    ? [req.exactLocation.address, `${req.exactLocation.lat}°N, ${req.exactLocation.lng}°E`]
    : [req.location || req.pickupLocation || 'Location pending'];

  const statusMeta = {
    accepted: { icon: <CheckCircle2 size={18} color="#3B82F6" />, label: 'ACCEPTED', color: '#3B82F6' },
    in_use: { icon: <Bike size={18} color="var(--primary)" />, label: 'ACTIVE RIDE', color: 'var(--primary)' },
    returning: { icon: <DollarSign size={18} color="#F59E0B" />, label: 'RETURNING', color: '#F59E0B' },
  }[bikeStatus] || { icon: null, label: bikeStatus.toUpperCase(), color: 'var(--text-muted)' };

  // Build chat URL with owner context
  const ownerChatUrl = `/chat?name=${encodeURIComponent(req.ownerName || 'Owner')}&context=${encodeURIComponent((req.vehicleName || 'Bike') + ' booking')}&avatar=${encodeURIComponent(req.ownerAvatar || '')}`;

  return (
    <>
      {photoPhase && (
        <TripPhotoCapture
          phase={photoPhase}
          onCapture={(dataUrl) => {
            if (photoPhase === 'before') submitBeforePhoto(req.requestId || req.id, dataUrl);
            else submitAfterPhoto(req.requestId || req.id, dataUrl);
            toast.success(photoPhase === 'before' ? 'Trip started' : 'After photo saved', photoPhase === 'before' ? 'Ride is now active.' : 'Confirm payment to complete.');
            setPhotoPhase(null);
          }}
          onCancel={() => setPhotoPhase(null)}
        />
      )}

      <div className="accepted-bike-card" style={{ borderColor: statusMeta.color }}>
        {/* Image header */}
        <div className="accepted-bike-card__image-wrapper">
          <img src={req.vehicleImage} alt={req.vehicleName} className="accepted-bike-card__image" />
          <div className="accepted-bike-card__image-gradient" />
          <div className="accepted-bike-card__image-meta">
            <span className="accepted-bike-card__status-label">
              {statusMeta.icon} {statusMeta.label}
            </span>
            <h4 className="accepted-bike-card__vehicle-name">{req.vehicleName}</h4>
          </div>
        </div>

        <div className="accepted-bike-card__body">

          {/* Location revealed */}
          <div className="accepted-bike-card__location">
            <div className="accepted-bike-card__location-header">
              <MapPin size={12} /> EXACT PICKUP LOCATION
            </div>
            {locationLines.map((line, i) => (
              <div key={i} className={i === 0 ? 'accepted-bike-card__location-line--primary' : 'accepted-bike-card__location-line--secondary'}>{line}</div>
            ))}
          </div>

          {/* Arrival countdown — shown while bikeStatus is 'accepted' or 'at_garage' (not yet picked up) */}
          {(bikeStatus === 'accepted' || bikeStatus === 'at_garage') && arrivalCountdown && !arrivalCountdown.expired && (
            <div style={{
              background: arrivalCountdown.secondsLeft < 300 ? '#FEE2E2' : '#FEF3C7',
              borderRadius: 12, padding: '12px 14px', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <Clock size={22} color={arrivalCountdown.secondsLeft < 300 ? 'var(--error)' : '#92400E'} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: arrivalCountdown.secondsLeft < 300 ? 'var(--error)' : '#92400E', marginBottom: 2 }}>
                  TIME TO ARRIVE AT BIKE
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: arrivalCountdown.secondsLeft < 300 ? 'var(--error)' : '#92400E', fontVariantNumeric: 'tabular-nums' }}>
                  {arrivalCountdown.label}
                </div>
              </div>
              <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: arrivalCountdown.secondsLeft < 300 ? 'var(--error)' : '#92400E', fontWeight: 600 }}>
                Reach the bike within 20 minutes or you'll have to rebook.
              </div>
            </div>
          )}

          {(bikeStatus === 'accepted' || bikeStatus === 'at_garage') && arrivalCountdown?.expired && (
            <div style={{ background: '#FEE2E2', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} color="var(--error)" />
              <div style={{ fontWeight: 700, color: 'var(--error)', fontSize: 14 }}>Time expired. Please rebook.</div>
            </div>
          )}

          {/* Trip duration countdown — shown while actively riding */}
          {bikeStatus === 'in_use' && tripCountdown && (
            <div style={{
              borderRadius: 12, padding: '16px 14px', marginBottom: 12,
              background: tripCountdown.expired ? '#FEE2E2' : tripCountdown.secondsLeft < 1800 ? '#FEF3C7' : '#D1FAE5',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: tripCountdown.secondsLeft < 1800 ? 14 : 0 }}>
                <Timer size={26} color={tripCountdown.expired ? 'var(--error)' : tripCountdown.secondsLeft < 1800 ? '#92400E' : '#065F46'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: tripCountdown.expired ? 'var(--error)' : tripCountdown.secondsLeft < 1800 ? '#92400E' : '#065F46', marginBottom: 2 }}>
                    {tripCountdown.expired ? '⏰ TIME UP — RETURN NOW' : tripCountdown.secondsLeft < 1800 ? '⚠️ UNDER 30 MINS LEFT' : 'RIDE TIME REMAINING'}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: tripCountdown.expired ? 'var(--error)' : tripCountdown.secondsLeft < 1800 ? '#92400E' : '#065F46', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {tripCountdown.label}
                  </div>
                </div>
                {!tripCountdown.expired && (
                  <div style={{ textAlign: 'right', fontSize: 12, color: tripCountdown.secondsLeft < 1800 ? '#92400E' : '#047857', fontWeight: 600 }}>
                    {req.estimatedDuration}h booked
                    {req.timeExtended && <div style={{ color: 'var(--primary)', fontWeight: 700 }}>+extended ✓</div>}
                  </div>
                )}
              </div>

              {/* Add Time Button */}
              {!tripCountdown.expired && !req.timeExtended && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', borderColor: '#F59E0B', color: '#B45309', boxShadow: 'none' }}
                  disabled={requestingTime}
                  onClick={() => {
                    setRequestingTime(true);
                    const result = requestMoreTime(req.requestId || req.id, 1);
                    setTimeout(() => {
                      setRequestingTime(false);
                      if (result.granted) {
                        toast.success('Time extended! +1 hour', `New fare: ৳${result.newFare}. Adjusted automatically.`);
                      } else {
                        toast.error('Extension denied', result.reason || 'Vehicle is needed after your slot.');
                      }
                    }, 600);
                  }}
                >
                  {requestingTime ? 'Requesting…' : '⏱ Request 1 More Hour'}
                </button>
              )}
              {req.timeExtended && (
                <div style={{ marginTop: 10, background: 'var(--primary-light)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>
                  ✓ 1 hour extension granted — updated fare: ৳{req.totalFare}
                </div>
              )}
            </div>
          )}

          {/* Estimated Fare Block (Moved up) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, marginBottom: 16 }}>
            <span className="text-muted">{bikeStatus === 'in_use' || bikeStatus === 'returning' ? 'Current fare:' : 'Estimated fare:'}</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 18 }}>৳{req.totalFare}</span>
          </div>

          {/* Message Owner button — visible in all active states */}
          <button
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginBottom: 12 }}
            onClick={() => navigate(ownerChatUrl)}
          >
            <MessageCircle size={14} /> Message Owner
          </button>

          {/* Before photo button — only when accepted and not yet expired */}
          {(bikeStatus === 'accepted' || bikeStatus === 'at_garage') && arrivalCountdown && !arrivalCountdown.expired && (
            <>
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => setPhotoPhase('before')}>
                <Camera size={17} /> I'm Here — Take Before Photo
              </button>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ width: '100%', marginBottom: 12, color: 'var(--error)', borderColor: 'var(--error)' }} 
                onClick={() => {
                  const reqId = req.requestId || req.id;
                  cancelBookingRequest(reqId);
                  toast.info('Booking Cancelled', 'Your request has been cancelled.');
                }}
              >
                Cancel Booking
              </button>
            </>
          )}

          {/* In-use: show after-photo return button */}
          {bikeStatus === 'in_use' && (
            <>
              <button className="btn btn-primary" style={{ width: '100%', background: '#F59E0B', boxShadow: 'none', marginBottom: 12 }} onClick={() => setPhotoPhase('after')}>
                <Camera size={17} /> Return Bike — Take After Photo
              </button>
            </>
          )}

          {bikeStatus === 'returning' && (
            <>
              <div style={{ background: '#FEF3C7', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <DollarSign size={15} /> After photo submitted
                </div>
                <div style={{ fontSize: 13, color: '#92400E' }}>Please pay to complete the trip.</div>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px', background: 'var(--bg-color)', borderRadius: 12, marginBottom: 12
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL FARE</div>
                  <div style={{ fontWeight: 900, fontSize: 26, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>৳{req.totalFare}</div>
                </div>
                <DollarSign size={26} color="var(--primary)" />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { completeTrip(req.requestId || req.id); toast.success('Trip completed', 'Payment confirmed. Please rate the owner.'); }}>
                <CheckCircle2 size={17} /> Confirm Payment & Complete Trip
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}


function PendingBikeCard({ req, onMessage, onSimulateAccept, onCancel }) {
  return (
    <div style={{
      background: 'white', border: '1.5px solid #FDE68A',
      borderRadius: 14, padding: '16px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <img src={req.vehicleImage} alt={req.vehicleName} style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <b style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.vehicleName}</b>
            <span className="badge badge-yellow">Pending</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.location}</div>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>৳{req.totalFare}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, padding: '10px 12px', background: '#FEF9EC', borderRadius: 8 }}>
        ⏳ Awaiting owner approval. Once accepted, the exact bike location will be revealed and you'll have 20 minutes to arrive.
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onMessage}>
          <MessageCircle size={14} /> Chat with Owner
        </button>
        <button 
          className="btn btn-outline btn-sm" 
          style={{ flex: 1, color: 'var(--error)', borderColor: 'var(--error)' }} 
          onClick={() => {
            onCancel(req.id);
          }}
        >
          Cancel Request
        </button>
      </div>
      {onSimulateAccept && (
        <button
          className="btn btn-primary btn-sm"
          style={{ width: '100%', marginTop: 8, background: '#8B5CF6', borderColor: '#8B5CF6' }}
          onClick={onSimulateAccept}
        >
          ✓ Simulate: Owner Accepts
        </button>
      )}
    </div>
  );
}

function PassengerRequestCard({ ride, hasActiveBike, onAccept, onCounter }) {
  const [counter, setCounter] = useState('');
  const showCounter = ride.status === 'counter_offered';
  const counterFare = showCounter ? ride.counterOffer?.fare : null;

  return (
    <div style={{ background: 'white', border: '1.5px solid var(--border-color)', borderRadius: 16, padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={ride.passengerAvatar} alt={ride.passengerName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{ride.passengerName}</div>
            <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} fill="#F59E0B" /> {ride.passengerRating} · {ride.time}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>৳{ride.estimatedFare}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>~{ride.estimatedTime}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px', background: 'var(--bg-color)', borderRadius: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <MapPin size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 1 }}>PICKUP</div>
            <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{ride.pickup}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Navigation size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 1 }}>DROPOFF</div>
            <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{ride.dropoff}</div>
          </div>
        </div>
      </div>

      {showCounter && counterFare && (
        <div style={{ background: '#FEF3C7', borderRadius: 10, padding: '10px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={15} color="#92400E" />
          <span style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>
            {ride.counterOffer.renterName} countered at ৳{counterFare}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!hasActiveBike} onClick={onAccept}>
          <CheckCircle2 size={15} /> Accept ৳{showCounter && counterFare ? counterFare : ride.estimatedFare}
        </button>
        <div style={{ flex: 1 }}>
          <input
            type="number"
            className="input"
            placeholder="Counter ৳"
            disabled={!hasActiveBike}
            value={counter}
            onChange={e => setCounter(e.target.value)}
            style={{ fontSize: 14 }}
          />
          <button className="btn btn-outline" style={{ width: '100%', marginTop: 6, minHeight: 34 }} disabled={!hasActiveBike || !counter} onClick={() => onCounter(counter)}>
            Send offer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RenterRequests() {
  const { renterBookingRequests, data, activeRentals, acceptPassengerRide, makeCounterOffer, acceptBookingRequest } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('sent');

  // 'accepted' = owner accepted, 'active' = legacy alias for accepted, 'in_use'/'returning' tracked via bikeStatus
  const acceptedReqs = renterBookingRequests.filter(r =>
    r.status === 'accepted' || r.bikeStatus === 'in_use' || r.bikeStatus === 'returning'
  );
  const pendingReqs = renterBookingRequests.filter(r =>
    r.status === 'pending' || r.status === 'active'
  ).filter(r => r.bikeStatus !== 'in_use' && r.bikeStatus !== 'returning');
  const pastReqs = renterBookingRequests.filter(r => r.status === 'completed');

  const hasActiveBike = activeRentals.length > 0 || renterBookingRequests.some(r => r.bikeStatus === 'in_use' || r.bikeStatus === 'returning');
  const passReqs = data.availableRideRequests;

  const sentCount = renterBookingRequests.length;
  const receivedCount = passReqs.length;
  const pastSent = pastReqs.map(r => ({ ...r, type: 'sent', displayStatus: 'accepted' }));
  const pastReceived = (data.pastTrips || []).map(t => ({ ...t, type: 'received', displayStatus: 'accepted' }));
  const allPastRequests = [...pastSent, ...pastReceived];

  const handleAcceptPassenger = (rideId) => {
    acceptPassengerRide(rideId);
    toast.success('Ride accepted', 'Head to the pickup point.');
    navigate('/renter/dashboard');
  };

  const handleCounterOffer = (rideId, amt) => {
    if (!amt || isNaN(amt)) { toast.error('Invalid amount', 'Enter a valid fare first.'); return; }
    makeCounterOffer(rideId, Number(amt), 'Nazia Putul');
    toast.info('Counter offer sent', `৳${amt} offer sent to the passenger.`);
  };

  const tabs = [
    { id: 'sent', label: 'Sent', count: sentCount },
    { id: 'passengers', label: 'Passenger Requests', count: receivedCount },
    { id: 'past', label: 'Past', count: allPastRequests.length },
  ];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <PageHeader title="Requests" subtitle="Manage bookings and passenger requests" />

      <div className="tabs" style={{ marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count > 0 && (
              <span style={{
                marginLeft: 6, background: tab === t.id ? 'var(--primary)' : 'var(--border-color)',
                color: tab === t.id ? 'white' : 'var(--text-muted)',
                borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 700
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'sent' && (
        <div>
          {renterBookingRequests.length === 0 ? (
            <div className="empty-state">
              <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bike size={28} color="var(--primary)" />
              </div>
              <h3>No booking requests yet</h3>
              <p>When you book a bike, your requests will appear here.</p>
              <button className="btn btn-primary" style={{ width: 'auto', marginTop: 16 }} onClick={() => navigate('/renter/browse')}>
                Browse Bikes
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {acceptedReqs.length > 0 && (
                <div>
                  <div className="micro-label" style={{ marginBottom: 10 }}>Active & accepted bookings</div>
                  {acceptedReqs.map(req => (
                    <AcceptedBikeCard key={req.id} req={req} />
                  ))}
                </div>
              )}

              {pendingReqs.length > 0 && (
                <div>
                  <div className="micro-label" style={{ marginBottom: 10 }}>Pending approval</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pendingReqs.map(req => (
                      <PendingBikeCard
                        key={req.id}
                        req={req}
                        onMessage={() => navigate('/chat')}
                        onCancel={() => {
                          cancelBookingRequest(req.requestId || req.id);
                          toast.info('Request Cancelled', 'Your pending request has been cancelled.');
                        }}
                        onSimulateAccept={() => {
                          // Demo: simulate the owner accepting this request
                          acceptBookingRequest(req.requestId || req.id);
                          toast.success('Owner accepted!', 'Head to the bike — you have 20 minutes to arrive. Take a before photo to start the ride.');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'passengers' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ marginBottom: 0, fontSize: 18 }}>Received requests</h3>
            {!hasActiveBike && (
              <span className="badge badge-yellow">Book a bike first</span>
            )}
          </div>

          {passReqs.length === 0 ? (
            <div className="empty-state">
              <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={28} color="var(--primary)" />
              </div>
              <h3>No passenger requests</h3>
              <p>When passengers post ride requests, they'll appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {passReqs.map(ride => (
                <PassengerRequestCard
                  key={ride.id}
                  ride={ride}
                  hasActiveBike={hasActiveBike}
                  onAccept={() => handleAcceptPassenger(ride.id)}
                  onCounter={amt => handleCounterOffer(ride.id, amt)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'past' && (
        <div>
          {allPastRequests.length === 0 ? (
            <div className="empty-state">
              <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={28} color="var(--primary)" />
              </div>
              <h3>No past requests</h3>
              <p>Your history of bookings and rides will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {allPastRequests.map((req, idx) => (
                <div key={req.id || idx} style={{
                  background: 'white', border: '1px solid var(--border-color)',
                  borderRadius: 14, padding: '14px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    {req.type === 'sent' ? (
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                        <Bike size={19} />
                      </div>
                    ) : (
                      <img src={req.passengerAvatar || req.ownerAvatar} alt={req.owner} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.type === 'sent' ? `Sent: ${req.vehicleName || req.vehicle}` : `Ride: ${req.owner}`}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {req.type === 'sent'
                          ? `৳${req.totalFare}`
                          : `${req.pickup || req.date} → ${req.dropoff || ''} · ৳${req.totalFare || req.estimatedFare}`}
                      </div>
                    </div>
                  </div>
                  <span className={req.displayStatus === 'accepted' ? 'badge badge-green' : 'badge badge-red'} style={{ flexShrink: 0 }}>
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
