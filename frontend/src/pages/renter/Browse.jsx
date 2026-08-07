import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Star, MapPin } from 'lucide-react';

export default function Browse() {
  const { data, toggleSavedBike, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Show available bikes that don't belong to the current user
  const availableBikes = data.listings.filter(l => l.isAvailable && l.status === 'available' && l.ownerId !== user.id);
  const filteredBikes = availableBikes.filter(l => l.location.toLowerCase().includes(search.toLowerCase()) || l.vehicleName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container">
      <div className="hero-search" style={{ marginTop: '0', marginBottom: 'var(--space-8)', maxWidth: '100%' }}>
        <input 
          type="text" 
          placeholder="Where do you want to rent a bike? (e.g. Dhanmondi)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" style={{ width: 'auto' }}>Search</button>
      </div>

      <h2 style={{ marginBottom: 'var(--space-6)' }}>Available Bikes</h2>

      <div className="cards-grid">
        {filteredBikes.map(bike => (
          <div key={bike.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={bike.image} alt={bike.vehicleName} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <button 
                onClick={() => toggleSavedBike(bike.id)}
                style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '50%' }}
              >
                <Bookmark size={20} color={data.savedBikes.includes(bike.id) ? "var(--primary)" : "var(--text-muted)"} fill={data.savedBikes.includes(bike.id) ? "var(--primary)" : "none"} />
              </button>
            </div>
            
            <div style={{ padding: 'var(--space-4)' }}>
              <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-2)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>{bike.vehicleName}</h3>
                  <div className="flex items-center gap-1 text-muted text-sm mt-1">
                    <MapPin size={14} /> {bike.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary" style={{ fontSize: '20px' }}>৳{bike.hourlyRate}</div>
                  <div className="text-muted text-sm">per hour</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-4)' }}>
                <img src={bike.ownerAvatar} alt={bike.ownerName} className="avatar" style={{ width: '24px', height: '24px' }} />
                <span className="text-sm font-semibold">{bike.ownerName}</span>
                <span className="text-muted text-sm flex items-center gap-1 ml-2"><Star size={12} fill="#FFD700" color="#FFD700" /> {bike.rating}</span>
              </div>
              
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate(`/renter/book/${bike.id}`)}>
                See Details & Book
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBikes.length === 0 && (
        <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
          No bikes found matching your search.
        </div>
      )}
    </div>
  );
}
