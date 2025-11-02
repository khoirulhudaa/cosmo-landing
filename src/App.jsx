import '@google/model-viewer';
import { useRef, useEffect } from 'react';

const App = () => {
  const modelViewerRef = useRef(null);

  const startAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleStatus = (e) => {
      console.log('AR Status:', e.detail.status);
      if (e.detail.status === 'session-started') {
        console.log('AR aktif! Arahkan ke lantai.');
      }
    };

    viewer.addEventListener('ar-status', handleStatus);
    return () => viewer.removeEventListener('ar-status', handleStatus);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button
        onClick={startAR}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        Mulai AR
      </button>

      <model-viewer
        ref={modelViewerRef}
        src="https://vr.kiraproject.id/models/product-sample.glb"
        ios-src="https://vr.kiraproject.id/models/product-sample.usdz" // WAJIB untuk iOS
        alt="Model 3D AR"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
        }}
      >
        {/* Optional: loading indicator */}
        <div slot="poster" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#ccc',
          color: '#000',
          fontSize: '18px',
        }}>
          Loading 3D Model...
        </div>
      </model-viewer>
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
