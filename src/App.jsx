import { useRef, useState, useEffect } from 'react';
import '@google/model-viewer';

const App = () => {
  const modelViewerRef = useRef(null);
  const [arSupported, setArSupported] = useState(false);
  const [arStatus, setArStatus] = useState('unknown');

  const startAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    // Cek support AR modes
    if ('xr' in window.navigator || viewer.arModes?.includes('webxr')) {
      setArSupported(true);
    }

    // Event listener untuk status
    const handleARStatus = (e) => {
      setArStatus(e.detail.status);
      console.log('AR Status:', e.detail.status);
      if (e.detail.status === 'sessionStarted') {
        console.log('AR dimulai!');
      } else if (e.detail.status === 'notPresenting') {
        // Fallback jika gagal
        alert('AR tidak support di device ini. Gunakan mode 3D biasa atau coba di HP lain.');
      }
    };
    viewer.addEventListener('ar-status', handleARStatus);

    return () => viewer.removeEventListener('ar-status', handleARStatus);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {arSupported ? (
        <button
          onClick={startAR}
          disabled={arStatus !== 'unknown'}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            padding: '12px 16px',
            background: arStatus === 'sessionStarted' ? 'green' : 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {arStatus === 'sessionStarted' ? 'AR Aktif' : 'Mulai AR'}
        </button>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            padding: '12px 16px',
            background: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '8px',
          }}
        >
          AR tidak support di HP ini. Gunakan mode 3D!
        </div>
      )}

      <model-viewer
        ref={modelViewerRef}
        src="/astronaut.glb"
        // ios-src="https://vr.kiraproject.id/models/product-sample.usdz"
        alt="Model 3D AR"
        ar
        ar-modes="webxr quick-look"  // Prioritas WebXR
        ar-scale="auto"
        ar-placement="floor"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}
      />
    </div>
  );
};

export default App;


// import { Box } from 'lucide-react';
// import { useState } from 'react';
// import ARViewer from './arViewer';
// import ModelSelector from './modelUploader';

// function App() {
//   const [modelUrl, setModelUrl] = useState('');
//   const [showAR, setShowAR] = useState(false);

//   const handleModelSelect = (url) => {
//     setModelUrl(url);
//     setShowAR(true);
//   };

//   const handleBack = () => {
//     setShowAR(false);
//     setModelUrl('');
//   };

//   if (showAR && modelUrl) {
//     return <ARViewer modelUrl={modelUrl} onBack={handleBack} />;
//   }

//   return (
//     <div className="min-h-screen overflow-auto bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center mb-4">
//             <Box size={56} className="text-blue-600" />
//           </div>
//           <h1 className="text-5xl font-bold text-gray-900 mb-3">
//             AR Viewer 3D
//           </h1>
//           <p className="text-lg text-gray-600">
//             Lihat model 3D dalam Augmented Reality secara real-time
//           </p>
//         </div>

//         <ModelSelector onModelSelect={handleModelSelect} />
//       </div>
//     </div>
//   );
// }

// export default App;
