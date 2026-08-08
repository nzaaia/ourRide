import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Star, MapPin, Search } from 'lucide-react';

export default function Browse() {
  const { data, toggleSavedBike, user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Show all available bikes (if not logged in show all; if logged in exclude own bikes)
  const availableBikes = data.listings.filter(l =>
    l.isAvailable && l.status === 'available' &&
    (!user || l.ownerId !== user.id)
  );

  const filteredBikes = search
    ? availableBikes.filter(l =>
        l.location.toLowerCase().includes(search.toLowerCase()) ||
        l.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
        l.ownerName.toLowerCase().includes(search.toLowerCase())
      )
    : availableBikes;

  const handleBookClick = (bikeId) => {
    if (!isAuthenticated) {
      login('renter');
    }
    navigate(`/renter/book/${bikeId}`);
  };

  const handleSave = (bikeId) => {
    if (!isAuthenticated) {
      login('renter');
      return;
    }
    toggleSavedBike(bikeId);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Search Bar */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ marginBottom: 8 }}>Available Bikes on Campus</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>All bikes are available for pickup on the university campus. Browse, compare, and book instantly.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'white', border: '1.5px solid var(--border-color)', borderRadius: 12, padding: '10px 16px', boxShadow: 'var(--shadow-sm)', maxWidth: 600 }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 15, background: 'transparent' }}
          />
        </div>
      </div>

      {filteredBikes.length === 0 ? (
        <div className="empty-state">
          <Search size={56} />
          <h3>No bikes found</h3>
          <p>Try a different search term or check back soon.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredBikes.map(bike => (
            <div
              key={bike.id}
              style={{
                background: 'white',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <div style={{ position: 'relative' }}>
                <img src={bike.image} alt={bike.vehicleName} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <button
                  onClick={() => handleSave(bike.id)}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(255,255,255,0.95)',
                    padding: 8, borderRadius: '50%',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <Bookmark
                    size={18}
                    color={isAuthenticated && data.savedBikes.includes(bike.id) ? 'var(--primary)' : 'var(--text-muted)'}
                    fill={isAuthenticated && data.savedBikes.includes(bike.id) ? 'var(--primary)' : 'none'}
                  />
                </button>
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                  ৳{bike.hourlyRate}/hr
                </div>
              </div>

              <div style={{ padding: '18px 20px' }}>
                <h3 style={{ marginBottom: 4, fontSize: 19 }}>{bike.vehicleName}</h3>
                <div className="flex items-center gap-1 text-muted text-sm" style={{ marginBottom: 14 }}>
                  <MapPin size={13} /> {bike.location}
                </div>

                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <div className="flex items-center gap-2">
                    <img src={bike.ownerAvatar} alt={bike.ownerName} className="avatar" style={{ width: 28, height: 28 }} />
                    <span className="text-sm font-semibold">{bike.ownerName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontSize: 14, fontWeight: 700 }}>
                    ★ {bike.rating}
                    <span className="text-muted text-xs font-semibold">({bike.totalTrips} trips)</span>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  + ৳{bike.wearTearRate} wear & tear per hour
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => handleBookClick(bike.id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
