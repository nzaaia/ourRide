import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, MapPin, Star, ShieldCheck, Clock } from 'lucide-react';

export default function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, user, addBookingRequest } = useAuth();
  
  const vehicle = data.listings.find(v => v.id === id);
  const [hours, setHours] = useState(2);

  if (!vehicle) return <div className="container">Vehicle not found</div>;

  const estimatedFare = (vehicle.hourlyRate + vehicle.wearTearRate) * hours;

  const handleBook = () => {
    const request = {
      id: `req${Math.floor(Math.random() * 1000)}`,
      vehicleId: vehicle.id,
      renterName: user.name,
      renterAvatar: user.avatar,
      pickupLocation: vehicle.location,
      estimatedDuration: hours,
      estimatedFare: estimatedFare,
      status: 'pending'
    };
    
    addBookingRequest(request);
    
    if (vehicle.autoAccept) {
      alert(`Booking confirmed automatically! Total Fare: ৳${estimatedFare}`);
    } else {
      alert(`Booking request sent to ${vehicle.ownerName}. Estimated Fare: ৳${estimatedFare}`);
    }
    navigate('/renter/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline flex items-center gap-2 mb-6" style={{ width: 'auto', padding: '8px 16px' }}>
        <ChevronLeft size={20} /> Back to Search
      </button>
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <div>
          <img src={vehicle.image} alt={vehicle.model} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }} />
          
          <h1>{vehicle.vehicleName}</h1>
          <div className="flex items-center gap-2 text-muted mb-6">
            <MapPin size={18} />
            <span>{vehicle.location}</span>
          </div>

          <div className="card flex items-center gap-4 mb-6">
            <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} className="avatar" style={{ width: '64px', height: '64px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>Hosted by {vehicle.ownerName}</h3>
              <div className="flex items-center gap-1 text-sm text-muted mt-1">
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <span>{vehicle.rating} rating</span>
              </div>
            </div>
            <ShieldCheck size={32} color="var(--primary)" />
          </div>

          <h3>Description</h3>
          <p className="text-muted" style={{ lineHeight: '1.6' }}>{vehicle.description}</p>
        </div>

        <div>
          <div className="card sticky" style={{ top: '100px' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Book this ride</h3>
            
            <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div className="font-bold text-primary" style={{ fontSize: '24px' }}>৳{vehicle.hourlyRate}</div>
                <div className="text-sm text-muted">hourly rate</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-error" style={{ fontSize: '18px' }}>+ ৳{vehicle.wearTearRate}</div>
                <div className="text-sm text-muted">wear & tear / hr</div>
              </div>
            </div>
            
            <div className="flex-col gap-2 mb-6">
              <label className="font-semibold text-sm">Estimated Duration</label>
              <div className="flex items-center justify-between p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-2 text-muted"><Clock size={20} /> Hours needed</div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setHours(Math.max(1, hours - 1))} className="btn btn-outline" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}>-</button>
                  <span className="font-bold">{hours}h</span>
                  <button onClick={() => setHours(hours + 1)} className="btn btn-outline" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}>+</button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="font-semibold">Total Estimated Fare</div>
              <div className="font-bold text-primary" style={{ fontSize: '24px' }}>৳{estimatedFare}</div>
            </div>

            <button className="btn btn-primary" onClick={handleBook}>
              {vehicle.autoAccept ? 'Instant Book' : 'Request to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
