// import { useGLTF } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import { Suspense, useEffect, useRef } from 'react';
// import './App.css';

// function Model({ rotation }) {
//   const { scene } = useGLTF('https://vr.kiraproject.id/models/box-sample.glb'); // Pastikan di public/
//   return <primitive object={scene} scale={1.5} position={[0, -1, -3]} rotation={rotation} />;
// }

// function ARScene() {
//   const modelRef = useRef();
//   const initialAlpha = useRef(null);

//   useEffect(() => {
//     const handleOrientation = (event) => {
//       if (!modelRef.current) return;

//       const { alpha, beta, gamma } = event;

//       // Kalibrasi pertama kali
//       if (initialAlpha.current === null && alpha !== null) {
//         initialAlpha.current = alpha;
//       }

//       if (initialAlpha.current === null) return;

//       // Hitung rotasi relatif dari posisi awal
//       const relAlpha = ((alpha - initialAlpha.current) * Math.PI) / 180;
//       const relBeta = (beta * Math.PI) / 180;
//       const relGamma = (gamma * Math.PI) / 180;

//       // Terapkan rotasi ke model (Y untuk putar horizontal, X untuk miring)
//       modelRef.current.rotation.y = -relAlpha;
//       modelRef.current.rotation.x = -relBeta;
//       modelRef.current.rotation.z = -relGamma;
//     };

//     // Minta izin iOS (wajib)
//     if (typeof DeviceOrientationEvent.requestPermission === 'function') {
//       DeviceOrientationEvent.requestPermission()
//         .then((response) => {
//           if (response === 'granted') {
//             window.addEventListener('deviceorientation', handleOrientation);
//           }
//         })
//         .catch(console.error);
//     } else {
//       // Android & browser lain
//       window.addEventListener('deviceorientation', handleOrientation);
//     }

//     return () => {
//       window.removeEventListener('deviceorientation', handleOrientation);
//     };
//   }, []);

//   return (
//     <group ref={modelRef}>
//       <Model rotation={[0, 0, 0]} />
//     </group>
//   );
// }

// export default function App() {
//   const videoRef = useRef(null);

//   // Kamera belakang
//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: 'environment',
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (err) {
//         console.error('Kamera error:', err);
//       }
//     };
//     startCamera();
//   }, []);

//   return (
//     <div className="app-container">
//       <video ref={videoRef} className="video-background" playsInline muted />

//       <Canvas
//         camera={{ position: [0, 0, 0], fov: 60 }}
//         style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
//       >
//         <Suspense fallback={null}>
//           <ambientLight intensity={1} />
//           <directionalLight position={[5, 5, 5]} intensity={1.5} />
//           <ARScene />
//           {/* Hapus OrbitControls agar tidak bisa sentuh */}
//         </Suspense>
//       </Canvas>

//       {/* Tombol kalibrasi ulang (opsional) */}
//       <button
//         onClick={() => {
//           initialAlpha.current = null;
//           alert('Kalibrasi ulang! Arahkan HP ke depan.');
//         }}
//         style={{
//           position: 'absolute',
//           bottom: 50,
//           left: '50%',
//           transform: 'translateX(-50%)',
//           zIndex: 10,
//           padding: '10px 20px',
//           background: 'rgba(0,0,0,0.7)',
//           color: 'white',
//           border: 'none',
//           borderRadius: 8,
//         }}
//       >
//         Reset Arah
//       </button>
//     </div>
//   );
// }
import { Box } from 'lucide-react';
import { useState } from 'react';
import ARViewer from './arViewer';
import ModelSelector from './modelUploader';

function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [showAR, setShowAR] = useState(false);

  const handleModelSelect = (url) => {
    setModelUrl(url);
    setShowAR(true);
  };

  const handleBack = () => {
    setShowAR(false);
    setModelUrl('');
  };

  if (showAR && modelUrl) {
    return <ARViewer modelUrl={modelUrl} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Box size={56} className="text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            AR Viewer 3D
          </h1>
          <p className="text-lg text-gray-600">
            Lihat model 3D dalam Augmented Reality secara real-time
          </p>
        </div>

        <ModelSelector onModelSelect={handleModelSelect} />
      </div>
    </div>
  );
}

export default App;
