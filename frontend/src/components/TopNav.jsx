import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, ChevronDown, User, Wallet, Star } from 'lucide-react';
import { useState } from 'react';

export default function TopNav() {
  const { isAuthenticated, role, toggleRole, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = {
    owner: [
      { to: '/owner/dashboard', label: 'Dashboard' },
      { to: '/owner/requests', label: 'Requests' },
      { to: '/owner/bikes', label: 'My Bikes' },
      { to: '/owner/earnings', label: 'Earnings' },
    ],
    renter: [
      { to: '/renter/dashboard', label: 'Dashboard' },
      { to: '/renter/requests', label: 'Requests' },
      { to: '/renter/browse', label: 'Browse Bikes' },
      { to: '/renter/earnings', label: 'Earnings' },
    ],
    passenger: [
      { to: '/passenger/search', label: 'Find a Ride' },
    ],
  };

  const currentLinks = isAuthenticated ? (navLinks[role] || []) : [
    { to: '/renter/browse', label: 'Rent a Bike' },
    { to: '/owner/dashboard', label: 'List & Earn' },
    { to: '/passenger/search', label: 'Find a Ride' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'white',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      padding: '0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 64
    }}>
      {/* Logo + Links */}
      <div className="flex items-center gap-8">
        <NavLink to="/" style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', textDecoration: 'none', letterSpacing: -0.5 }}>
          OurBike
        </NavLink>
        <div className="flex items-center gap-1">
          {currentLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                padding: '6px 14px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s'
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right: Role Toggle + User */}
      <div className="flex items-center gap-4">

        {/* Role Switcher */}
        {isAuthenticated && (
          <div style={{
            display: 'flex',
            background: 'var(--bg-color)',
            borderRadius: 10,
            padding: 4,
            border: '1px solid var(--border-color)'
          }}>
            {[
              { id: 'owner', label: 'Owner' },
              { id: 'renter', label: 'Renter' },
              { id: 'passenger', label: 'Passenger' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => {
                  toggleRole(r.id);
                  const dest = r.id === 'owner' ? '/owner/dashboard' : r.id === 'renter' ? '/renter/dashboard' : '/passenger/search';
                  navigate(dest);
                }}
                style={{
                  padding: '6px 16px',
                  borderRadius: 7,
                  fontWeight: 600,
                  fontSize: 14,
                  background: role === r.id ? 'white' : 'transparent',
                  color: role === r.id ? 'var(--text-main)' : 'var(--text-muted)',
                  boxShadow: role === r.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* User menu / login */}
        {isAuthenticated && user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-color)', border: '1px solid var(--border-color)',
                borderRadius: 10, padding: '6px 14px 6px 8px', cursor: 'pointer'
              }}
            >
              <img src={user.avatar} alt={user.name} className="avatar" style={{ width: 32, height: 32 }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name.split(' ')[0]}</span>
              <ChevronDown size={15} color="var(--text-muted)" />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 8,
                background: 'white', border: '1px solid var(--border-color)',
                borderRadius: 14, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', minWidth: 200, zIndex: 100
              }}>
                {/* User info */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={user.avatar} alt={user.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <button
                  onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  style={{
                    width: '100%', padding: '11px 18px', textAlign: 'left',
                    fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer', border: 'none', background: 'none', fontSize: 14,
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <User size={16} color="var(--text-muted)" /> My Profile
                </button>

                {/* Earnings (owner only) */}
                {role === 'owner' && (
                  <button
                    onClick={() => { navigate('/owner/earnings'); setShowUserMenu(false); }}
                    style={{
                      width: '100%', padding: '11px 18px', textAlign: 'left',
                      fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10,
                      cursor: 'pointer', border: 'none', background: 'none', fontSize: 14,
                      borderBottom: '1px solid var(--border-color)'
                    }}
                  >
                    <Wallet size={16} color="var(--text-muted)" /> Earnings
                  </button>
                )}

                {/* Ratings */}
                <button
                  onClick={() => {
                    navigate(role === 'owner' ? '/owner/ratings' : '/renter/ratings');
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: '100%', padding: '11px 18px', textAlign: 'left',
                    fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer', border: 'none', background: 'none', fontSize: 14,
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <Star size={16} color="var(--text-muted)" /> Ratings
                </button>

                {/* Logout */}
                <button
                  onClick={() => { logout(); navigate('/'); setShowUserMenu(false); }}
                  style={{
                    width: '100%', padding: '11px 18px', textAlign: 'left',
                    fontWeight: 600, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer', border: 'none', background: 'none', fontSize: 14
                  }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '8px 20px' }}
            onClick={() => { login('renter'); navigate('/renter/dashboard'); }}
          >
            <LogIn size={16} /> Log In
          </button>
        )}
      </div>
    </nav>
  );
}
