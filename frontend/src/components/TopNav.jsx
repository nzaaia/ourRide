import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Bike, User } from 'lucide-react';

export default function TopNav() {
  const { role, toggleRole, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="top-nav">
      <div className="flex items-center gap-6">
        <NavLink to="/" className="top-nav-logo">
          OurBike
        </NavLink>
        
        {role === 'owner' && (
          <div className="top-nav-links">
            <NavLink to="/owner/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/owner/requests" className="nav-link">Requests</NavLink>
            <NavLink to="/owner/earnings" className="nav-link">Earnings</NavLink>
          </div>
        )}
        
        {role === 'renter' && (
          <div className="top-nav-links">
            <NavLink to="/renter/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/renter/browse" className="nav-link">Browse Bikes</NavLink>
          </div>
        )}
        
        {role === 'passenger' && (
          <div className="top-nav-links">
            <NavLink to="/passenger/search" className="nav-link">Find a Ride</NavLink>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'owner' ? 'active' : ''}`}
            onClick={() => { toggleRole('owner'); navigate('/owner/dashboard'); }}
          >
            Owner
          </button>
          <button 
            className={`role-btn ${role === 'renter' ? 'active' : ''}`}
            onClick={() => { toggleRole('renter'); navigate('/renter/dashboard'); }}
          >
            Renter
          </button>
          <button 
            className={`role-btn ${role === 'passenger' ? 'active' : ''}`}
            onClick={() => { toggleRole('passenger'); navigate('/passenger/search'); }}
          >
            Passenger
          </button>
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="avatar" style={{ width: '36px', height: '36px' }} />
            <span className="font-semibold">{user.name}</span>
          </div>
        ) : (
          <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Log In</button>
        )}
      </div>
    </nav>
  );
}
