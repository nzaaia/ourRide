import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Star, MapPin, Search, Bike, ChevronRight } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { BikeTileSkeleton } from '../../components/ui/Skeleton';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'sport', label: 'Sport' },
  { id: 'commute', label: 'Commute' },
  { id: 'auto', label: 'Auto-accept' },
];

export default function Browse() {
  const { data, toggleSavedBike, user, isAuthenticated, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const availableBikes = data.listings.filter(l =>
    l.isAvailable && l.status === 'available' &&
    (!user || l.ownerId !== user.id)
  );

  const filteredBikes = availableBikes.filter(l => {
    const matchesSearch = !search ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      l.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'auto' ? Boolean(l.autoAccept) :
      filter === 'sport' ? /R15|CB300R|Gixxer|Sport/i.test(l.vehicleName) :
      true;
    return matchesSearch && matchesFilter;
  });

  const handleBookClick = (bikeId) => {
    if (!isAuthenticated) login('renter');
    navigate(`/renter/book/${bikeId}`);
  };

  const handleSave = (bikeId) => {
    if (!isAuthenticated) {
      login('renter');
      return;
    }
    const isSaved = data.savedBikes.includes(bikeId);
    toggleSavedBike(bikeId);
    toast[isSaved ? 'info' : 'success'](isSaved ? 'Removed from saved' : 'Bike saved', isSaved ? '' : 'Found it in your Saved tab.');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ marginBottom: 4 }}>Browse bikes</h2>
        <p className="text-muted text-sm" style={{ marginBottom: 14 }}>Rent a bike by the hour, all on campus.</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--surface)', border: '1.5px solid var(--border-color)', borderRadius: 12, padding: '10px 14px', boxShadow: 'var(--shadow-sm)' }}>
          <Search size={19} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 16, background: 'transparent', minHeight: 24 }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="pill-row" style={{ marginBottom: 16 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`pill ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="cards-grid">
          {Array.from({ length: 4 }).map((_, i) => <BikeTileSkeleton key={i} />)}
        </div>
      ) : filteredBikes.length === 0 ? (
        <div className="empty-state">
          <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={28} color="var(--primary)" />
          </div>
          <h3>No bikes found</h3>
          <p>Try a different search term or check back soon.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredBikes.map(bike => (
            <div key={bike.id} className="bike-tile">
              <div className="tile-media">
                <img src={bike.image} alt={bike.vehicleName} loading="lazy" />
                <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(12,61,36,0.92)', color: '#fff', padding: '2px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  ৳{bike.hourlyRate}/hr
                </div>
                <button
                  onClick={() => handleSave(bike.id)}
                  aria-label={isAuthenticated && data.savedBikes.includes(bike.id) ? 'Remove from saved' : 'Save bike'}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(255,255,255,0.95)', padding: 8, borderRadius: '50%',
                    boxShadow: 'var(--shadow-sm)', cursor: 'pointer', width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Bookmark
                    size={17}
                    color={isAuthenticated && data.savedBikes.includes(bike.id) ? 'var(--primary)' : 'var(--text-muted)'}
                    fill={isAuthenticated && data.savedBikes.includes(bike.id) ? 'var(--primary)' : 'none'}
                  />
                </button>
              </div>

              <div className="tile-body">
                <div style={{ fontWeight: 800, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bike.vehicleName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, margin: '3px 0 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <MapPin size={11} /> {bike.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  {bike.rating}
                  <span className="text-light" style={{ fontWeight: 500, fontSize: 11 }}>({bike.totalTrips})</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                    +৳{bike.wearTearRate} wear &amp; tear/hr
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', minHeight: 40, padding: '8px 0' }}
                    onClick={() => handleBookClick(bike.id)}
                  >
                    Book <ChevronRight size={15} />
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
