import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Requests() {
  const { data, user, updateBookingStatus } = useAuth();
  const [tab, setTab] = useState('incoming');

  const myListings = data.listings.filter(l => l.ownerId === user.id);
  const myRequests = data.incomingRequests.filter(req => myListings.some(l => l.id === req.vehicleId));
  
  const incoming = myRequests.filter(req => req.status === 'pending');
  const past = myRequests.filter(req => req.status !== 'pending');

  const handleAction = (id, action) => {
    updateBookingStatus(id, action);
  };

  const renderRequestCard = (req, isIncoming) => {
    const vehicle = myListings.find(l => l.id === req.vehicleId);
    
    return (
      <div key={req.id} className="card flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="flex items-center gap-4">
          <img src={req.renterAvatar} alt={req.renterName} className="avatar" style={{ width: '64px', height: '64px' }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '18px' }}>{req.renterName} wants to rent {vehicle.vehicleName}</h4>
            <p className="text-muted" style={{ margin: 0 }}>Duration: {req.estimatedDuration} hours • Pickup: {req.pickupLocation}</p>
            <div className="font-bold text-primary" style={{ marginTop: 'var(--space-2)' }}>Estimated Fare: ৳{req.estimatedFare}</div>
          </div>
        </div>
        
        {isIncoming ? (
          <div className="flex gap-2">
            <button className="btn btn-outline flex items-center gap-2" style={{ width: 'auto', borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => handleAction(req.id, 'rejected')}>
              <XCircle size={18} /> Reject
            </button>
            <button className="btn btn-primary flex items-center gap-2" style={{ width: 'auto' }} onClick={() => handleAction(req.id, 'accepted')}>
              <CheckCircle size={18} /> Accept
            </button>
          </div>
        ) : (
          <div>
            <span className={`font-bold ${req.status === 'accepted' ? 'text-primary' : 'text-muted'}`} style={{ textTransform: 'capitalize' }}>
              {req.status}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-6)' }}>Booking Requests</h2>

      <div className="flex" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-6)' }}>
        <button 
          onClick={() => setTab('incoming')}
          style={{ 
            padding: 'var(--space-3) var(--space-6)', 
            borderBottom: tab === 'incoming' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: tab === 'incoming' ? 'bold' : 'normal',
            color: tab === 'incoming' ? 'var(--text-main)' : 'var(--text-muted)'
          }}
        >
          Incoming Requests ({incoming.length})
        </button>
        <button 
          onClick={() => setTab('past')}
          style={{ 
            padding: 'var(--space-3) var(--space-6)', 
            borderBottom: tab === 'past' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: tab === 'past' ? 'bold' : 'normal',
            color: tab === 'past' ? 'var(--text-main)' : 'var(--text-muted)'
          }}
        >
          Past Requests ({past.length})
        </button>
      </div>

      <div>
        {tab === 'incoming' && (
          incoming.length > 0 ? incoming.map(req => renderRequestCard(req, true)) : <p className="text-muted">No incoming requests.</p>
        )}
        {tab === 'past' && (
          past.length > 0 ? past.map(req => renderRequestCard(req, false)) : <p className="text-muted">No past requests.</p>
        )}
      </div>
    </div>
  );
}
