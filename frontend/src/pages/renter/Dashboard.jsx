import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Map, Bookmark, Star, Search } from 'lucide-react';

export default function RenterDashboard() {
  const { data } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
        <h2>Renter Dashboard</h2>
        <button 
          className="btn btn-primary flex items-center gap-2" 
          style={{ width: 'auto' }}
          onClick={() => navigate('/renter/browse')}
        >
          <Search size={20} />
          Look for a bike
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card flex items-center gap-4">
          <Map size={32} color="var(--primary)" />
          <div>
            <div className="text-muted text-sm">Past Trips</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{data.pastTrips}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <Bookmark size={32} color="#AA3BFF" />
          <div>
            <div className="text-muted text-sm">Saved Bikes</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{data.savedBikes.length}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <Star size={32} color="#FFD700" />
          <div>
            <div className="text-muted text-sm">Your Rating</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{data.userRating}</div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', backgroundColor: 'var(--bg-color)', border: 'none' }}>
        <h3 style={{ marginBottom: 'var(--space-2)' }}>Ready for your next ride?</h3>
        <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>Find the perfect scooter near you for your next commute.</p>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/renter/browse')}>Browse Available Bikes</button>
      </div>
    </div>
  );
}
