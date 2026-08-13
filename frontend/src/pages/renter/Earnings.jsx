import { useAuth } from '../../context/AuthContext';
import { Wallet, Clock, Bike } from 'lucide-react';

export default function RenterEarnings() {
  const { data } = useAuth();

  // Use pastTrips or recentEarnings as spending history
  const tripHistory = (data.pastTrips || []);
  const totalSpent = tripHistory.reduce((sum, t) => sum + (t.fare || t.totalFare || 0), 0);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>My Spending</h2>
          <p className="text-muted" style={{ marginBottom: 0 }}>A summary of what you've spent on rides.</p>
        </div>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), #009E45)',
        borderRadius: 20, padding: '28px 32px', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 32, boxShadow: '0 8px 24px rgba(0,177,79,0.3)'
      }}>
        <div>
          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 6, fontWeight: 600 }}>Total Spent on Rides</div>
          <div style={{ fontSize: 40, fontWeight: 900 }}>৳{totalSpent.toLocaleString()}</div>
        </div>
        <Wallet size={52} opacity={0.4} />
      </div>

      {/* Trip history */}
      <h3 style={{ marginBottom: 16 }}>Trip History</h3>
      {tripHistory.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center',
          border: '1px dashed var(--border-color)', color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Bike size={36} color="var(--text-muted)" />
          </div>
          <div style={{ fontWeight: 600 }}>No trips yet — book your first ride!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tripHistory.map((trip, idx) => (
            <div key={trip.id || idx} style={{
              background: 'white', borderRadius: 14, padding: '16px 20px',
              border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {trip.image && (
                  <img src={trip.image} alt={trip.vehicleName} style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{trip.vehicleName || trip.scooter || 'Ride'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={12} /> {trip.date || trip.startTime || '—'} · {trip.duration || trip.hours || '?'}h
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>
                ৳{(trip.fare || trip.totalFare || trip.amount || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
