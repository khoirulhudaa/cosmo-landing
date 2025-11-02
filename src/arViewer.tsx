import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Camera } from 'lucide-react';

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);

  return (
    <primitive
      object={scene}
      scale={0.5}
      position={[0, 0, -1]}
    />
  );
}

interface ARViewerProps {
  modelUrl: string;
}

export default function ARViewer({ modelUrl }: ARViewerProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported);
        if (!supported) {
          setError('AR tidak didukung di browser ini. Gunakan browser yang mendukung WebXR seperti Chrome di Android.');
        }
      }).catch(() => {
        setError('Tidak dapat memeriksa dukungan AR');
      });
    } else {
      setError('Browser tidak mendukung WebXR');
    }
  }, []);

  return (
    <div className="w-full h-screen relative">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-10">
          {error}
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <XR>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <spotLight position={[0, 5, 0]} intensity={0.5} />

          {modelUrl && <Model url={modelUrl} />}

          <Environment preset="city" />
        </XR>
        <OrbitControls />
      </Canvas>

      <ARButton
        sessionInit={{
          requiredFeatures: ['hit-test', 'dom-overlay'],
          optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
          domOverlay: { root: document.body }
        }}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all ${!isARSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Camera size={24} />
        Mulai AR
      </ARButton>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
        <p className="text-sm text-gray-700">
          {isARSupported ? 'AR Ready' : 'Memuat...'}
        </p>
      </div>
    </div>
  );
}
