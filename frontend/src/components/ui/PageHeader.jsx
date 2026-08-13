import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PageHeader({ title, back, subtitle, action }) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      {back && (
        <button className="header-back" onClick={() => (typeof back === 'function' ? back() : back === true ? navigate(-1) : navigate(back))} aria-label="Go back">
          <ChevronLeft size={20} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ marginBottom: subtitle ? 2 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </h2>
        {subtitle && <p className="text-muted text-sm" style={{ marginBottom: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
