import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  
  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/vehicle/${vehicle.id}`)}>
      <div className="flex">
        <img src={vehicle.image} alt={vehicle.model} style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
        <div className="flex-col justify-between" style={{ padding: 'var(--space-3)', flex: 1 }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: 'var(--space-1)' }}>{vehicle.model}</h3>
            <p className="text-muted text-sm" style={{ marginBottom: 'var(--space-2)' }}>{vehicle.location}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              <span className="text-sm font-semibold" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" /> {vehicle.rating}
              </span>
            </div>
            <div className="font-bold" style={{ color: 'var(--primary)' }}>
              ৳{vehicle.ratePerHour}/hr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
