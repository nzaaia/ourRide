import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function CreateListing() {
  const { addListing, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    vehicleName: '',
    location: '',
    hourlyRate: 150,
    wearTearRate: 20,
    autoAccept: false,
    image: '',
    exactLocation: null
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData({
          ...formData,
          location: 'Current Location',
          exactLocation: { lat: latitude, lng: longitude, address: 'Current Location' }
        });
        setLocating(false);
        toast.success('Location found', 'Your current location has been set.');
      },
      (err) => {
        setLocating(false);
        toast.error('Location error', 'Please allow location access.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleName || !formData.location || !formData.image) {
      toast.error('Missing fields', 'Please fill in all required fields and upload an image.');
      return;
    }
    
    setLoading(true);
    try {
      const newListing = {
        id: `v_${Date.now()}`,
        ownerId: user?.id,
        ownerName: user?.name,
        ownerAvatar: user?.avatar,
        vehicleName: formData.vehicleName,
        location: formData.location,
        exactLocation: formData.exactLocation,
        hourlyRate: Number(formData.hourlyRate),
        wearTearRate: Number(formData.wearTearRate),
        autoAccept: formData.autoAccept,
        image: formData.image,
        description: 'Newly listed vehicle.',
        status: 'available',
        isAvailable: true,
        createdAt: new Date().toISOString(),
      };
      addListing(newListing);
      toast.success('Bike listed!', 'Your bike is now available for rent.');
      navigate('/owner/bikes');
    } catch (err) {
      toast.error('Error', 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <h2 style={{ marginBottom: 0 }}>List a Bike</h2>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Bike Photo *</label>
            <div style={{
              border: '2px dashed var(--border-color)', borderRadius: 12, padding: formData.image ? 0 : 32,
              textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }}>
              {formData.image ? (
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
              ) : (
                <>
                  <Camera size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                  <div className="text-muted text-sm">Tap to upload picture</div>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Vehicle Name *</label>
            <input type="text" className="input" placeholder="e.g. Yamaha R15 V3" value={formData.vehicleName} onChange={e => setFormData({ ...formData, vehicleName: e.target.value })} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Pickup Location *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" className="input" style={{ flex: 1 }} placeholder="e.g. Gate B, BUET" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
              <button type="button" className="btn btn-outline" style={{ width: 'auto', padding: '0 16px' }} onClick={getLocation} disabled={locating}>
                {locating ? <Loader2 size={18} className="spin" /> : <MapPin size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Hourly Rate (৳) *</label>
              <input type="number" className="input" value={formData.hourlyRate} onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} required min="0" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Wear & Tear/hr (৳) *</label>
              <input type="number" className="input" value={formData.wearTearRate} onChange={e => setFormData({ ...formData, wearTearRate: e.target.value })} required min="0" />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginTop: 8, padding: 16, background: 'var(--bg-color)', borderRadius: 12 }}>
            <input type="checkbox" style={{ width: 20, height: 20, accentColor: 'var(--primary)' }} checked={formData.autoAccept} onChange={e => setFormData({ ...formData, autoAccept: e.target.checked })} />
            <div>
              <div style={{ fontWeight: 600 }}>Auto-accept Bookings</div>
              <div className="text-muted text-sm">Automatically approve requests</div>
            </div>
          </label>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <Loader2 size={20} className="spin" /> : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
