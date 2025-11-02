// import { useEffect, useState } from 'react';

// const App = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//     setIsMobile(mobile);
//   }, []);

//   return (
//     <div className="relative w-screen h-96 md:h-screen">
//       {/* Model Viewer */}
//      <model-viewer
//           src="https://vr.kiraproject.id/models/box-sample.glb"
//           ar
//           ar-modes="webxr scene-viewer quick-look"
//           camera-controls
//           auto-rotate
//           loading="lazy"
//           className="w-full h-full"
//           on-ar-status={(e) => {
//             if (e.detail.status === 'failed') {
//                 alert('AR tidak didukung di perangkat ini.');
//             }
//           }}
//         >
//           {/* Loading Poster */}
//           <div
//             slot="poster"
//             className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 
//                       flex flex-col items-center justify-center text-white p-6"
//           >
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
//             <p className="text-lg font-medium">Memuat model 3D...</p>
//             <p className="text-sm mt-2 opacity-80">Pastikan koneksi stabil</p>
//           </div>

//           {/* Tombol AR */}
//           <button
//             slot="ar-button"
//             style={{
//               position: 'absolute',
//               bottom: '20px',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               background: '#000',
//               color: '#fff',
//               padding: '12px 24px',
//               borderRadius: '8px',
//               fontSize: '16px',
//               fontWeight: '500',
//               zIndex: 50,
//               boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//               transition: 'background 0.2s',
//             }}
//             onMouseEnter={(e) => e.target.style.background = '#333'}
//             onMouseLeave={(e) => e.target.style.background = '#000'}
//           >
//             Lihat di Ruangan Anda
//           </button>
//         </model-viewer>

//       {/* Overlay Desktop */}
//       {!isMobile && (
//         <div
//           className="absolute inset-0 
//                      bg-black/70 text-white 
//                      flex flex-col items-center justify-center 
//                      text-center p-5 rounded-xl 
//                      font-sans backdrop-blur-sm"
//         >
//           <p className="text-lg md:text-xl font-medium">
//             Untuk melihat AR, buka halaman ini di <strong className="font-bold">HP</strong> menggunakan{' '}
//             <strong className="font-bold">Chrome</strong> atau <strong className="font-bold">Safari</strong>
//           </p>
//           <p className="text-sm md:text-base mt-3 opacity-90">
//             Arahkan kamera HP ke lantai → model akan muncul!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import './App.css'; // Untuk styling video background

function Model(props) {
  const { scene } = useGLTF('/box-sample.glb'); // Ganti dengan path model GLB kamu
  return <primitive object={scene} {...props} />;
}

function App() {
  const videoRef = useRef(null);

  // Akses kamera belakang
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' }, // Kamera belakang
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="app-container">
      {/* Video Background (Kamera) */}
      <video ref={videoRef} className="video-background" playsInline />

      {/* 3D Canvas di atas kamera */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model scale={1.5} position={[0, -1, 0]} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;