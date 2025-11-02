import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Camera, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.geometry) {
        child.geometry.computeBoundingBox();
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, -0.5, 0]}
    />
  );
}

export default function ARViewer({ modelUrl, onBack }) {
  const canvasRef = useRef(null);
  const [isARActive, setIsARActive] = useState(false);
  const [error, setError] = useState('');
  const [arSession, setArSession] = useState(null);

  useEffect(() => {
    const initAR = async () => {
      try {
        if (!('xr' in navigator)) {
          setError('Browser tidak mendukung WebXR');
          return;
        }

        const supported = await (navigator).xr?.isSessionSupported('immersive-ar');
        if (!supported) {
          setError('AR tidak didukung di perangkat ini. Gunakan Chrome di Android.');
        }
      } catch (err) {
        console.error('AR initialization error:', err);
      }
    };

    initAR();
  }, []);

  const startAR = async () => {
    try {
      if (!canvasRef.current) return;

      const session = await (navigator).xr?.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        optionalFeatures: ['local-floor', 'bounded-floor'],
        domOverlay: { root: document.body }
      });

      if (session) {
        setArSession(session);
        setIsARActive(true);
      }
    } catch (err) {
      console.error('Error starting AR:', err);
      setError('Gagal memulai AR session');
    }
  };

  const stopAR = () => {
    if (arSession) {
      arSession.end();
      setArSession(null);
      setIsARActive(false);
    }
  };

  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {modelUrl && <Model url={modelUrl} />}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>

      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-10 text-sm">
          {error}
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
        {isARActive ? (
          <button
            onClick={stopAR}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all"
          >
            <Camera size={20} />
            Keluar AR
          </button>
        ) : (
          <button
            onClick={startAR}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all"
          >
            <Camera size={20} />
            Mulai AR
          </button>
        )}

        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all"
        >
          <RotateCcw size={20} />
          Kembali
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
        <p className="text-sm text-gray-700 font-medium">
          {isARActive ? 'Mode AR Aktif' : 'Mode Preview'}
        </p>
      </div>

      {!isARActive && (
        <div className="absolute top-16 left-4 right-4 bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-md text-xs text-blue-800">
          <p className="font-semibold mb-2">Tips:</p>
          <ul className="space-y-1">
            <li>Putar dan zoom model menggunakan sentuhan</li>
            <li>Tekan tombol "Mulai AR" untuk melihat di dunia nyata</li>
            <li>Arahkan ke permukaan datar untuk menempatkan model</li>
          </ul>
        </div>
      )}
    </div>
  );
}
