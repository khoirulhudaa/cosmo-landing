import { useEffect, useRef } from 'react';

const ZapparUnityAR = () => {
  const containerRef = useRef(null);
  const unityInstanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = '/unity-build/Build/Build.loader.js';
    script.async = true;
    script.onload = () => {
      if (window.createUnityInstance) {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        containerRef.current.appendChild(canvas);

        const config = {
          dataUrl: '/unity-build/Build/3dfc59c974755dee151d250cb020d8bd.data.unityweb',
          frameworkUrl: '/unity-build/Build/73b6b973f99e58b13f9e27103060aa86.wasm.unityweb',
          codeUrl: '/unity-build/Build/f52347dc2ab1959d1e759a6f582b4b30.js.unityweb',
          // Ganti dengan URL target .zpt kamu
          streamingAssetsUrl: 'StreamingAssets',
          companyName: 'YourCompany',
          productName: 'Zappar AR',
          productVersion: '1.0.0',
          // Tambahkan target image tracking
          webglContextAttributes: { preserveDrawingBuffer: false },
          // Zappar-specific: kirim path target ke Unity
          // Ini akan diterima di Unity via Zappar SDK
          // Pastikan di Unity kamu pakai ZapparImageTracker dan baca dari query param
        };

        window.createUnityInstance(canvas, config, (progress) => {
          console.log('Loading Unity:', (progress * 100).toFixed(2) + '%');
        }).then((unityInstance) => {
          unityInstanceRef.current = unityInstance;
          console.log('Unity loaded!');

          // Kirim path target image ke Unity (opsional, tergantung setup Unity)
          // Jika Unity kamu pakai Zappar SDK, biasanya otomatis baca dari URL
          const targetPath = '/COSMO 1417-02 marker.zpt';
          unityInstance.SendMessage('ZapparManager', 'SetImageTarget', targetPath);
        }).catch((error) => {
          console.error('Unity failed to load:', error);
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (unityInstanceRef.current) {
        unityInstanceRef.current.Quit();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Optional: Loading indicator */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontFamily: 'Arial',
          fontSize: '18px',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        Loading AR...
      </div>
    </div>
  );
};

export default ZapparUnityAR;