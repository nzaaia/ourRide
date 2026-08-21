import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Star, CheckCircle, ChevronLeft, DollarSign, Bike, Clock, MessageCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import './RideSearch.css';

export default function RideSearch() {
  const {
    data, role, acceptPassengerRide, makeCounterOffer,
    activeRentals, activePassengerRides, isAuthenticated,
    login, submitRideRequest, user, renterBookingRequests,
    cancelRideRequest
  } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [fare, setFare] = useState('');
  const [counterOfferAmounts, setCounterOfferAmounts] = useState({});

  const isBusyWithPassenger = activePassengerRides?.some(r => r.renterId === user?.id && r.status === 'active');

  // ============= RENTER VIEW (looking to pick up passengers) =============
  if (role === 'renter') {
    const hasActiveBike = renterBookingRequests.some(r => r.status === 'accepted' || r.bikeStatus === 'in_use' || r.bikeStatus === 'returning') || data.listings.some(l => l.ownerId === user?.id && l.status === 'active');
    if (!hasActiveBike) {
      return (
        <div className="ride-search__no-bike">
          <div className="ride-search__no-bike-icon">
            <Bike size={32} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: 8 }}>Book a bike first</h2>
          <p className="text-muted ride-search__no-bike-text">You need an active rented bike before you can pick up passengers.</p>
          <button className="btn btn-primary btn-lg ride-search__no-bike-btn" onClick={() => navigate('/renter/browse')}>
            Browse Bikes
          </button>
        </div>
      );
    }

    const handleAccept = (rideId) => {
      if (isBusyWithPassenger) {
        toast.error('Ride in progress', 'You must complete your current passenger ride first.');
        return;
      }
      acceptPassengerRide(rideId);
      toast.success('Ride accepted', 'Head to the pickup point.');
      navigate('/renter/dashboard');
    };

    const handleCounterOffer = (rideId) => {
      if (isBusyWithPassenger) {
        toast.error('Ride in progress', 'You must complete your current passenger ride first.');
        return;
      }
      const amount = counterOfferAmounts[rideId];
      if (!amount || isNaN(amount)) { toast.error('Invalid fare', 'Enter a valid amount first.'); return; }
      makeCounterOffer(rideId, Number(amount), user.name);
      toast.info('Counter offer sent', `৳${amount} offer sent to the passenger.`);
    };

    return (
      <div className="ride-search__renter-view">
        <PageHeader title="Passenger Requests" subtitle="Accept at the offered price or make a counter offer" />

        {data.availableRideRequests.length === 0 ? (
          <div className="empty-state">
            <div className="ride-search__empty-icon">
              <Navigation size={28} color="var(--primary)" />
            </div>
            <h3>No passengers right now</h3>
            <p>Check back soon — ride requests appear here in real time.</p>
          </div>
        ) : (
          <div className="ride-search__request-list">
            {data.availableRideRequests.map(ride => (
              <div key={ride.id} className="card ride-search__request-card">
                <div className="ride-search__request-header">
                  <div className="ride-search__passenger-info">
                    <img src={ride.passengerAvatar} alt={ride.passengerName} className="ride-search__passenger-avatar" />
                    <div>
                      <div className="font-bold ride-search__passenger-name">{ride.passengerName}</div>
                      <div className="ride-search__passenger-rating">
                        <Star size={11} fill="#F59E0B" /> {ride.passengerRating} · {ride.time}
                      </div>
                    </div>
                  </div>
                  <div className="ride-search__fare-block">
                    <div className="ride-search__fare-amount">৳{ride.estimatedFare}</div>
                    <div className="ride-search__fare-label">passenger's offer</div>
                  </div>
                </div>

                <div className="ride-search__route-grid">
                  <div className="ride-search__route-cell">
                    <MapPin size={15} color="var(--text-muted)" className="ride-search__route-icon" />
                    <div style={{ minWidth: 0 }}>
                      <div className="ride-search__route-label">PICKUP</div>
                      <div className="ride-search__route-value">{ride.pickup}</div>
                    </div>
                  </div>
                  <div className="ride-search__route-cell">
                    <Navigation size={15} color="var(--primary)" className="ride-search__route-icon" />
                    <div style={{ minWidth: 0 }}>
                      <div className="ride-search__route-label">DROPOFF</div>
                      <div className="ride-search__route-value">{ride.dropoff}</div>
                    </div>
                  </div>
                </div>

                <div className="ride-search__action-row">
                  <button className="btn btn-primary ride-search__accept-btn" onClick={() => handleAccept(ride.id)}>
                    <CheckCircle size={16} /> Accept ৳{ride.estimatedFare}
                  </button>
                  <div className="ride-search__counter-block">
                    <div className="ride-search__counter-label">Counter offer (৳)</div>
                    <input
                      type="number"
                      className="input ride-search__counter-input"
                      placeholder={`e.g. ${ride.estimatedFare - 30}`}
                      value={counterOfferAmounts[ride.id] || ''}
                      onChange={e => setCounterOfferAmounts(prev => ({ ...prev, [ride.id]: e.target.value }))}
                    />
                    <button
                      className="btn btn-outline ride-search__counter-btn"
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

  // ============= PASSENGER VIEW =============
  const existingRequest = data.availableRideRequests.find(r => r.passengerId === user?.id);
  const activeRide = data.myActiveRideRequest || activePassengerRides?.find(r => r.passengerId === user?.id);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff || !fare) {
      toast.error('Missing fields', 'Please provide pickup, dropoff, and your offered fare.');
      return;
    }
    if (!isAuthenticated) login('passenger');

    if (existingRequest || activeRide) {
      toast.error('Request in progress', 'You already have an active ride or request.');
      return;
    }

    submitRideRequest(pickup, dropoff, Number(fare));
    toast.success('Ride request posted', 'Riders near you can now accept or counter.');
  };

  // === RIDE ACCEPTED STATUS SCREEN ===
  if (activeRide) {
    const chatUrl = `/chat/${activeRide.id}?name=${encodeURIComponent(activeRide.renterName || 'Driver')}&context=${encodeURIComponent('Your ride to ' + (activeRide.dropoff || 'destination'))}&avatar=${encodeURIComponent(activeRide.renterAvatar || '')}`;
    return (
      <div className="ride-search__active-view">
        <PageHeader title="Ride Confirmed!" subtitle="Your rider is on the way" />

        {/* Status Banner */}
        <div className="ride-search__status-banner">
          <div className="ride-search__status-emoji">🏍️</div>
          <div className="ride-search__status-tag">STATUS</div>
          <div className="ride-search__status-title">Rider is heading to you</div>
          <div className="ride-search__status-hint">Stay at your pickup location and watch for your rider</div>
        </div>

        {/* Rider info */}
        <div className="card ride-search__rider-card">
          <div className="ride-search__rider-header">
            {activeRide.renterAvatar ? (
              <img src={activeRide.renterAvatar} alt={activeRide.renterName} className="ride-search__rider-avatar" />
            ) : (
              <div className="ride-search__rider-avatar-placeholder">🏍️</div>
            )}
            <div>
              <div className="ride-search__rider-name">{activeRide.renterName || 'Your Rider'}</div>
              <div className="ride-search__rider-subtitle">Your assigned rider</div>
            </div>
            <button
              className="btn btn-primary ride-search__msg-btn"
              onClick={() => navigate(chatUrl)}
            >
              <MessageCircle size={16} /> Message
            </button>
          </div>

          <div className="ride-search__route-grid" style={{ marginBottom: 14 }}>
            <div className="ride-search__route-cell">
              <MapPin size={15} color="var(--text-muted)" className="ride-search__route-icon" />
              <div style={{ minWidth: 0 }}>
                <div className="ride-search__route-label">PICKUP</div>
                <div className="font-bold" style={{ fontSize: 13 }}>{activeRide.pickup}</div>
              </div>
            </div>
            <div className="ride-search__route-cell">
              <Navigation size={15} color="var(--primary)" className="ride-search__route-icon" />
              <div style={{ minWidth: 0 }}>
                <div className="ride-search__route-label">DROPOFF</div>
                <div className="font-bold" style={{ fontSize: 13 }}>{activeRide.dropoff}</div>
              </div>
            </div>
          </div>

          <div className="ride-search__fare-row">
            <span className="ride-search__fare-row-label">Agreed fare</span>
            <span className="ride-search__fare-row-value">৳{activeRide.estimatedFare}</span>
          </div>

          <div className="ride-search__cancel-section">
            <button
              className="btn btn-outline ride-search__cancel-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this active ride?")) {
                  cancelRideRequest(activeRide.id);
                  toast.info('Ride cancelled', 'Your ride has been cancelled.');
                }
              }}
            >
              Cancel Ride
            </button>
          </div>
        </div>

        <div className="ride-search__info-note">
          <CheckCircle size={16} color="var(--primary)" className="ride-search__info-note-icon" />
          <p className="ride-search__info-note-text">
            Use the Message button to coordinate your exact pickup spot. Your ride is confirmed — no need to rebook.
          </p>
        </div>
      </div>
    );
  }

  const myRequest = existingRequest;

  if (myRequest) {
    return (
      <div className="ride-search__pending-view">
        <div className="ride-search__pending-header">
          <button onClick={() => {
            if (window.confirm("Cancel this ride request?")) {
              cancelRideRequest(myRequest.id);
              toast.info('Request cancelled', 'Your ride request has been removed.');
            }
          }} className="btn btn-outline btn-sm ride-search__pending-back-btn">
            <ChevronLeft size={18} /> Cancel Request
          </button>
          <h2 className="ride-search__pending-title">Ride Request Sent</h2>
        </div>

        <div className="card ride-search__pending-card">
          <div className="ride-search__pending-status-row">
            <Clock size={16} color="var(--info)" />
            <span className="badge badge-blue">Waiting for a rider to accept</span>
          </div>
          <div className="ride-search__pending-grid">
            <div>
              <div className="text-muted text-sm ride-search__pending-field-label">FROM</div>
              <div className="font-bold">{myRequest.pickup}</div>
            </div>
            <div>
              <div className="text-muted text-sm ride-search__pending-field-label">TO</div>
              <div className="font-bold">{myRequest.dropoff}</div>
            </div>
          </div>
          <div className="ride-search__pending-fare-row">
            <span className="text-muted">Your offered fare</span>
            <span className="ride-search__pending-fare-value">৳{myRequest.estimatedFare}</span>
          </div>
        </div>

        {myRequest.counterOffer && (
          <div className="card ride-search__counter-offer-card">
            <div className="badge badge-yellow ride-search__counter-badge">Counter offer received</div>
            <div className="font-semibold ride-search__counter-name">{myRequest.counterOffer.renterName} offers:</div>
            <div className="ride-search__counter-fare">৳{myRequest.counterOffer.fare}</div>
            <div className="ride-search__counter-actions">
              <button className="btn btn-primary ride-search__counter-accept-btn" onClick={() => { acceptPassengerRide(myRequest.id); toast.success('Offer accepted', 'Enjoy your ride!'); }}>
                Accept Offer
              </button>
              <button className="btn btn-outline ride-search__counter-decline-btn" onClick={() => cancelRideRequest(myRequest.id)}>
                Decline &amp; Cancel
              </button>
            </div>
          </div>
        )}

        <div className="card ride-search__pending-info">
          <p className="text-muted text-sm ride-search__pending-info-text">
            Your request is now visible to renters with active bikes. They can accept your price or make a counter offer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-search__form-view">
      <PageHeader title="Where to?" subtitle="Enter pickup and drop-off — we'll connect you with a rider" />

      <div className="card ride-search__form-card">
        <form onSubmit={handleSearch}>
          <div className="ride-search__field">
            <label className="font-semibold text-sm ride-search__field-label">Pickup Location</label>
            <div className="ride-search__input-row">
              <MapPin size={18} color="var(--text-muted)" className="ride-search__input-icon" />
              <input
                required
                type="text"
                placeholder="Where are you right now?"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                className="ride-search__bare-input"
              />
            </div>
          </div>

          <div className="ride-search__field">
            <label className="font-semibold text-sm ride-search__field-label">Drop-off Location</label>
            <div className="ride-search__input-row">
              <Navigation size={18} color="var(--primary)" className="ride-search__input-icon" />
              <input
                required
                type="text"
                placeholder="Where do you want to go?"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                className="ride-search__bare-input"
              />
            </div>
          </div>

          <div className="ride-search__field--last">
            <label className="font-semibold text-sm ride-search__field-label">Your Offered Fare (৳)</label>
            <div className="ride-search__input-row">
              <DollarSign size={18} color="var(--primary)" className="ride-search__input-icon" />
              <input
                required
                type="number"
                min="0"
                placeholder="How much are you willing to pay?"
                value={fare}
                onChange={e => setFare(e.target.value)}
                className="ride-search__bare-input"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg ride-search__submit-btn">
            <DollarSign size={17} /> Post Ride Request
          </button>
        </form>
      </div>

      <div className="ride-search__tip">
        <MessageCircle size={16} color="var(--primary)" className="ride-search__tip-icon" />
        <p className="text-muted text-sm ride-search__tip-text">
          After you post, renters with active bikes will see your request. They can accept at your price or make a counter offer.
        </p>
      </div>
    </div>
  );
}