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
  const { gl, camera, scene } = useThree();
  const reticleRef = useRef();
  const [modelMatrix, setModelMatrix] = useState(null);
  const hitTestSource = useRef(null);
  const hitTestSourceRequested = useRef(false);

  useFrame((state, delta) => {
    const session = gl.xr.getSession();
    if (!session || !reticleRef.current) return;

    const referenceSpace = gl.xr.getReferenceSpace();
    const frame = state.xrFrame;
    if (!frame || !referenceSpace) return;

    if (!hitTestSourceRequested.current) {
      session.requestReferenceSpace('viewer').then((refSpace) => {
        session.requestHitTestSource({ space: refSpace }).then((source) => {
          hitTestSource.current = source;
        });
      });
      hitTestSourceRequested.current = true;
    }

    if (hitTestSource.current) {
      const hitTestResults = frame.getHitTestResults(hitTestSource.current);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const hitPose = hit.getPose(referenceSpace);
        if (hitPose) {
          const matrix = new THREE.Matrix4().fromArray(hitPose.transform.matrix);
          const pos = new THREE.Vector3();
          const quat = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          matrix.decompose(pos, quat, scale);

          reticleRef.current.position.copy(pos);
          reticleRef.current.quaternion.copy(quat);
          reticleRef.current.visible = true;
        }
      } else {
        reticleRef.current.visible = false;
      }
    }
  });

  const handleTap = (e) => {
    if (reticleRef.current && reticleRef.current.visible) {
      const pos = reticleRef.current.position.clone();
      const quat = reticleRef.current.quaternion.clone();
      const matrix = new THREE.Matrix4().compose(pos, quat, new THREE.Vector3(1, 1, 1));
      setModelMatrix(matrix.toArray());
    }
  };

  return (
    <>
      {/* Reticle */}
      <mesh
        ref={reticleRef}
        visible={false}
        onPointerDown={handleTap}
      >
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color="yellow" />
      </mesh>

      {/* Model setelah tap */}
      {modelMatrix && (
        <group matrixAutoUpdate={false} matrix={new THREE.Matrix4().fromArray(modelMatrix)}>
          <Model url="/box-sample.glb" position={[0, 0, 0]} />
        </group>
      )}
    </>
  );
}

export default function App() {
  const [arSession, setArSession] = useState(null);

  const startAR = async () => {
    if (!navigator.xr) {
      alert('WebXR tidak didukung');
      return;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body },
      });
      setArSession(session);
    } catch (err) {
      console.error('AR gagal:', err);
    }
  };

  return (
    <>
      {/* Tombol Masuk AR */}
      {!arSession && (
        <button
          onClick={startAR}
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            padding: '12px 24px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
          }}
        >
          Masuk AR
        </button>
      )}

      {arSession && (
        <Canvas
          gl={{
            antialias: true,
            xrCompatible: true,
          }}
          onCreated={({ gl }) => {
            gl.xr.enabled = true;
            gl.xr.setReferenceSpaceType('local-floor');
            gl.xr.setSession(arSession);
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <ARScene />
        </Canvas>
      )}
    </>
  );
}