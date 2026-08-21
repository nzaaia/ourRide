import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import './CreateListing.css';

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
    <div className="create-listing">
      <div className="flex items-center gap-4 create-listing__header">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <h2 className="create-listing__title">List a Bike</h2>
      </div>

      <div className="card create-listing__card">
        <form onSubmit={handleSubmit} className="create-listing__form">

          <div>
            <label className="create-listing__label">Bike Photo *</label>
            <div className={`create-listing__photo-zone${formData.image ? '' : ' create-listing__photo-zone--empty'}`}>
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="create-listing__photo-preview" />
              ) : (
                <>
                  <Camera size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                  <div className="text-muted text-sm">Tap to upload picture</div>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="create-listing__photo-input" />
            </div>
          </div>

          <div>
            <label className="create-listing__label">Vehicle Name *</label>
            <input type="text" className="input" placeholder="e.g. Yamaha R15 V3" value={formData.vehicleName} onChange={e => setFormData({ ...formData, vehicleName: e.target.value })} required />
          </div>

          <div>
            <label className="create-listing__label">Pickup Location *</label>
            <div className="create-listing__location-row">
              <input type="text" className="input create-listing__location-input" placeholder="e.g. Gate B, BUET" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
              <button type="button" className="btn btn-outline create-listing__location-btn" onClick={getLocation} disabled={locating}>
                {locating ? <Loader2 size={18} className="spin" /> : <MapPin size={18} />}
              </button>
            </div>
          </div>

          <div className="create-listing__rate-grid">
            <div>
              <label className="create-listing__label">Hourly Rate (৳) *</label>
              <input type="number" className="input" value={formData.hourlyRate} onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} required min="0" />
            </div>
            <div>
              <label className="create-listing__label">Wear &amp; Tear/hr (৳) *</label>
              <input type="number" className="input" value={formData.wearTearRate} onChange={e => setFormData({ ...formData, wearTearRate: e.target.value })} required min="0" />
            </div>
          </div>

          <label className="create-listing__auto-accept">
            <input type="checkbox" className="create-listing__auto-accept-checkbox" checked={formData.autoAccept} onChange={e => setFormData({ ...formData, autoAccept: e.target.checked })} />
            <div>
              <div className="create-listing__auto-accept-title">Auto-accept Bookings</div>
              <div className="text-muted text-sm">Automatically approve requests</div>
            </div>
          </label>

          <button type="submit" className="btn btn-primary btn-lg create-listing__submit-btn" disabled={loading}>
            {loading ? <Loader2 size={20} className="spin" /> : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}