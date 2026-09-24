import { Star } from 'lucide-react';
import './RideCard.css';

export default function RideCard({ ride, onBook }) {
  return (
    <div className="card ride-card">
      <div className="flex justify-between items-center ride-card__header">
        <div className="flex items-center gap-3">
          <img src={ride.driverAvatar} alt={ride.driverName} className="ride-card__avatar" />
          <div>
            <h3 className="ride-card__driver-name">{ride.driverName}</h3>
            <span className="text-sm font-semibold ride-card__rating">
              <Star size={12} color="#F59E0B" fill="#F59E0B" /> {ride.rating}
            </span>
          </div>
        </div>
        <div className="font-bold ride-card__fare">
          ৳{ride.flatFee}
        </div>
      </div>
      
      <div className="flex-col gap-2 ride-card__route">
        <div className="ride-card__route-line"></div>
        <div className="ride-card__route-point">
          <div className="ride-card__route-dot--origin"></div>
          <p className="font-semibold" style={{ margin: 0 }}>{ride.origin}</p>
          <p className="text-muted text-sm" style={{ margin: 0 }}>{ride.departureTime}</p>
        </div>
        <div className="ride-card__route-point ride-card__destination">
          <div className="ride-card__route-dot--destination"></div>
          <p className="font-semibold" style={{ margin: 0 }}>{ride.destination}</p>
        </div>
      </div>
      
      <button className="btn btn-primary" onClick={() => onBook(ride)}>
        Request Ride
      </button>
    </div>
  );
}
