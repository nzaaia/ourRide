import { NavLink } from 'react-router-dom';
import { Home, Search, Inbox, CircleUserRound, Bike, Wallet, MapPin, CarFront } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return null;

  const items = {
    owner: [
      { to: '/owner/dashboard', label: 'Home', icon: Home },
      { to: '/owner/bikes', label: 'Bikes', icon: Bike },
      { to: '/owner/requests', label: 'Requests', icon: Inbox },
      { to: '/owner/earnings', label: 'Earnings', icon: Wallet },
      { to: '/profile', label: 'Profile', icon: CircleUserRound },
    ],
    renter: [
      { to: '/renter/dashboard', label: 'Home', icon: Home },
      { to: '/renter/browse', label: 'Browse', icon: Search },
      { to: '/renter/requests', label: 'Requests', icon: Inbox },
      { to: '/profile', label: 'Profile', icon: CircleUserRound },
    ],
    passenger: [
      { to: '/passenger/search', label: 'Search', icon: MapPin },
      { to: '/renter/browse', label: 'Rides', icon: CarFront },
      { to: '/profile', label: 'Profile', icon: CircleUserRound },
    ],
  };

  const links = items[role] || items.renter;

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {links.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <item.icon size={21} strokeWidth={2} />
            <span>{item.label}</span>
            <span className="nav-dot" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
