import React, { useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { XR } from '@react-three/xr';
import './App.css';

function Model({ url, position }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={0.5} />;
}

function ARScene() {
  const [modelPosition, setModelPosition] = useState(null);
  const { gl, camera } = useThree();

  const handleSelect = (e) => {
    const frame = e.target.getXRFrame();
    if (!frame) return;

    const referenceSpace = gl.xr.getReferenceSpace();
    const hitTestSource = gl.xr.getHitTestSource();

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        if (pose) {
          setModelPosition([pose.transform.position.x, pose.transform.position.y, pose.transform.position.z]);
        }
      }
    }
  };

  return (
    <>
      <XR
        referenceSpace="local-floor"
        onSessionStart={() => console.log('AR dimulai')}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} />

        {modelPosition && (
          <Model
            url="/model.glb"
            position={modelPosition}
          />
        )}

        {/* Tap untuk tempatkan model */}
        <mesh visible={false} onClick={handleSelect}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </XR>
    </>
  );
}

export default function App() {
  const [arStarted, setArStarted] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!arStarted ? (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          background: '#000', color: '#fff', zIndex: 10
        }}>
          <h1>AR Viewer</h1>
          <p>Arahkan ke lantai, lalu tap layar</p>
          <button
            onClick={async () => {
              if (navigator.xr) {
                try {
                  await navigator.xr.requestSession('immersive-ar', {
                    requiredFeatures: ['hit-test'],
                    optionalFeatures: ['dom-overlay'],
                    domOverlay: { root: document.body }
                  });
                  setArStarted(true);
                } catch (err) {
                  alert('AR gagal: ' + err.message);
                }
              } else {
                alert('Browser tidak mendukung WebXR');
              }
            }}
            style={{
              padding: '12px 24px', fontSize: '18px',
              background: '#007bff', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}
          >
            Mulai AR
          </button>
        </div>
      ) : (
        <Canvas xr style={{ position: 'absolute', top: 0, left: 0 }}>
          <Suspense fallback={null}>
            <ARScene />
          </Suspense>
        </Canvas>
      )}

      {arStarted && !modelPosition && (
        <div style={{
          position: 'absolute', bottom: 20, left: 20,
          background: 'rgba(0,0,0,0.7)', color: 'white',
          padding: '10px', borderRadius: '8px', fontSize: '14px'
        }}>
          Tap di lantai untuk letakkan model
        </div>
      )}
    </div>
  );
}


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
