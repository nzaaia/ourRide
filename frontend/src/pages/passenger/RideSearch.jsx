import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Navigation, Star } from 'lucide-react';

export default function RideSearch() {
  const { data } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setResults(data.availableRideRequests);
      setIsSearching(false);
    }, 800);
  };

  const handleRequestRide = (rideId) => {
    alert('Ride requested successfully! The Renter has been notified.');
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-6)' }}>Request a Ride</h2>
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm mb-2">Pickup Location</label>
            <div className="flex items-center p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={20} color="var(--text-muted)" className="mr-3" />
              <input required type="text" placeholder="Where are you?" className="w-full" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }} 
                value={pickup} onChange={e => setPickup(e.target.value)} />
            </div>
          </div>
          
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm mb-2">Dropoff Location</label>
            <div className="flex items-center p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <Navigation size={20} color="var(--primary)" className="mr-3" />
              <input required type="text" placeholder="Where to?" className="w-full" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
                value={dropoff} onChange={e => setDropoff(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '14px 32px' }} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Find Rides'}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Available Rides Nearby</h3>
          <div className="cards-grid">
            {results.map(ride => (
              <div key={ride.id} className="card">
                <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <img src={ride.passengerAvatar} alt={ride.passengerName} className="avatar" style={{ width: '48px', height: '48px' }} />
                    <div>
                      <h4 style={{ margin: 0 }}>{ride.passengerName}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Star size={14} color="#FFD700" fill="#FFD700" /> 4.6
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-primary" style={{ fontSize: '24px' }}>৳{ride.estimatedFare}</div>
                </div>

                <div className="flex-col gap-4 mb-6">
                  <div className="flex gap-3 items-start">
                    <MapPin size={20} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                    <div>
                      <div className="text-sm text-muted">Pickup</div>
                      <div className="font-semibold">{ride.pickup}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Navigation size={20} color="var(--primary)" style={{ marginTop: '2px' }} />
                    <div>
                      <div className="text-sm text-muted">Dropoff</div>
                      <div className="font-semibold">{ride.dropoff}</div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => handleRequestRide(ride.id)}>
                  Request Ride
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
