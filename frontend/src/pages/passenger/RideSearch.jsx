import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Star, CheckCircle, ChevronLeft, DollarSign } from 'lucide-react';

export default function RideSearch() {
  const { data, role, acceptPassengerRide, makeCounterOffer, activeRentals, isAuthenticated, login, submitRideRequest, user } = useAuth();
  const navigate = useNavigate();
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [searched, setSearched] = useState(false);
  const [myRideId, setMyRideId] = useState(null);
  const [counterOfferAmounts, setCounterOfferAmounts] = useState({});

  // ============= RENTER VIEW (looking to pick up passengers) =============
  if (role === 'renter') {
    if (activeRentals.length === 0) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🏍️</div>
          <h2>Book a bike first!</h2>
          <p className="text-muted" style={{ marginBottom: 32 }}>You need an active rented bike before you can pick up passengers.</p>
          <button className="btn btn-primary btn-lg" style={{ width: 'auto' }} onClick={() => navigate('/renter/browse')}>
            Browse Bikes
          </button>
        </div>
      );
    }

    const handleAccept = (rideId) => {
      acceptPassengerRide(rideId);
      navigate('/renter/dashboard');
    };

    const handleCounterOffer = (rideId) => {
      const amount = counterOfferAmounts[rideId];
      if (!amount || isNaN(amount)) return alert('Please enter a valid fare');
      makeCounterOffer(rideId, Number(amount), user.name);
      alert(`Counter offer of ৳${amount} sent! The passenger will see it.`);
    };

    return (
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 8 }}>Available Passenger Requests</h2>
        <p className="text-muted" style={{ marginBottom: 32 }}>Accept at the requested price, or make a counter offer.</p>

        {data.availableRideRequests.length === 0 ? (
          <div className="empty-state">
            <Navigation size={64} />
            <h3>No passengers right now</h3>
            <p>Check back soon — ride requests appear here in real time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {data.availableRideRequests.map(ride => (
              <div key={ride.id} className="card" style={{ padding: '24px 28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start', marginBottom: 20 }}>
                  <div className="flex items-center gap-4">
                    <img src={ride.passengerAvatar} alt={ride.passengerName} className="avatar" style={{ width: 56, height: 56 }} />
                    <div>
                      <div className="font-bold text-lg" style={{ marginBottom: 2 }}>{ride.passengerName}</div>
                      <div className="stars text-sm">★ {ride.passengerRating} rating</div>
                      <div className="text-muted text-sm">{ride.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>৳{ride.estimatedFare}</div>
                    <div className="text-muted text-sm">passenger's offer</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: 20 }}>
                  <div className="flex gap-3">
                    <MapPin size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>PICKUP</div>
                      <div className="font-semibold">{ride.pickup}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Navigation size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="text-xs text-muted font-semibold" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>DROPOFF</div>
                      <div className="font-semibold">{ride.dropoff}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => handleAccept(ride.id)}
                  >
                    <CheckCircle size={18} /> Accept ৳{ride.estimatedFare}
                  </button>

                  <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div className="text-xs text-muted font-semibold" style={{ marginBottom: 4 }}>Counter Offer (৳)</div>
                      <input
                        type="number"
                        className="input"
                        placeholder={`e.g. ${ride.estimatedFare - 30}`}
                        value={counterOfferAmounts[ride.id] || ''}
                        onChange={e => setCounterOfferAmounts(prev => ({ ...prev, [ride.id]: e.target.value }))}
                      />
                    </div>
                    <button
                      className="btn btn-outline"
                      style={{ width: 'auto', marginTop: 18 }}
                      onClick={() => handleCounterOffer(ride.id)}
                    >
                      Send
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
    const id = submitRideRequest(pickup, dropoff, 200);
    setMyRideId(id);
    setSearched(true);
  };

  const myRequest = data.availableRideRequests.find(r => r.id === myRideId);

  if (searched && myRequest) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: 32 }}>
          <button onClick={() => { setSearched(false); setMyRideId(null); }} className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
            <ChevronLeft size={18} /> Back
          </button>
          <h2 style={{ marginBottom: 0 }}>Ride Request Sent</h2>
        </div>

        <div className="card" style={{ padding: '28px 32px', marginBottom: 24 }}>
          <div className="badge badge-blue" style={{ marginBottom: 20, fontSize: 13 }}>⏳ Waiting for a rider to accept...</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div className="text-xs text-muted font-semibold" style={{ marginBottom: 4 }}>FROM</div>
              <div className="font-bold">{pickup}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-xs text-muted font-semibold" style={{ marginBottom: 4 }}>TO</div>
              <div className="font-bold">{dropoff}</div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">Your offered fare</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>৳200</span>
          </div>
        </div>

        {myRequest.counterOffer && (
          <div className="card" style={{ border: '2px solid var(--warning)', padding: '24px 28px', marginBottom: 24 }}>
            <div className="badge badge-yellow" style={{ marginBottom: 16 }}>💬 Counter Offer Received!</div>
            <div className="font-semibold" style={{ marginBottom: 8 }}>{myRequest.counterOffer.renterName} offers:</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--warning)', marginBottom: 20 }}>৳{myRequest.counterOffer.fare}</div>
            <div className="flex gap-3">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { acceptPassengerRide(myRideId); navigate('/passenger/search'); setSearched(false); }}>
                Accept Offer
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMyRideId(null)}>
                Decline
              </button>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '20px 24px', backgroundColor: 'var(--bg-color)', border: 'none' }}>
          <p className="text-muted text-sm" style={{ marginBottom: 0 }}>
            Your request is now visible to renters who have active bikes. They can accept your price or make a counter offer. You'll see it here as soon as a rider responds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>Where do you want to go?</h2>
      <p className="text-muted" style={{ marginBottom: 32 }}>Enter your pickup and drop-off points. We'll connect you with a renter who has a bike.</p>

      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: 20 }}>
            <label className="font-semibold text-sm" style={{ display: 'block', marginBottom: 8 }}>Pickup Location</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 10, padding: '12px 16px', gap: 12, transition: 'border-color 0.2s' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <MapPin size={20} color="var(--text-muted)" style={{ flexShrink: 0 }} />
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

          <div style={{ marginBottom: 32 }}>
            <label className="font-semibold text-sm" style={{ display: 'block', marginBottom: 8 }}>Drop-off Location</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 10, padding: '12px 16px', gap: 12, transition: 'border-color 0.2s' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <Navigation size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
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

          <div style={{ background: 'var(--bg-color)', borderRadius: 10, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted font-semibold">Estimated Fare</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>৳150 – ৳250</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Post Ride Request
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: '20px 24px', marginTop: 16, backgroundColor: 'transparent', border: 'none' }}>
        <p className="text-muted text-sm" style={{ marginBottom: 0 }}>
          💡 After you post, renters who currently have bikes will see your request. They can accept at your price or make a counter offer.
        </p>
      </div>
    </div>
  );
}
