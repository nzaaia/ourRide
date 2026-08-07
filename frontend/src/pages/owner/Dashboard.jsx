import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Star, Wallet, Bike, Bell } from 'lucide-react';

export default function OwnerDashboard() {
  const { data, user } = useAuth();
  const navigate = useNavigate();

  const myListings = data.listings.filter(l => l.ownerId === user.id);
  const activeScooters = myListings.filter(l => l.status === 'active');
  const pendingRequests = data.incomingRequests.filter(req => 
    myListings.some(l => l.id === req.vehicleId) && req.status === 'pending'
  );

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
        <h2>Owner Dashboard</h2>
        <button 
          className="btn btn-primary flex items-center gap-2" 
          style={{ width: 'auto' }}
          onClick={() => navigate('/owner/create')}
        >
          <PlusCircle size={20} />
          Add Scooter
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card flex items-center gap-4">
          <Bike size={32} color="var(--primary)" />
          <div>
            <div className="text-muted text-sm">Listed Scooters</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{myListings.length}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <Bike size={32} color="#00B14F" />
          <div>
            <div className="text-muted text-sm">Active Now</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{activeScooters.length}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <Star size={32} color="#FFD700" />
          <div>
            <div className="text-muted text-sm">Avg Rating</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{data.userRating}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <Wallet size={32} color="var(--primary)" />
          <div>
            <div className="text-muted text-sm">Total Earnings</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>৳{data.totalEarnings}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4" style={{ cursor: 'pointer', backgroundColor: pendingRequests.length > 0 ? 'var(--accent-bg)' : '' }} onClick={() => navigate('/owner/requests')}>
          <Bell size={32} color="var(--primary)" />
          <div>
            <div className="text-muted text-sm">Pending Requests</div>
            <div className="font-bold" style={{ fontSize: '24px' }}>{pendingRequests.length}</div>
          </div>
        </div>
      </div>

      <h3>Your Active Scooters</h3>
      {activeScooters.length === 0 ? (
        <p className="text-muted">No scooters currently rented out.</p>
      ) : (
        <div className="flex-col gap-4">
          {activeScooters.map(scooter => (
            <div key={scooter.id} className="card flex justify-between items-center" style={{ padding: 'var(--space-3)' }}>
              <div className="flex items-center gap-4">
                <img src={scooter.image} alt={scooter.vehicleName} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{scooter.vehicleName}</h4>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>Reg: {scooter.regNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">Status: On Ride</div>
                <button className="btn btn-outline text-sm" style={{ padding: '4px 8px', marginTop: '4px', width: 'auto' }} onClick={() => navigate(`/owner/settings/${scooter.id}`)}>
                  Settings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
