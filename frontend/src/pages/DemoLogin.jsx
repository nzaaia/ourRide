import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Bike, User, LogIn } from 'lucide-react';

export default function DemoLogin() {
  const { login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (role) => {
    login(role);
    if (role === 'owner') navigate('/owner/dashboard');
    else if (role === 'renter') navigate('/renter/dashboard');
    else navigate('/passenger/search');
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h2>Demo Login</h2>
        <p className="text-muted">Choose a persona to seamlessly log in for demo purposes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-primary" style={{ display: 'flex', gap: 10, justifyContent: 'center' }} onClick={() => handleDemoLogin('owner')}>
          <Shield size={18} /> Login as Owner
        </button>
        <button className="btn btn-primary" style={{ display: 'flex', gap: 10, justifyContent: 'center', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => handleDemoLogin('renter')}>
          <Bike size={18} /> Login as Rider (Renter)
        </button>
        <button className="btn btn-primary" style={{ display: 'flex', gap: 10, justifyContent: 'center', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }} onClick={() => handleDemoLogin('passenger')}>
          <User size={18} /> Login as Passenger
        </button>
      </div>

      <div style={{ textAlign: 'center', margin: '30px 0', color: 'var(--text-muted)' }}>
        — OR —
      </div>

      <button className="btn btn-outline" style={{ width: '100%', display: 'flex', gap: 10, justifyContent: 'center' }} onClick={() => loginWithOAuth('google')}>
        <LogIn size={18} /> Login with Google (OAuth)
      </button>
    </div>
  );
}
