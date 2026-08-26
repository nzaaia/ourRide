import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark, MapPin, Star } from 'lucide-react';

export default function SavedBikes() {
  const { data, toggleSavedBike } = useAuth();
  const navigate = useNavigate();

  const saved = data.listings.filter(l => data.savedBikes.includes(l.id));

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <h2 style={{ marginBottom: 0 }}>Saved Bikes</h2>
      </div>

      {saved.length === 0 ? (
        <div className="empty-state">
          <Bookmark size={64} />
          <h3>No saved bikes</h3>
          <p>Bookmark bikes you like while browsing.</p>
          <button className="btn btn-primary" style={{ width: 'auto', marginTop: 16 }} onClick={() => navigate('/renter/browse')}>
            Browse Bikes
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {saved.map(bike => (
            <div key={bike.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img src={bike.image} alt={bike.vehicleName} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <button
                  onClick={() => toggleSavedBike(bike.id)}
                  style={{ position: 'absolute', top: 12, right: 12, background: 'white', padding: 8, borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}
                >
                  <Bookmark size={18} color="var(--primary)" fill="var(--primary)" />
                </button>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ marginBottom: 6, fontSize: 18 }}>{bike.vehicleName}</h3>
                <div className="flex items-center gap-1 text-muted text-sm" style={{ marginBottom: 12 }}>
                  <MapPin size={13} /> {bike.location}
                </div>
                <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                  <span className="text-sm font-semibold" style={{ color: bike.isAvailable ? 'var(--primary)' : 'var(--error)' }}>
                    {bike.isAvailable ? '● Available' : '● Rented'}
                  </span>
                  <span className="font-bold" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" /> {bike.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>৳{bike.hourlyRate}</span>
                  <span className="text-sm text-muted">per hour</span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={!bike.isAvailable}
                  onClick={() => navigate(`/renter/book/${bike.id}`)}
                >
                  {bike.isAvailable ? 'Book Now' : 'Currently Rented'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
