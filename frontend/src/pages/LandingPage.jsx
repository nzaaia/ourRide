import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, Users, Star, ArrowRight, CheckCircle, MessageCircle, MapPin } from 'lucide-react';

const BIKE_IMAGES = [
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, data } = useAuth();

  const goBook = () => { login('renter'); navigate('/renter/browse'); };
  const goRide = () => { login('passenger'); navigate('/passenger/search'); };
  const goList = () => { login('owner'); navigate('/owner/dashboard'); };

  const availableBikes = data.listings.filter(l => l.isAvailable);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)' }}>

      {/* === HERO === */}
      <div style={{
        background: 'linear-gradient(135deg, #004d23 0%, #00B14F 60%, #00d563 100%)',
        color: 'white',
        padding: '80px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div className="flex justify-center" style={{ marginBottom: 20 }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 18px', borderRadius: 999, fontSize: 14, fontWeight: 600 }}>
              🎓 Built for university students
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 20 }}>
            Your campus. <br />Your ride. <em style={{ fontStyle: 'normal', opacity: 0.9 }}>Your terms.</em>
          </h1>
          <p style={{ fontSize: 20, opacity: 0.88, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7 }}>
            OurBike makes it effortless to rent a scooter, find a ride, or earn money from your bike — all on campus.
          </p>

          {/* 3 main CTAs */}
          <div className="flex justify-center" style={{ gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={goBook}
              style={{
                background: 'white',
                color: 'var(--primary)',
                padding: '16px 32px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 17,
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer', border: 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
            >
              <Bike size={22} /> Book a Vehicle
            </button>
            <button
              onClick={goRide}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 17,
                border: '2px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <MapPin size={22} /> Look for a Ride
            </button>
            <button
              onClick={goList}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 17,
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              💰 List & Start Earning
            </button>
          </div>
        </div>
      </div>

      {/* Floating stat bar */}
      <div style={{
        background: 'white',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        borderRadius: 16,
        maxWidth: 800,
        margin: '-36px auto 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>
        {[
          { number: `${availableBikes.length}+`, label: 'Bikes Available Now' },
          { number: '4.8★', label: 'Average Owner Rating' },
          { number: '৳120', label: 'Avg. Rate / Hour' }
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '24px',
            textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border-color)' : 'none'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>{stat.number}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>

        {/* === HOW IT WORKS - 3 tabs === */}
        <HowItWorks goBook={goBook} goRide={goRide} goList={goList} />

        {/* === FEATURED BIKES === */}
        <div style={{ marginBottom: 80 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
            <div>
              <h2 style={{ marginBottom: 8 }}>Available on Campus</h2>
              <p className="text-muted" style={{ marginBottom: 0 }}>Top-rated scooters ready to ride — no waiting required.</p>
            </div>
            <button
              className="btn btn-outline"
              style={{ width: 'auto' }}
              onClick={() => navigate('/renter/browse')}
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="cards-grid">
            {availableBikes.slice(0, 3).map(bike => (
              <div key={bike.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={bike.image} alt={bike.vehicleName} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'white', padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                    ৳{bike.hourlyRate}/hr
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: 6, fontSize: 19 }}>{bike.vehicleName}</h3>
                  <div className="flex items-center gap-2 text-muted text-sm" style={{ marginBottom: 16 }}>
                    <MapPin size={14} /> {bike.location}
                  </div>
                  <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                    <div className="flex items-center gap-2">
                      <img src={bike.ownerAvatar} alt={bike.ownerName} className="avatar" style={{ width: 28, height: 28 }} />
                      <span className="text-sm font-semibold">{bike.ownerName}</span>
                    </div>
                    <span className="text-sm stars font-semibold">★ {bike.rating}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={goBook}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === LIST YOUR BIKE BANNER === */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1d23 0%, #2d3748 100%)',
          borderRadius: 24,
          padding: '56px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 40,
          alignItems: 'center',
          marginBottom: 80
        }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>FOR BIKE OWNERS</div>
            <h2 style={{ color: 'white', marginBottom: 16, fontSize: 32 }}>Your scooter earns while you study.</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 32, maxWidth: 480, lineHeight: 1.7 }}>
              List your bike on OurBike for free. Set your own hours, rates, and accept renters on your terms.
              Students on campus are looking for bikes right now.
            </p>
            <div className="flex" style={{ gap: 16, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={goList}>
                <Bike size={20} /> Start Earning Today
              </button>
              <div className="flex items-center gap-2" style={{ color: '#9CA3AF', fontSize: 14 }}>
                <CheckCircle size={16} color="var(--primary)" /> Free to list
              </div>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1558981001-1995369a3906?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt="Earn with your scooter"
            style={{ width: 260, height: 200, objectFit: 'cover', borderRadius: 16, flexShrink: 0 }}
          />
        </div>

        {/* === TRUST FEATURES === */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ marginBottom: 12 }}>Safe, secure, and student-friendly</h2>
          <p className="text-muted" style={{ maxWidth: 500, margin: '0 auto 48px' }}>Everything you need to ride or earn with total peace of mind.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '🔐', title: 'Verified Profiles', desc: 'Every user is verified through campus ID verification.' },
              { icon: '⭐', title: 'Two-Way Ratings', desc: 'Owners and renters rate each other to build trust.' },
              { icon: '💬', title: 'In-App Messaging', desc: 'Coordinate pickups through our secure in-app chat.' },
              { icon: '💳', title: 'Transparent Pricing', desc: 'See total fare before booking — no hidden charges.' },
            ].map((f, i) => (
              <div key={i} className="card text-center" style={{ padding: 32 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
                <p className="text-muted text-sm" style={{ marginBottom: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function HowItWorks({ goBook, goRide, goList }) {
  const [activeTab, setActiveTab] = useState('renter');
  const { useState: useLocalState } = { useState };

  const tabs = [
    { id: 'renter', label: '🏍️ Rent a Bike', color: 'var(--primary)' },
    { id: 'passenger', label: '📍 Find a Ride', color: '#3B82F6' },
    { id: 'owner', label: '💰 List & Earn', color: '#8B5CF6' },
  ];

  const flows = {
    renter: {
      steps: [
        { icon: '🔍', title: 'Browse Available Bikes', desc: 'See all bikes currently available on campus with photos, ratings, and pricing.' },
        { icon: '📋', title: 'Book Instantly', desc: 'Select your duration, review the total fare (including wear & tear), and book in one tap.' },
        { icon: '🏍️', title: 'Pick Up & Ride', desc: 'Meet the owner at the pickup point. Chat or call them through the app to coordinate.' },
        { icon: '⭐', title: 'Return & Rate', desc: 'Return the bike on time and leave a rating for the owner. Simple as that!' },
      ],
      cta: { label: 'Browse Bikes Now', action: goBook }
    },
    passenger: {
      steps: [
        { icon: '📍', title: 'Enter Your Route', desc: 'Enter where you are and where you want to go. The app shows you an estimated fare.' },
        { icon: '🔔', title: 'Renters See Your Request', desc: 'Renters currently on bikes see your request. They can accept at your price or make a counter offer.' },
        { icon: '💬', title: 'Negotiate the Fare', desc: 'If a renter offers a different price, you can accept or decline their counter offer.' },
        { icon: '🏁', title: 'Ride Begins', desc: 'Once you agree, the renter picks you up. Chat via the app and enjoy your ride!' },
      ],
      cta: { label: 'Find a Ride Now', action: goRide }
    },
    owner: {
      steps: [
        { icon: '📸', title: 'List Your Bike', desc: 'Add photos, set your hourly rate, wear & tear charge, and availability schedule.' },
        { icon: '⚙️', title: 'Set Your Preferences', desc: 'Enable auto-accept for instant bookings, or review each request manually.' },
        { icon: '✅', title: 'Accept & Handover', desc: 'When you accept a booking, message the renter to coordinate the handover.' },
        { icon: '💰', title: 'Track Your Earnings', desc: 'Monitor earnings with charts, withdraw funds, and view detailed booking history.' },
      ],
      cta: { label: 'List Your Bike', action: goList }
    }
  };

  return (
    <div style={{ marginBottom: 80 }}>
      <div className="text-center section-header">
        <h2>How OurBike Works</h2>
        <p className="text-muted">Pick your role and see exactly how it works for you.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 12, padding: 6, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                background: activeTab === tab.id ? tab.color : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
        {flows[activeTab].steps.map((step, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: 16,
            padding: '28px 24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{step.icon}</div>
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 13, fontWeight: 700, color: 'var(--text-light)', fontFamily: 'monospace' }}>
              0{i + 1}
            </div>
            <h4 style={{ marginBottom: 8 }}>{step.title}</h4>
            <p className="text-muted text-sm" style={{ marginBottom: 0, lineHeight: 1.7 }}>{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="btn btn-primary btn-lg" onClick={flows[activeTab].cta.action}>
          {flows[activeTab].cta.label} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// Need to import useState at top for HowItWorks
import { useState } from 'react';
