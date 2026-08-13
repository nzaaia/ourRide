import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Clock } from 'lucide-react';

export default function PastTrips() {
  const { data } = useAuth();
  const navigate = useNavigate();
  const trips = data.pastTrips || [];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <h2 style={{ marginBottom: 0 }}>Past Trips</h2>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <MapPin size={64} />
          <h3>No trips yet</h3>
          <p>Your completed rides will appear here.</p>
          <button className="btn btn-primary" style={{ width: 'auto', marginTop: 16 }} onClick={() => navigate('/renter/browse')}>
            Browse Bikes
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {trips.map(trip => (
            <div key={trip.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
              <div className="flex items-center gap-4">
                <img src={trip.ownerAvatar} alt={trip.owner} className="avatar" style={{ width: 56, height: 56 }} />
                <div>
                  <h4 style={{ marginBottom: 4 }}>{trip.vehicle}</h4>
                  <div className="text-muted text-sm" style={{ marginBottom: 6 }}>
                    Owned by <strong>{trip.owner}</strong>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1"><Clock size={13} /> {trip.hours} hours</span>
                    <span>{trip.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>৳{trip.totalFare}</div>
                <div className="badge badge-green" style={{ fontSize: 13 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} color={i < trip.rating ? '#F59E0B' : '#E5E7EB'} fill={i < trip.rating ? '#F59E0B' : '#E5E7EB'} />
                  ))}
                  Your Rating
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
