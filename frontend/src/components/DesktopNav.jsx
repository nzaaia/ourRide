import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogIn, LogOut, ChevronDown, CircleUserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ui/Toast';

export default function DesktopNav() {
  const { isAuthenticated, role, toggleRole, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = {
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
    ],
    passenger: [
      { to: '/passenger/search', label: 'Find a Ride' },
    ],
  };

  const current = isAuthenticated ? (links[role] || []) : [
    { to: '/renter/browse', label: 'Rent a Bike' },
    { to: '/owner/dashboard', label: 'List & Earn' },
    { to: '/passenger/search', label: 'Find a Ride' },
  ];

  const switchRole = (r) => {
    toggleRole(r);
    setMenuOpen(false);
    const dest = r === 'owner' ? '/owner/dashboard' : r === 'renter' ? '/renter/dashboard' : '/passenger/search';
    navigate(dest);
    toast.info('Role switched', `You are now browsing as ${r}.`);
  };

  return (
    <header className="desktop-topnav">
      <NavLink to="/" style={{ fontWeight: 900, fontSize: 20, color: 'var(--forest)', textDecoration: 'none', letterSpacing: -0.5, marginRight: 8 }}>
        OurRide
      </NavLink>

      <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
        {current.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              padding: '7px 14px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              textDecoration: 'none',
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && user ? (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-color)', border: '1px solid var(--border-color)',
              borderRadius: 10, padding: '6px 12px 6px 6px', minHeight: 40,
            }}
          >
            <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name.split(' ')[0]}</span>
            <ChevronDown size={15} color="var(--text-muted)" />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              background: '#fff', border: '1px solid var(--border-color)',
              borderRadius: 14, boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
              minWidth: 200, zIndex: 100,
            }}>
              <div style={{ padding: '8px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {['owner', 'renter', 'passenger'].map(r => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    style={{
                      padding: '8px 6px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                      background: role === r ? 'var(--primary-light)' : 'transparent',
                      color: role === r ? 'var(--primary)' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    {r[0].toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-color)' }}>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', padding: '4px 0' }}>
                  <CircleUserRound size={16} /> My Profile
                </NavLink>
              </div>
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { login('renter'); navigate('/renter/dashboard'); }}>
          <LogIn size={15} /> Log In
        </button>
      )}
    </header>
  );
}
