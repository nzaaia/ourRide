import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bike, Users, Star, ArrowRight, CheckCircle2, MessageCircle, MapPin,
  ShieldCheck, BadgeCheck, CreditCard, ChevronRight,
} from 'lucide-react';
import './LandingPage.css';

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
    <div className="landing-page">

      {/* === HERO === */}
      <div className="landing-hero">
        <div className="landing-hero__orb-top" />
        <div className="landing-hero__orb-bottom" />

        <div className="landing-hero__inner">
          <div className="landing-hero__wordmark">OurRide</div>
          <div className="landing-hero__badge">
            <MapPin size={14} /> Built for university students
          </div>
          <h1 className="landing-hero__title">
            Your campus. Your ride. Your terms.
          </h1>
          <p className="landing-hero__subtitle">
            Rent a scooter by the hour, catch a ride, or earn from your own bike — all on campus.
          </p>

          <div className="landing-hero__cta-group">
            <button className="btn btn-lg landing-hero__btn-primary" onClick={goBook}>
              <Bike size={20} /> Book a Vehicle
            </button>
            <button className="btn btn-lg landing-hero__btn-secondary" onClick={goRide}>
              <MapPin size={20} /> Find a Ride
            </button>
            <button className="btn btn-lg landing-hero__btn-tertiary" onClick={goList}>
              <Users size={20} /> List &amp; Earn
            </button>
          </div>
        </div>
      </div>

      {/* Floating stat bar */}
      <div className="landing-stat-bar">
        {[
          { number: `${availableBikes.length}+`, label: 'Bikes Available Now' },
          { number: '৳120', label: 'Avg. Rate / Hour' },
        ].map((stat, i) => (
          <div key={i} className={`landing-stat-bar__item${i > 0 ? ' landing-stat-bar__item--bordered' : ''}`}>
            <div className="landing-stat-bar__number">{stat.number}</div>
            <div className="landing-stat-bar__label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="landing-content">

        {/* HOW IT WORKS */}
        <HowItWorks goBook={goBook} goRide={goRide} goList={goList} />

        {/* FEATURED BIKES */}
        <div className="landing-featured-bikes">
          <div className="landing-featured-bikes__header">
            <div>
              <h2 style={{ marginBottom: 2 }}>Available on campus</h2>
              <p className="text-muted text-sm">Top-rated scooters ready to ride.</p>
            </div>
            <button className="btn btn-outline btn-sm landing-featured-bikes__view-all" onClick={() => navigate('/renter/browse')}>
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="cards-grid">
            {availableBikes.slice(0, 4).map(bike => (
              <div key={bike.id} className="bike-tile card-clickable" onClick={goBook}>
                <div className="tile-media">
                  <img src={bike.image} alt={bike.vehicleName} loading="lazy" />
                  <div className="bike-tile-price-badge">
                    ৳{bike.hourlyRate}/hr
                  </div>
                </div>
                <div className="tile-body">
                  <div className="bike-tile-name">{bike.vehicleName}</div>
                  <div className="bike-tile-location">
                    <MapPin size={11} /> {bike.location}
                  </div>
                  <div className="bike-tile-rating">
                    <Star size={11} color="#F59E0B" fill="#F59E0B" /> {bike.rating}
                    <span className="text-light font-semibold">({bike.totalTrips})</span>
                  </div>
                  <button className="btn btn-primary bike-tile-book-btn" onClick={(e) => { e.stopPropagation(); goBook(); }}>
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIST YOUR BIKE */}
        <div className="landing-owner-promo">
          <div className="landing-owner-promo__label">FOR BIKE OWNERS</div>
          <h2 className="landing-owner-promo__title">Your scooter earns while you study.</h2>
          <p className="landing-owner-promo__desc">
            List your bike for free. Set your own hours and rates — students are looking for bikes right now.
          </p>
          <button className="btn btn-primary btn-lg landing-owner-promo__cta" onClick={goList}>
            <Bike size={20} /> Start Earning Today
          </button>
          <div className="landing-owner-promo__free-badge">
            <CheckCircle2 size={15} color="var(--primary)" /> Free to list
          </div>
        </div>

        {/* TRUST */}
        <div className="landing-trust">
          <h2 style={{ marginBottom: 6 }}>Safe, secure, student-friendly</h2>
          <p className="text-muted text-sm landing-trust__subtitle">Everything you need to ride or earn with peace of mind.</p>
          <div className="landing-trust__grid">
            {[
              { icon: <ShieldCheck size={22} />, title: 'Verified Profiles', desc: 'Campus ID verification for every user.' },
              { icon: <Star size={22} />, title: 'Two-Way Ratings', desc: 'Owners and renters rate each other.' },
              { icon: <MessageCircle size={22} />, title: 'In-App Messaging', desc: 'Coordinate pickups safely in chat.' },
              { icon: <CreditCard size={22} />, title: 'Transparent Pricing', desc: 'Total fare before booking — no surprises.' },
            ].map((f, i) => (
              <div key={i} className="landing-trust-card">
                <div className="landing-trust-card__icon">
                  {f.icon}
                </div>
                <h4 className="landing-trust-card__title">{f.title}</h4>
                <p className="text-muted text-sm landing-trust-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER CTA */}
        <button className="btn btn-hero btn-lg w-full" onClick={goBook}>
          Get started <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function HowItWorks({ goBook, goRide, goList }) {
  const [activeTab, setActiveTab] = useState('renter');

  const tabs = [
    { id: 'renter', label: 'Rent' },
    { id: 'passenger', label: 'Ride' },
    { id: 'owner', label: 'Earn' },
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
        { title: 'Negotiate the fare', desc: "Accept or decline a rider's counter offer." },
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
    <div className="how-it-works">
      <div className="how-it-works__header">
        <h2 className="how-it-works__header-title">How OurRide works</h2>
        <p className="text-muted text-sm">Pick your role to see the flow.</p>
      </div>

      <div className="how-it-works__tab-bar">
        <div className="how-it-works__tab-wrapper">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="how-it-works__tab-btn"
              data-active={activeTab === tab.id ? 'true' : 'false'}
              data-role={tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="how-it-works__steps">
        {flow.steps.map((step, i) => (
          <div key={i} className="how-it-works__step">
            <div className="how-it-works__step-num">
              {i + 1}
            </div>
            <div>
              <div className="how-it-works__step-title">{step.title}</div>
              <p className="text-muted text-sm how-it-works__step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg how-it-works__cta" onClick={flow.cta.action}>
        {flow.icon} {flow.cta.label} <ArrowRight size={17} />
      </button>
    </div>
  );
}