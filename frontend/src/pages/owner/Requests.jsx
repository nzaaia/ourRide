import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, MapPin, Clock, Phone, MessageCircle, User, Inbox, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

export default function Requests() {
  const { data, user, acceptBookingRequest, updateBookingStatus } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('incoming');
  const [selectedReq, setSelectedReq] = useState(null);

  const myListings = data.listings.filter(l => l.ownerId === user.id);
  const myRequests = data.incomingRequests.filter(req => myListings.some(l => l.id === req.vehicleId));

  const incoming = myRequests.filter(req => req.status === 'pending');
  const past = myRequests.filter(req => req.status !== 'pending');

  const handleAccept = (id) => {
    acceptBookingRequest(id);
    toast.success('Request accepted', 'The exact location was revealed to the renter. They have 20 minutes to arrive.');
  };

  const handleReject = (id) => {
    updateBookingStatus(id, 'rejected');
    toast.info('Request rejected', 'The renter has been notified.');
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
          borderRadius: 16,
          marginBottom: 14,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Main row */}
        <div
          style={{ padding: '16px', cursor: 'pointer' }}
          onClick={() => setSelectedReq(isExpanded ? null : req.id)}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <img src={req.renterAvatar} alt={req.renterName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                <b style={{ fontSize: 15 }}>{req.renterName}</b>
                <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <Star size={11} fill="#F59E0B" /> {req.renterRating}
                </span>
                {isAccepted && <span className="badge badge-green">Accepted</span>}
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
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                className="btn btn-outline btn-sm"
                style={{ width: 'auto', flex: 1, borderColor: 'var(--error)', color: 'var(--error)' }}
                onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                className="btn btn-outline btn-sm"
                style={{ width: 'auto', flex: 1 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/chat/${req.id}`); }}
              >
                <MessageCircle size={16} /> Chat
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: 'auto', flex: 1 }}
                onClick={(e) => { e.stopPropagation(); handleAccept(req.id); }}
              >
                <CheckCircle size={16} /> Accept
              </button>
            </div>
          )}

          {!isIncoming && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <span className={req.status === 'accepted' ? 'badge badge-green' : 'badge badge-red'}>
                {req.status === 'accepted' ? 'Accepted' : 'Rejected'}
              </span>
            </div>
          )}
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Avg Rating', value: `${req.renterRating} / 5.0` },
                { label: 'Past Rides', value: req.renterPastRides || 24 },
                { label: 'Phone', value: req.renterPhone || '017XXXXXXXX' },
                { label: 'Duration', value: `${req.estimatedDuration}h` },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', borderRadius: 10, padding: '11px 12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', background: 'white', borderRadius: 10, border: '1px solid var(--border-color)', marginBottom: 10 }}>
              <User size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>NID Number</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {req.renterNid
                    ? `${req.renterNid.slice(0, 4)} •••• ${req.renterNid.slice(-4)}`
                    : '•••• •••• ••••'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', background: 'white', borderRadius: 10, border: '1px solid var(--border-color)', marginBottom: 10 }}>
              <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Pickup Location</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{req.pickupLocation}</div>
              </div>
            </div>

            {isAccepted && (
              <>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                    const chatUrl = `/chat/${req.id}?name=${encodeURIComponent(req.renterName)}&context=${encodeURIComponent((vehicle?.vehicleName || 'Bike') + ' booking')}&avatar=${encodeURIComponent(req.renterAvatar || '')}`;
                    navigate(chatUrl);
                  }}>
                    <MessageCircle size={15} /> Message
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => toast.info('Call', `Calling ${req.renterName}...`)}>
                    <Phone size={15} /> Call
                  </button>
                </div>
                <div style={{ marginTop: 10, padding: '11px 12px', background: 'var(--primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>
                    Exact bike location revealed. Renter has 20 minutes to arrive.
                  </div>
                </div>
              </>
            )}

            {req.status === 'rejected' && (
              <div style={{ padding: '11px 12px', background: '#FEE2E2', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#991B1B' }}>
                This request was rejected.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <PageHeader title="Booking Requests" subtitle="Review and respond to renter requests" />

      <div className="tabs" style={{ marginBottom: 20 }}>
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
                <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Inbox size={28} color="var(--primary)" />
                </div>
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
