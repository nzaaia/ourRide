import { useAuth } from '../context/AuthContext';
import { User, Phone, CreditCard, Star, Shield, Camera, Edit3, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, data, role } = useAuth();

  if (!user) return null;

  const ratingBreakdown = data.userRatingBreakdown || [];
  const tripCount = (data.pastTrips || []).length;

  const roleBadge = {
    owner: { label: 'Bike Owner', color: '#8B5CF6', bg: '#EDE9FE' },
    renter: { label: 'Renter', color: '#00B14F', bg: '#E6F9EE' },
    passenger: { label: 'Passenger', color: '#3B82F6', bg: '#DBEAFE' },
  }[role] || { label: 'User', color: '#6B7280', bg: '#F3F4F6' };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>

      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, #00B14F 0%, #009E45 60%, #007A35 100%)',
        borderRadius: 24,
        padding: '40px 40px 56px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 0
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 28 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 30, height: 30, borderRadius: '50%',
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer'
            }} title="Profile photo is set at registration">
              <Camera size={14} color="#00B14F" />
            </div>
          </div>

          {/* Name & Role */}
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'white', marginBottom: 6, fontSize: 28 }}>{user.name}</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: roleBadge.bg, color: roleBadge.color,
              padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700
            }}>
              <Shield size={12} /> {roleBadge.label}
            </span>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
              <Star size={16} color="#FCD34D" fill="#FCD34D" />
              <span style={{ fontWeight: 700, fontSize: 18 }}>{data.userRating}</span>
              <span style={{ opacity: 0.8, fontSize: 14 }}>/ 5.0 rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row overlapping the header */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1, marginTop: -32, marginBottom: 28,
        background: 'var(--border-color)', borderRadius: 16,
        overflow: 'hidden', boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
      }}>
        {[
          { label: 'Total Trips', value: tripCount },
          { label: 'Avg Rating', value: `${data.userRating}★` },
          { label: 'Member Since', value: '2025' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Info Card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border-color)', padding: '28px 32px', boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 0 }}>Account Details</h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
            color: 'var(--text-muted)', fontWeight: 600,
            padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-color)',
            cursor: 'default'
          }}>
            <Edit3 size={13} /> Edit coming soon
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              icon: <User size={18} color="var(--primary)" />,
              label: 'Full Name',
              value: user.name,
              sublabel: 'As registered'
            },
            {
              icon: <span style={{ fontSize: 16 }}>@</span>,
              label: 'Email',
              value: user.email,
              sublabel: 'Verified'
            },
            {
              icon: <Phone size={18} color="var(--primary)" />,
              label: 'Phone Number',
              value: user.phone || '—',
              sublabel: 'Mobile'
            },
            {
              icon: <CreditCard size={18} color="var(--primary)" />,
              label: 'NID Number',
              value: user.nid
                ? `${user.nid.slice(0, 4)} •••• ${user.nid.slice(-4)}`
                : '—',
              sublabel: 'National Identity Card'
            },
            {
              icon: <Shield size={18} color="var(--primary)" />,
              label: 'User ID',
              value: user.userId || `USR-${user.id?.toUpperCase()}`,
              sublabel: 'Registered ID'
            },
            {
              icon: <Calendar size={18} color="var(--primary)" />,
              label: 'Member Since',
              value: user.registeredAt
                ? new Date(user.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'January 2025',
              sublabel: 'Registration date'
            },
          ].map((item, idx, arr) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 0',
              borderBottom: idx < arr.length - 1 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: 'var(--primary)'
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>{item.value}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 500 }}>{item.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Breakdown */}
      {ratingBreakdown.length > 0 && (
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border-color)', padding: '28px 32px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: 20 }}>Recent Reviews</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ratingBreakdown.map((review, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: 14, padding: '14px 0',
                borderBottom: idx < ratingBreakdown.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}>
                <img src={review.avatar} alt={review.rater} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{review.rater}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} color={i < review.score ? '#F59E0B' : '#E5E7EB'} fill={i < review.score ? '#F59E0B' : '#E5E7EB'} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>{review.comment}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{review.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
