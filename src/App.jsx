import '@google/model-viewer'; // Import web component
import { useRef } from 'react';

const App = () => {
  const modelViewerRef = useRef(null);

  // Fungsi untuk memulai AR session (opsional, bisa dipanggil via button)
  const startAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Tombol untuk memulai AR */}
      <button
        onClick={startAR}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Mulai AR
      </button>

      {/* Model Viewer Component */}
      <model-viewer
        ref={modelViewerRef}
        src="https://vr.kiraproject.id/models/product-sample.glb" // Ganti dengan path atau URL GLB kamu (misalnya: 'https://example.com/model.glb')
        alt="Model 3D AR"
        auto-rotate
        camera-controls
        ar // Aktifkan AR mode (menggunakan kamera belakang)
        ar-modes="webxr scene-viewer quick-look" // Dukung WebXR (universal), Scene Viewer (Android), Quick Look (iOS)
        ar-scale="auto" // Skala otomatis berdasarkan plane detection
        shadow-intensity="1"
        exposure="1"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#cccccc', // Background sementara saat loading
        }}
        // Event listener untuk AR ready (opsional)
        onarstatuschange={(event) => {
          console.log('AR Status:', event.detail.status);
          if (event.detail.status === 'sessionStarted') {
            console.log('AR dimulai! Arahkan kamera ke lantai kosong.');
          }
        }}
      ></model-viewer>
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
