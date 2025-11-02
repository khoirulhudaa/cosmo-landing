import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import './App.css';

function Model({ url, position }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} position={position} />;
}

function ARScene() {
  const { gl, camera } = useThree();
  const [modelPosition, setModelPosition] = useState(null);

  // Tap di layar → letakkan model di tengah
  const handleTap = (e) => {
    if (modelPosition) return;

    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    setModelPosition(pos);
  };

  return (
    <>
      {/* Overlay untuk tap */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: modelPosition ? 'none' : 'auto',
        }}
        onPointerDown={handleTap}
      />

      {/* Model */}
      {modelPosition && <Model url="https://vr.kiraproject.id/models/box-sample.glb" position={modelPosition} />}

      {/* Instruksi */}
      {!modelPosition && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
             fontSize: '18px',
            textAlign: 'center',
            zIndex: 11,
            pointerEvents: 'none',
          }}
        >
          Tap layar untuk letakkan model
        </div>
      )}
    </>
  );
}

export default function App() {
  const [arSession, setArSession] = useState(null);

  const startAR = async () => {
    if (!navigator.xr) {
      alert('WebXR tidak didukung di browser ini');
      return;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.getElementById('root') },
      });

      setArSession(session);
    } catch (err) {
      console.error('AR gagal:', err);
      alert('AR tidak didukung di device ini. Coba aktifkan flag WebXR.');
    }
  };

  if (!arSession) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '50px' }}>
        <h1>AR Lantai Sederhana</h1>
        <button
          onClick={startAR}
          style={{
            marginTop: 20,
            padding: '15px 30px',
            fontSize: 18,
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
          }}
        >
          Masuk AR
        </button>
        <p style={{ marginTop: 20, color: '#666' }}>
          Pastikan: Chrome 91+, HTTPS, ARCore
        </p>
      </div>
    );
  }

  return (
    <Canvas
      gl={{ antialias: true, xrCompatible: true }}
      onCreated={({ gl }) => {
        gl.xr.enabled = true;
        gl.xr.setReferenceSpaceType('local');
        gl.xr.setSession(arSession);
      }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <ARScene />
    </Canvas>
  );
}