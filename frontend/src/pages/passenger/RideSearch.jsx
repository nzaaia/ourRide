import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Star, CheckCircle, ChevronLeft, DollarSign, Bike, Clock, MessageCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

export default function RideSearch() {
  const { data, role, acceptPassengerRide, makeCounterOffer, activeRentals, activePassengerRides, isAuthenticated, login, submitRideRequest, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [searched, setSearched] = useState(false);
  const [myRideId, setMyRideId] = useState(null);
  const [counterOfferAmounts, setCounterOfferAmounts] = useState({});

  // ============= RENTER VIEW (looking to pick up passengers) =============
  if (role === 'renter') {
    if (activeRentals.length === 0 && !data.listings.some(l => l.ownerId === user?.id && l.status === 'active')) {
      return (
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 48 }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 18, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={32} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: 8 }}>Book a bike first</h2>
          <p className="text-muted" style={{ marginBottom: 28 }}>You need an active rented bike before you can pick up passengers.</p>
          <button className="btn btn-primary btn-lg" style={{ width: 'auto' }} onClick={() => navigate('/renter/browse')}>
            Browse Bikes
          </button>
        </div>
      );
    }

    const handleAccept = (rideId) => {
      acceptPassengerRide(rideId);
      toast.success('Ride accepted', 'Head to the pickup point.');
      navigate('/renter/dashboard');
    };

    const handleCounterOffer = (rideId) => {
      const amount = counterOfferAmounts[rideId];
      if (!amount || isNaN(amount)) { toast.error('Invalid fare', 'Enter a valid amount first.'); return; }
      makeCounterOffer(rideId, Number(amount), user.name);
      toast.info('Counter offer sent', `৳${amount} offer sent to the passenger.`);
    };

    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <PageHeader title="Passenger Requests" subtitle="Accept at the offered price or make a counter offer" />

        {data.availableRideRequests.length === 0 ? (
          <div className="empty-state">
            <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={28} color="var(--primary)" />
            </div>
            <h3>No passengers right now</h3>
            <p>Check back soon — ride requests appear here in real time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.availableRideRequests.map(ride => (
              <div key={ride.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={ride.passengerAvatar} alt={ride.passengerName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div className="font-bold" style={{ fontSize: 15 }}>{ride.passengerName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
                        <Star size={11} fill="#F59E0B" /> {ride.passengerRating} · {ride.time}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>৳{ride.estimatedFare}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>passenger's offer</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px', background: 'var(--bg-color)', borderRadius: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <MapPin size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 1 }}>PICKUP</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{ride.pickup}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Navigation size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 1 }}>DROPOFF</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{ride.dropoff}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <button className="btn btn-primary" style={{ flex: 1.4 }} onClick={() => handleAccept(ride.id)}>
                    <CheckCircle size={16} /> Accept ৳{ride.estimatedFare}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Counter offer (৳)</div>
                    <input
                      type="number"
                      className="input"
                      placeholder={`e.g. ${ride.estimatedFare - 30}`}
                      value={counterOfferAmounts[ride.id] || ''}
                      onChange={e => setCounterOfferAmounts(prev => ({ ...prev, [ride.id]: e.target.value }))}
                      style={{ fontSize: 14 }}
                    />
                    <button
                      className="btn btn-outline"
                      style={{ width: '100%', marginTop: 6, minHeight: 34 }}
                      onClick={() => handleCounterOffer(ride.id)}
                    >
                      Send offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============= PASSENGER / GUEST VIEW =============
  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    if (!isAuthenticated) login('passenger');
    const id = submitRideRequest(pickup, dropoff, 200);
    setMyRideId(id);
    setSearched(true);
    toast.success('Ride request posted', 'Riders near you can now accept or counter.');
  };

  const myRequest = data.availableRideRequests.find(r => r.id === myRideId);
  // Check if ride was accepted (moved to activePassengerRides)
  const acceptedRide = activePassengerRides.find(r => r.id === myRideId);

  // === RIDE ACCEPTED STATUS SCREEN ===
  if (acceptedRide) {
    const chatUrl = acceptedRide.renterName
      ? `/chat?name=${encodeURIComponent(acceptedRide.renterName)}&context=${encodeURIComponent('Your ride to ' + (acceptedRide.dropoff || 'destination'))}&avatar=${encodeURIComponent(acceptedRide.renterAvatar || '')}`
      : '/chat';
    return (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <PageHeader title="Ride Confirmed!" subtitle="Your rider is on the way" />

        {/* Status Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--forest) 0%, var(--primary) 100%)',
          borderRadius: 20, padding: '24px 20px', marginBottom: 16, color: 'white', textAlign: 'center'
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏍️</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.8, marginBottom: 6 }}>STATUS</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Rider is heading to you</div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>Stay at your pickup location and watch for your rider</div>
        </div>

        {/* Rider info */}
        <div className="card" style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            {acceptedRide.renterAvatar ? (
              <img src={acceptedRide.renterAvatar} alt={acceptedRide.renterName} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>🏍️</div>
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{acceptedRide.renterName || 'Your Rider'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your assigned rider</div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: 'auto', marginLeft: 'auto' }}
              onClick={() => navigate(chatUrl)}
            >
              <MessageCircle size={16} /> Message
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px', background: 'var(--bg-color)', borderRadius: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <MapPin size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 1 }}>PICKUP</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{acceptedRide.pickup}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Navigation size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 1 }}>DROPOFF</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{acceptedRide.dropoff}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Agreed fare</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>৳{acceptedRide.estimatedFare}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px', background: 'var(--primary-light)', borderRadius: 12 }}>
          <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: '#065F46', marginBottom: 0 }}>
            Use the Message button to coordinate your exact pickup spot. Your ride is confirmed — no need to rebook.
          </p>
        </div>
      </div>
    );
  }

  if (searched && myRequest) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <PageHeader
          title="Ride Request Sent"
          back={() => { setSearched(false); setMyRideId(null); }}
        />

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Clock size={16} color="var(--info)" />
            <span className="badge badge-blue">Waiting for a rider to accept</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="text-muted text-sm" style={{ marginBottom: 2 }}>FROM</div>
              <div className="font-bold">{pickup}</div>
            </div>
            <div>
              <div className="text-muted text-sm" style={{ marginBottom: 2 }}>TO</div>
              <div className="font-bold">{dropoff}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted">Your offered fare</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>৳200</span>
          </div>
        </div>

        {myRequest.counterOffer && (
          <div className="card" style={{ border: '2px solid var(--warning)', padding: 20, marginBottom: 16 }}>
            <div className="badge badge-yellow" style={{ marginBottom: 12 }}>Counter offer received</div>
            <div className="font-semibold" style={{ marginBottom: 8 }}>{myRequest.counterOffer.renterName} offers:</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--warning)', marginBottom: 16 }}>৳{myRequest.counterOffer.fare}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { acceptPassengerRide(myRideId); toast.success('Offer accepted', 'Enjoy your ride!'); navigate('/passenger/search'); }}>
                Accept Offer
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMyRideId(null)}>
                Decline
              </button>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-color)', border: 'none' }}>
          <p className="text-muted text-sm" style={{ marginBottom: 0 }}>
            Your request is now visible to renters with active bikes. They can accept your price or make a counter offer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Where to?" subtitle="Enter pickup and drop-off — we'll connect you with a rider" />

      <div className="card" style={{ padding: 20 }}>
        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: 16 }}>
            <label className="font-semibold text-sm" style={{ display: 'block', marginBottom: 8 }}>Pickup Location</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 12, padding: '12px 14px', gap: 10 }}>
              <MapPin size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                required
                type="text"
                placeholder="Where are you right now?"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 15 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="font-semibold text-sm" style={{ display: 'block', marginBottom: 8 }}>Drop-off Location</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 12, padding: '12px 14px', gap: 10 }}>
              <Navigation size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input
                required
                type="text"
                placeholder="Where do you want to go?"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 15 }}
              />
            </div>
          </div>

          <div style={{ background: 'var(--bg-color)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted font-semibold">Estimated fare</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>৳150 – ৳250</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <DollarSign size={17} /> Post Ride Request
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '16px 4px' }}>
        <MessageCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p className="text-muted text-sm" style={{ marginBottom: 0 }}>
          After you post, renters with active bikes will see your request. They can accept at your price or make a counter offer.
        </p>
      </div>
    </div>
  );
}
