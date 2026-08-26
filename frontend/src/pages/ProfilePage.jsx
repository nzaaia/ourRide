import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, CreditCard, Star, Shield, Camera, Edit3, Calendar, Bike, MapPin, Wallet } from 'lucide-react';

export default function ProfilePage() {
  const { user, data, role, toggleRole } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const ratingBreakdown = data.userRatingBreakdown || [];
  const tripCount = (data.pastTrips || []).length;

  const roleBadge = {
    owner: { label: 'Bike Owner', color: '#8B5CF6', bg: '#EDE9FE' },
    renter: { label: 'Renter', color: '#00B14F', bg: '#E6F9EE' },
    passenger: { label: 'Passenger', color: '#3B82F6', bg: '#DBEAFE' },
  }[role] || { label: 'User', color: '#6B7280', bg: '#F3F4F6' };

  const switchRole = (r) => {
    toggleRole(r);
    const dest = r === 'owner' ? '/owner/dashboard' : r === 'renter' ? '/renter/dashboard' : '/passenger/search';
    navigate(dest);
  };

  const roles = [
    { id: 'owner', label: 'Owner', icon: <Wallet size={16} /> },
    { id: 'renter', label: 'Renter', icon: <Bike size={16} /> },
    { id: 'passenger', label: 'Passenger', icon: <MapPin size={16} /> },
  ];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>

      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, #00B14F 0%, #009E45 60%, #007A35 100%)',
        borderRadius: 20,
        padding: '28px 24px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 0
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: '50%',
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <Camera size={13} color="#00B14F" />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ color: 'white', marginBottom: 6, fontSize: 22, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: roleBadge.bg, color: roleBadge.color,
              padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700
            }}>
              <Shield size={12} /> {roleBadge.label}
            </span>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Star size={14} color="#FCD34D" fill="#FCD34D" />
              <span style={{ fontWeight: 700, fontSize: 16 }}>{data.userRating}</span>
              <span style={{ opacity: 0.8, fontSize: 13 }}>/ 5.0 rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1, marginTop: 16, marginBottom: 20,
        background: 'var(--border-color)', borderRadius: 14,
        overflow: 'hidden', boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
      }}>
        {[
          { label: 'Total Trips', value: tripCount },
          { label: 'Avg Rating', value: `${data.userRating}` },
          { label: 'Member Since', value: '2025' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Role switcher */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border-color)', padding: 16, boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ marginBottom: 0, fontSize: 16 }}>Switch Role</h3>
          <span className="text-muted text-sm" style={{ fontSize: 12 }}>Browse as a different side</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px 8px', borderRadius: 10,
                background: role === r.id ? 'var(--primary)' : 'var(--bg-color)',
                color: role === r.id ? '#fff' : 'var(--text-muted)',
                border: role === r.id ? 'none' : '1px solid var(--border-color)',
                fontWeight: 700, fontSize: 13, minHeight: 44,
              }}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Info Card */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border-color)', padding: '20px 16px', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ marginBottom: 0, fontSize: 16 }}>Account Details</h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
            color: 'var(--text-muted)', fontWeight: 600,
            padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border-color)'
          }}>
            <Edit3 size={12} /> Edit coming soon
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { icon: <User size={16} color="var(--primary)" />, label: 'Full Name', value: user.name, sublabel: 'As registered' },
            { icon: <span style={{ fontSize: 15 }}>@</span>, label: 'Email', value: user.email, sublabel: 'Verified' },
            { icon: <Phone size={16} color="var(--primary)" />, label: 'Phone Number', value: user.phone || '—', sublabel: 'Mobile' },
            {
              icon: <CreditCard size={16} color="var(--primary)" />,
              label: 'NID Number',
              value: user.nid ? `${user.nid.slice(0, 4)} •••• ${user.nid.slice(-4)}` : '—',
              sublabel: 'National ID'
            },
            { icon: <Shield size={16} color="var(--primary)" />, label: 'User ID', value: user.userId || `USR-${user.id?.toUpperCase()}`, sublabel: 'Registered ID' },
            {
              icon: <Calendar size={16} color="var(--primary)" />,
              label: 'Member Since',
              value: user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'January 2025',
              sublabel: 'Registration date'
            },
          ].map((item, idx, arr) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 0',
              borderBottom: idx < arr.length - 1 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: 'var(--primary)'
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 1 }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 500, flexShrink: 0 }}>{item.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Breakdown */}
      {ratingBreakdown.length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border-color)', padding: '20px 16px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: 14, fontSize: 16 }}>Recent Reviews</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ratingBreakdown.map((review, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: 12, padding: '12px 0',
                borderBottom: idx < ratingBreakdown.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}>
                <img src={review.avatar} alt={review.rater} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{review.rater}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} color={i < review.score ? '#F59E0B' : '#E5E7EB'} fill={i < review.score ? '#F59E0B' : '#E5E7EB'} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 3 }}>{review.comment}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{review.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
