import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bike, Users, Star, ArrowRight, CheckCircle2, MessageCircle, MapPin,
  ShieldCheck, BadgeCheck, CreditCard, ChevronRight,
} from 'lucide-react';

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
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>

      {/* === HERO === */}
      <div style={{
        background: 'linear-gradient(150deg, #0c3d24 0%, #0f5c34 55%, #00B14F 135%)',
        color: 'white',
        padding: '48px 20px 88px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: -0.5, marginBottom: 18 }}>OurRide</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.16)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
            <MapPin size={14} /> Built for university students
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 8vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 14 }}>
            Your campus. Your ride. Your terms.
          </h1>
          <p style={{ fontSize: 16, opacity: 0.88, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.65 }}>
            Rent a scooter by the hour, catch a ride, or earn from your own bike — all on campus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340, margin: '0 auto' }}>
            <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', width: '100%', padding: '14px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} onClick={goBook}>
              <Bike size={20} /> Book a Vehicle
            </button>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', width: '100%', border: '1.5px solid rgba(255,255,255,0.5)' }} onClick={goRide}>
              <MapPin size={20} /> Find a Ride
            </button>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', width: '100%', border: '1.5px solid rgba(255,255,255,0.25)' }} onClick={goList}>
              <Users size={20} /> List & Earn
            </button>
          </div>
        </div>
      </div>

      {/* Floating stat bar */}
      <div style={{
        background: '#fff', boxShadow: 'var(--shadow-md)', borderRadius: 16,
        maxWidth: 560, margin: '-36px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden', position: 'relative', zIndex: 10,
      }}>
        {[
          { number: `${availableBikes.length}+`, label: 'Bikes Available Now' },
          { number: '৳120', label: 'Avg. Rate / Hour' },
        ].map((stat, i) => (
          <div key={i} style={{ padding: '18px 12px', textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--border-color)' : 'none' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)', marginBottom: 2 }}>{stat.number}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 16px 64px' }}>

        {/* HOW IT WORKS */}
        <HowItWorks goBook={goBook} goRide={goRide} goList={goList} />

        {/* FEATURED BIKES */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ marginBottom: 2 }}>Available on campus</h2>
              <p className="text-muted text-sm" style={{ marginBottom: 0 }}>Top-rated scooters ready to ride.</p>
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: 'auto', flexShrink: 0 }} onClick={() => navigate('/renter/browse')}>
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="cards-grid">
            {availableBikes.slice(0, 4).map(bike => (
              <div key={bike.id} className="bike-tile" onClick={goBook} style={{ cursor: 'pointer' }}>
                <div className="tile-media">
                  <img src={bike.image} alt={bike.vehicleName} loading="lazy" />
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(12,61,36,0.92)', color: '#fff', padding: '2px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    ৳{bike.hourlyRate}/hr
                  </div>
                </div>
                <div className="tile-body">
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{bike.vehicleName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 5px' }}>
                    <MapPin size={11} /> {bike.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" /> {bike.rating}
                    <span className="text-light" style={{ fontWeight: 500 }}>({bike.totalTrips})</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', minHeight: 38, padding: '8px 0' }} onClick={(e) => { e.stopPropagation(); goBook(); }}>
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIST YOUR BIKE */}
        <div style={{
          background: 'linear-gradient(150deg, #111827 0%, #2d3748 100%)',
          borderRadius: 20, padding: '32px 24px', marginBottom: 48,
        }}>
          <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 8, fontSize: 13 }}>FOR BIKE OWNERS</div>
          <h2 style={{ color: '#fff', marginBottom: 10 }}>Your scooter earns while you study.</h2>
          <p style={{ color: '#9CA3AF', marginBottom: 24, lineHeight: 1.7, fontSize: 14 }}>
            List your bike for free. Set your own hours and rates — students are looking for bikes right now.
          </p>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={goList}>
            <Bike size={20} /> Start Earning Today
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 13, marginTop: 14, justifyContent: 'center' }}>
            <CheckCircle2 size={15} color="var(--primary)" /> Free to list
          </div>
        </div>

        {/* TRUST */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ marginBottom: 6 }}>Safe, secure, student-friendly</h2>
          <p className="text-muted text-sm" style={{ maxWidth: 460, margin: '0 auto 28px' }}>Everything you need to ride or earn with peace of mind.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: <ShieldCheck size={22} />, title: 'Verified Profiles', desc: 'Campus ID verification for every user.' },
              { icon: <Star size={22} />, title: 'Two-Way Ratings', desc: 'Owners and renters rate each other.' },
              { icon: <MessageCircle size={22} />, title: 'In-App Messaging', desc: 'Coordinate pickups safely in chat.' },
              { icon: <CreditCard size={22} />, title: 'Transparent Pricing', desc: 'Total fare before booking — no surprises.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 16, padding: '18px 14px', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  {f.icon}
                </div>
                <h4 style={{ marginBottom: 4, fontSize: 15 }}>{f.title}</h4>
                <p className="text-muted text-sm" style={{ marginBottom: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VERIFIED FOOTER CTA */}
        <button className="btn btn-hero btn-lg" style={{ width: '100%' }} onClick={goBook}>
          Get started <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function HowItWorks({ goBook, goRide, goList }) {
  const [activeTab, setActiveTab] = useState('renter');

  const tabs = [
    { id: 'renter', label: 'Rent', color: 'var(--primary)' },
    { id: 'passenger', label: 'Ride', color: '#3B82F6' },
    { id: 'owner', label: 'Earn', color: '#8B5CF6' },
  ];

  const flows = {
    renter: {
      icon: <Bike size={18} />,
      steps: [
        { title: 'Browse available bikes', desc: 'Photos, ratings, and hourly pricing across campus.' },
        { title: 'Book instantly', desc: 'Pick duration and see the full fare — including wear & tear.' },
        { title: 'Pick up & ride', desc: 'Exact location revealed on accept; chat to coordinate.' },
        { title: 'Return & rate', desc: 'Submit before/after photos, pay, and rate each other.' },
      ],
      cta: { label: 'Browse Bikes Now', action: goBook }
    },
    passenger: {
      icon: <MapPin size={18} />,
      steps: [
        { title: 'Enter your route', desc: 'Pickup and drop-off with an instant fare estimate.' },
        { title: 'Renters see your request', desc: 'Riders with active bikes can accept or counter-offer.' },
        { title: 'Negotiate the fare', desc: 'Accept or decline a rider\u2019s counter offer.' },
        { title: 'Ride begins', desc: 'Your rider picks you up — chat in-app along the way.' },
      ],
      cta: { label: 'Find a Ride Now', action: goRide }
    },
    owner: {
      icon: <BadgeCheck size={18} />,
      steps: [
        { title: 'List your bike', desc: 'Photos, hourly rate, wear & tear, and availability.' },
        { title: 'Set preferences', desc: 'Auto-accept for instant bookings, or review each request.' },
        { title: 'Accept & handover', desc: 'Approve the renter and coordinate the exchange.' },
        { title: 'Track earnings', desc: 'Monitor earnings and booking history in one place.' },
      ],
      cta: { label: 'List Your Bike', action: goList }
    }
  };

  const flow = flows[activeTab];

  return (
    <div style={{ marginBottom: 48 }}>
      <div className="text-center" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 2 }}>How OurRide works</h2>
        <p className="text-muted text-sm">Pick your role to see the flow.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 12, padding: 5, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                background: activeTab === tab.id ? tab.color : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 6, minHeight: 40,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {flow.steps.map((step, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{step.title}</div>
              <p className="text-muted text-sm" style={{ marginBottom: 0, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={flow.cta.action}>
        {flow.icon} {flow.cta.label} <ArrowRight size={17} />
      </button>
    </div>
  );
}
