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
    if (!user) {
      alert("Please log in to book a vehicle");
      return;
    }
    
    // Instant booking mock flow
    startRental(vehicle, hours);
    alert(`Booking confirmed automatically! Total Fare: ৳${estimatedFare}`);
    navigate('/renter/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline flex items-center gap-2 mb-6" style={{ width: 'auto', padding: '8px 16px', marginTop: 'var(--space-6)' }}>
        <ChevronLeft size={20} /> Back to Search
      </button>
      
      {/* Hero Header Layout */}
      <div style={{ position: 'relative', marginBottom: 'var(--space-8)' }}>
        <img src={vehicle.image} alt={vehicle.model} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '16px 24px', borderRadius: 'var(--radius-md)' }}>
            <h1 style={{ margin: 0, fontSize: '32px', color: 'white' }}>{vehicle.vehicleName}</h1>
            <div className="flex items-center gap-2 mt-2" style={{ color: '#ccc' }}>
              <MapPin size={18} />
              <span>University Campus</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
        <div>
          <div className="card flex items-center gap-4 mb-8" style={{ padding: 'var(--space-4)', border: 'none', backgroundColor: 'var(--bg-color)' }}>
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

          <h3 style={{ marginBottom: 'var(--space-4)' }}>About this bike</h3>
          <p className="text-muted" style={{ lineHeight: '1.6', fontSize: '16px' }}>{vehicle.description}</p>
        </div>

        <div>
          <div className="card sticky shadow-lg" style={{ top: '100px', padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Book this ride</h3>
            
            <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div className="font-bold text-primary" style={{ fontSize: '28px' }}>৳{vehicle.hourlyRate}</div>
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
                  <span className="font-bold text-lg">{hours}h</span>
                  <button onClick={() => setHours(hours + 1)} className="btn btn-outline" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}>+</button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="font-semibold" style={{ fontSize: '18px' }}>Total Fare</div>
              <div className="font-bold text-primary" style={{ fontSize: '28px' }}>৳{estimatedFare}</div>
            </div>

            <button className="btn btn-primary shadow-md" style={{ padding: '16px', fontSize: '18px' }} onClick={handleBook}>
              Instant Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
