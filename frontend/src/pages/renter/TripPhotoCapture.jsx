import { useRef, useState, useCallback } from 'react';
import { Camera, CheckCircle, RefreshCw, AlertTriangle, X, Flag, Image } from 'lucide-react';

/**
 * TripPhotoCapture
 * Props:
 *   phase: 'before' | 'after'
 *   onCapture: (dataUrl) => void
 *   onCancel: () => void
 */
export default function TripPhotoCapture({ phase, onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [step, setStep] = useState('start'); // start | camera | preview | done
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStep('camera');
    } catch (err) {
      setError('Camera access denied or not available. Please allow camera access in your browser settings.');
    }
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    setStep('preview');
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    setStep('done');
    onCapture(capturedImage);
  };

  const cancel = () => {
    stopCamera();
    onCancel();
  };

  const isBefore = phase === 'before';
  const phaseColor = isBefore ? '#3B82F6' : '#10B981';
  const phaseLabel = isBefore ? 'Before Photo' : 'After Photo';
  const phaseDesc = isBefore
    ? 'Take a photo of the bike before starting your ride to document its condition.'
    : 'Take a photo of the returned bike to confirm its condition and complete your trip.';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        background: 'white', borderRadius: 24, overflow: 'hidden',
        width: '100%', maxWidth: 540,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{ background: phaseColor, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: 2 }}>STEP REQUIRED</div>
            <h3 style={{ color: 'white', margin: 0 }}>{phaseLabel}</h3>
          </div>
          <button onClick={cancel} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* === START STEP === */}
          {step === 'start' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                {isBefore
                  ? <Camera size={56} color="var(--primary)" />
                  : <Flag size={56} color="var(--primary)" />}
              </div>
              <h3 style={{ marginBottom: 8 }}>{phaseLabel} Required</h3>
              <p className="text-muted" style={{ marginBottom: 8 }}>{phaseDesc}</p>

              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                background: '#FEF3C7', borderRadius: 12, marginBottom: 28, textAlign: 'left'
              }}>
                <AlertTriangle size={18} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>
                  You must use your device's camera. Pre-saved photos from your gallery are not accepted.
                  Your camera will open directly when you click below.
                </div>
              </div>

              {error && (
                <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 16 }}
                onClick={startCamera}
              >
                <Camera size={20} /> Open Camera
              </button>
            </div>
          )}

          {/* === CAMERA STEP === */}
          {step === 'camera' && (
            <div>
              <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 20, background: '#000', position: 'relative' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', display: 'block', maxHeight: 340, objectFit: 'cover' }}
                />
                {/* Viewfinder overlay */}
                <div style={{
                  position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: 16, pointerEvents: 'none'
                }} />
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
                <button className="btn btn-outline" onClick={cancel}>Cancel</button>
                <button
                  onClick={capturePhoto}
                  style={{
                    width: 70, height: 70, borderRadius: '50%',
                    background: phaseColor, border: `4px solid white`,
                    boxShadow: `0 0 0 3px ${phaseColor}`, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', transition: 'transform 0.1s'
                  }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)'; }}
                  onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <Camera size={28} />
                </button>
                <div />
              </div>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 14 }}>
                Point camera at the bike and press the button
              </p>
            </div>
          )}

          {/* === PREVIEW STEP === */}
          {step === 'preview' && capturedImage && (
            <div>
              <img
                src={capturedImage}
                alt="Captured"
                style={{ width: '100%', borderRadius: 14, marginBottom: 20, maxHeight: 340, objectFit: 'cover' }}
              />
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: 20 }}>
                Does this photo clearly show the bike's condition?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button className="btn btn-outline" onClick={retake} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <RefreshCw size={16} /> Retake
                </button>
                <button className="btn btn-primary" onClick={confirm} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <CheckCircle size={16} /> Use This Photo
                </button>
              </div>
            </div>
          )}

          {/* === DONE STEP === */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <CheckCircle size={56} color={phaseColor} />
              </div>
              <h3 style={{ color: phaseColor, marginBottom: 8 }}>Photo Submitted!</h3>
              <p className="text-muted">Your {phaseLabel.toLowerCase()} has been recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
