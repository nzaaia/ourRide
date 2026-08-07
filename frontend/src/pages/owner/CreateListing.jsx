import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

export default function CreateListing() {
  const { user, addListing } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleName: '',
    make: '',
    model: '',
    regNumber: '',
    hourlyRate: '',
    wearTearRate: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      id: `v${Math.floor(Math.random() * 1000)}`,
      ownerId: user.id,
      ...formData,
      hourlyRate: Number(formData.hourlyRate),
      wearTearRate: Number(formData.wearTearRate),
      isAvailable: true,
      autoAccept: false,
      maxRadiusKm: 10,
      rating: 0,
      ownerName: user.name,
      ownerAvatar: user.avatar,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Newly listed vehicle.',
      status: 'available'
    };
    
    addListing(newListing);
    alert('Listing created successfully!');
    navigate('/owner/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-6)' }}>Create New Listing</h2>
      
      <form onSubmit={handleSubmit} className="flex-col gap-4 card">
        <div className="flex-col items-center justify-center" style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', backgroundColor: 'var(--bg-color)', cursor: 'pointer', marginBottom: 'var(--space-4)' }}>
          <ImagePlus size={48} color="var(--text-muted)" />
          <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>Upload up to 5 photos</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm">Vehicle Name</label>
            <input required type="text" placeholder="e.g. Yamaha R15" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})} />
          </div>
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm">Make</label>
            <input required type="text" placeholder="e.g. Yamaha" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm">Model</label>
            <input required type="text" placeholder="e.g. R15 V3" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm">Registration Number</label>
            <input required type="text" placeholder="e.g. DHA-LA-11" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value})} />
          </div>
        </div>
        
        <div className="flex-col">
          <label className="font-semibold text-sm">Pickup Location</label>
          <input required type="text" placeholder="e.g. Banani, Dhaka" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>

        <div className="flex gap-4">
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm">Hourly Rate (৳)</label>
            <input required type="number" placeholder="150" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} />
          </div>
          <div className="flex-col" style={{ flex: 1 }}>
            <label className="font-semibold text-sm">Wear & Tear Charge (৳/hr)</label>
            <input required type="number" placeholder="20" className="input" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              value={formData.wearTearRate} onChange={e => setFormData({...formData, wearTearRate: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Create Listing</button>
      </form>
    </div>
  );
}
