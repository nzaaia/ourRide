import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    if (isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || dismissed) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 12px)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 950,
      width: 'min(92vw, 420px)',
      background: 'var(--surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 14px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <img src="/icons/icon-192.png" alt="" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Install OurRide</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add to home screen for the full app experience.</div>
      </div>
      <button
        onClick={handleInstall}
        className="btn btn-primary btn-sm"
        style={{ width: 'auto', flexShrink: 0 }}
      >
        <Download size={15} /> Install
      </button>
      <button
        onClick={() => { setVisible(false); setDismissed(true); }}
        aria-label="Dismiss"
        style={{ color: 'var(--text-muted)', flexShrink: 0, padding: 4 }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
