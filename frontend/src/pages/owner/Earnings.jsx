import { useAuth } from '../../context/AuthContext';
import { BarChart, Wallet, Download } from 'lucide-react';

export default function Earnings() {
  const { data } = useAuth();

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
        <h2>Earnings</h2>
      </div>

      <div className="card flex items-center justify-between" style={{ backgroundColor: 'var(--primary)', color: 'white', marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>Available Balance</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>৳{data.totalEarnings}</div>
        </div>
        <Wallet size={48} opacity={0.5} />
      </div>

      <h3>Earnings History (Mock Chart)</h3>
      <div className="card flex-col items-center justify-center" style={{ height: '300px', marginBottom: 'var(--space-6)' }}>
        <div className="flex justify-center items-end" style={{ height: '200px', width: '100%', gap: 'var(--space-4)' }}>
          {/* Mock CSS Bar Chart */}
          <div style={{ width: '10%', height: '40%', backgroundColor: 'var(--accent-border)', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '10%', height: '60%', backgroundColor: 'var(--accent-border)', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '10%', height: '30%', backgroundColor: 'var(--accent-border)', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '10%', height: '80%', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '10%', height: '50%', backgroundColor: 'var(--accent-border)', borderRadius: '4px 4px 0 0' }}></div>
        </div>
        <div className="flex justify-center gap-4" style={{ marginTop: 'var(--space-4)', width: '100%' }}>
          <button className="btn btn-outline" style={{ padding: '4px 12px', width: 'auto' }}>1W</button>
          <button className="btn btn-primary" style={{ padding: '4px 12px', width: 'auto' }}>1M</button>
          <button className="btn btn-outline" style={{ padding: '4px 12px', width: 'auto' }}>3M</button>
          <button className="btn btn-outline" style={{ padding: '4px 12px', width: 'auto' }}>1Y</button>
        </div>
      </div>

      <h3>Recent Earnings</h3>
      <div className="flex-col gap-3">
        {data.recentEarnings.map(earning => (
          <div key={earning.id} className="card flex justify-between items-center" style={{ padding: 'var(--space-4)' }}>
            <div>
              <div className="font-bold">{earning.scooter}</div>
              <div className="text-sm text-muted">Rented by {earning.renter} for {earning.hours}h • {earning.date}</div>
            </div>
            <div className="font-bold text-primary" style={{ fontSize: '18px' }}>
              +৳{earning.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
