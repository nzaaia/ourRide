import { Star } from 'lucide-react';

export default function RideCard({ ride, onBook }) {
  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-3)' }}>
        <div className="flex items-center gap-3">
          <img src={ride.driverAvatar} alt={ride.driverName} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div>
            <h3 style={{ fontSize: '16px', margin: 0 }}>{ride.driverName}</h3>
            <span className="text-sm font-semibold" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" /> {ride.rating}
            </span>
          </div>
        </div>
        <div className="font-bold" style={{ fontSize: '18px', color: 'var(--primary)' }}>
          ৳{ride.flatFee}
        </div>
      </div>
      
      <div className="flex-col gap-2" style={{ marginBottom: 'var(--space-4)', position: 'relative', paddingLeft: 'var(--space-4)' }}>
        <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-16px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
          <p className="font-semibold" style={{ margin: 0 }}>{ride.origin}</p>
          <p className="text-muted text-sm" style={{ margin: 0 }}>{ride.departureTime}</p>
        </div>
        <div style={{ position: 'relative', marginTop: 'var(--space-2)' }}>
          <div style={{ position: 'absolute', left: '-16px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--primary)', backgroundColor: 'white' }}></div>
          <p className="font-semibold" style={{ margin: 0 }}>{ride.destination}</p>
        </div>
      </div>
      
      <button className="btn btn-primary" onClick={() => onBook(ride)}>
        Request Ride
      </button>
    </div>
  );
}
