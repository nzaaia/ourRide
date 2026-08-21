import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './ui-components.css';

export default function PageHeader({ title, back, subtitle, action }) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      {back && (
        <button className="header-back" onClick={() => (typeof back === 'function' ? back() : back === true ? navigate(-1) : navigate(back))} aria-label="Go back">
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="page-header__content">
        <h2 className={`page-header__title ${subtitle ? 'page-header__title--with-subtitle' : 'page-header__title--no-subtitle'}`}>
          {title}
        </h2>
        {subtitle && <p className="text-muted text-sm page-header__subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
