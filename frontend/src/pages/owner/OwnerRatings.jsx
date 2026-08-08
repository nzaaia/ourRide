import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';

export default function OwnerRatings() {
  const { data } = useAuth();
  const navigate = useNavigate();
  const ratings = data.pastRatings || [];
  const avg = data.userRating;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ width: 'auto' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <h2 style={{ marginBottom: 0 }}>Vehicle Ratings</h2>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '32px 40px', marginBottom: 32, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
        <div className="text-center">
          <div style={{ fontSize: 64, fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{avg}</div>
          <div className="stars" style={{ fontSize: 22, marginTop: 4 }}>★★★★★</div>
          <div className="text-muted text-sm" style={{ marginTop: 4 }}>out of 5.0</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Based on {ratings.length} reviews</div>
          <p className="text-muted" style={{ marginBottom: 0 }}>Ratings left by renters after each completed rental.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ratings.map((r) => (
          <div key={r.id} className="card" style={{ padding: '20px 24px' }}>
            <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.renter} className="avatar" style={{ width: 44, height: 44 }} />
                <div>
                  <div className="font-semibold">{r.renter}</div>
                  <div className="text-muted text-sm">{r.vehicle} · {r.date}</div>
                </div>
              </div>
              <div className="stars font-bold text-lg">{'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}</div>
            </div>
            {r.comment && <p className="text-muted" style={{ marginBottom: 0, fontStyle: 'italic' }}>"{r.comment}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
