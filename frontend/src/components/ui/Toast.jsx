import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback(({ type = 'success', title, desc, duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, desc }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const toast = useCallback((opts) => push(opts), [push]);
  toast.success = (title, desc) => push({ type: 'success', title, desc });
  toast.error = (title, desc) => push({ type: 'error', title, desc });
  toast.info = (title, desc) => push({ type: 'info', title, desc });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-viewport">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <div className="toast-icon">
              {t.type === 'success' ? <CheckCircle2 size={15} /> :
               t.type === 'error' ? <XCircle size={15} /> : <Info size={15} />}
            </div>
            <div>
              {t.title && <div className="toast-title">{t.title}</div>}
              {t.desc && <div className="toast-desc">{t.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
