import '@google/model-viewer';
import { useRef, useState, useEffect } from 'react';

const App = () => {
  const modelViewerRef = useRef(null);
  const [arSupported, setArSupported] = useState(false);
  const [arStatus, setArStatus] = useState('unknown');
  const [loadError, setLoadError] = useState(false);

  const startAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    // Deteksi AR support (khusus untuk WebXR di Android/Redmi)
    const hasWebXR = 'xr' in navigator && navigator.xr.isSessionSupported('immersive-ar');
    const hasARModes = viewer.arModes && viewer.arModes.includes('webxr');
    setArSupported(hasWebXR || hasARModes);

    // Event listeners
    const handleARStatus = (e) => {
      setArStatus(e.detail.status);
      console.log('AR Status di Redmi:', e.detail.status);
      if (e.detail.status === 'sessionStarted') {
        console.log('AR aktif! Arahkan kamera ke lantai.');
      } else if (e.detail.status === 'notPresenting' || e.detail.status === 'failed') {
        setLoadError(true);
        alert('AR gagal di device ini. Coba update Chrome (versi 120+) atau gunakan mode 3D. Support WebXR di Redmi Note 12+!');
      }
    };

    const handleLoad = () => console.log('Model loaded!');
    const handleError = (e) => {
      console.error('Load error:', e);
      setLoadError(true);
    };
    const handleProgress = (e) => console.log('Progress:', Math.round(e.detail.totalProgress * 100) + '%');

    viewer.addEventListener('ar-status', handleARStatus);
    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);
    viewer.addEventListener('progress', handleProgress);

    return () => {
      viewer.removeEventListener('ar-status', handleARStatus);
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('progress', handleProgress);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* UI untuk AR Button atau Warning */}
      {arSupported ? (
        <button
          onClick={startAR}
          disabled={arStatus === 'sessionStarted' || arStatus === 'unknown'}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            padding: '12px 16px',
            background: arStatus === 'sessionStarted' ? '#4CAF50' : 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {arStatus === 'sessionStarted' ? 'AR Aktif di Redmi!' : 'Mulai AR (WebXR)'}
        </button>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            padding: '12px 16px',
            background: 'rgba(255, 165, 0, 0.9)', // Orange warning
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '80%',
          }}
        >
          AR tidak optimal di Redmi ini (cek ARCore di Play Store). Gunakan 3D mode atau update browser!
        </div>
      )}

      {/* Loading/Error Overlay */}
      {loadError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            padding: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          Error loading model. Cek koneksi atau URL GLB.
        </div>
      )}

      <model-viewer
        ref={modelViewerRef}
        src="/box-sample.glb"
        alt="Model 3D AR untuk Redmi"
        ar
        ar-modes="webxr quick-look" // Prioritas WebXR untuk Android/Redmi, Quick Look untuk iOS
        ar-scale="auto"
        ar-placement="floor"
        camera-controls // Selalu aktifkan untuk 3D fallback
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        loading="eager" // Load cepat
        crossorigin="anonymous" // Bantu CORS
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
        }}
      >
        {/* Poster untuk loading */}
        <div slot="poster" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '18px',
          flexDirection: 'column',
        }}>
          <p>Loading Model 3D...</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Kompatibel dengan Redmi Note 12+</p>
        </div>
      </model-viewer>
    </div>
  );
};

export default App;