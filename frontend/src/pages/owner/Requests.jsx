import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, MapPin, Clock, Phone, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Requests() {
  const { data, user, acceptBookingRequest, updateBookingStatus } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('incoming');

  const myListings = data.listings.filter(l => l.ownerId === user.id);
  const myRequests = data.incomingRequests.filter(req => myListings.some(l => l.id === req.vehicleId));

  const incoming = myRequests.filter(req => req.status === 'pending');
  const past = myRequests.filter(req => req.status !== 'pending');

  const [selectedReq, setSelectedReq] = useState(null);

  const handleAccept = (id) => {
    acceptBookingRequest(id);
  };

  const handleReject = (id) => {
    updateBookingStatus(id, 'rejected');
  };

  const renderRequestCard = (req, isIncoming) => {
    const vehicle = myListings.find(l => l.id === req.vehicleId);
    const isExpanded = selectedReq === req.id;
    const isAccepted = req.status === 'accepted';

    return (
      <div
        key={req.id}
        style={{
          background: 'white',
          border: `2px solid ${isAccepted ? 'var(--primary)' : 'var(--border-color)'}`,
          borderRadius: 20,
          marginBottom: 16,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          transition: 'box-shadow 0.2s'
        }}
      >
        {/* Main row */}
        <div
          style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => setSelectedReq(isExpanded ? null : req.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={req.renterAvatar} alt={req.renterName} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h4 style={{ margin: 0 }}>{req.renterName}</h4>
                <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>★ {req.renterRating}</span>
                {isAccepted && <span className="badge badge-green">● Accepted</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>
                wants to rent <strong>{vehicle?.vehicleName}</strong>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {req.estimatedDuration}h · <span style={{ fontWeight: 700, color: 'var(--primary)' }}>৳{req.estimatedFare}</span>
              </div>
            </div>
          </div>

          {isIncoming && !isAccepted && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-outline btn-sm"
                style={{ width: 'auto', borderColor: 'var(--error)', color: 'var(--error)' }}
                onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: 'auto' }}
                onClick={(e) => { e.stopPropagation(); handleAccept(req.id); }}
              >
                <CheckCircle size={16} /> Accept
              </button>
            </div>
          )}

          {!isIncoming && (
            <span style={{
              fontWeight: 700,
              color: req.status === 'accepted' ? 'var(--primary)' : 'var(--error)',
              textTransform: 'capitalize'
            }}>
              {req.status}
            </span>
          )}
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>

            {/* Renter details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Avg Rating', value: `${req.renterRating} / 5.0` },
                { label: 'Past Rides', value: req.renterPastRides || 24 },
                { label: 'Phone', value: req.renterPhone || '017XXXXXXXX' },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* NID */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 20 }}>
              <User size={16} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>NID Number</div>
                <div style={{ fontWeight: 700 }}>
                  {req.renterNid
                    ? `${req.renterNid.slice(0, 4)} •••• ${req.renterNid.slice(-4)}`
                    : '•••• •••• ••••'}
                </div>
              </div>
            </div>

            {/* Pickup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 20 }}>
              <MapPin size={16} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Pickup Location</div>
                <div style={{ fontWeight: 600 }}>{req.pickupLocation}</div>
              </div>
            </div>

            {/* After accept: message/call buttons */}
            {isAccepted && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/chat')}>
                  <MessageCircle size={16} /> Message {req.renterName}
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert(`Calling ${req.renterName}...`)}>
                  <Phone size={16} /> Call
                </button>
              </div>
            )}

            {/* Location revealed notice */}
            {isAccepted && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={16} color="var(--primary)" />
                <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>
                  Exact bike location has been revealed to the renter. They have 20 minutes to arrive.
                </div>
              </div>
            )}

            {/* Rejected notice */}
            {req.status === 'rejected' && (
              <div style={{ padding: '12px 16px', background: '#FEE2E2', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#991B1B' }}>
                This request was rejected.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>Booking Requests</h2>
      <p className="text-muted" style={{ marginBottom: 28 }}>Review and respond to renter requests for your bikes.</p>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 28 }}>
        {[
          { id: 'incoming', label: `Incoming (${incoming.length})` },
          { id: 'past', label: `Past (${past.length})` },
        ].map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'incoming' && (
          incoming.length > 0
            ? incoming.map(req => renderRequestCard(req, true))
            : (
              <div className="empty-state">
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <h3>No pending requests</h3>
                <p>When renters book your bikes, requests will appear here.</p>
              </div>
            )
        )}
        {tab === 'past' && (
          past.length > 0
            ? past.map(req => renderRequestCard(req, false))
            : <p className="text-muted">No past requests.</p>
        )}
      </div>
    </div>
  );
}
