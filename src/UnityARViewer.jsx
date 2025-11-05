// // src/UnityARViewer.jsx
// import { motion } from 'framer-motion';
// import { AlertCircle, ArrowLeft } from 'lucide-react';
// import { useEffect } from 'react';
// import { Unity, useUnityContext } from 'react-unity-webgl';

// export default function UnityARViewer({ onBack }) {
//  const { unityProvider, isLoaded, loadingProgression, unload} = useUnityContext({
//   loaderUrl: "/unity-build/Build/Build1.loader.js",
//   dataUrl: "/unity-build/Build/5e30b6e1da5853808344359921df6a0b.data.unityweb",
//   frameworkUrl: "/unity-build/Build/f52347dc2ab1959d1e759a6f582b4b30.js.unityweb",
//   codeUrl: "/unity-build/Build/73b6b973f99e58b13f9e27103060aa86.wasm.unityweb",
// });

//   // Cleanup saat keluar
//   useEffect(() => {
//     return () => {
//       unload?.();
//     };
//   }, [unload]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//       className="fixed inset-0 z-50 bg-black"
//     >
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
//         <button
//           onClick={onBack}
//           className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
//         >
//           <ArrowLeft className="w-6 h-6 text-cyan-400" />
//         </button>
//         <h2 className="text-lg font-bold text-cyan-300">AR Unity Mode</h2>
//         <div className="w-10" />
//       </div>

//       {/* Loading Screen */}
//       {!isLoaded && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 to-cyan-950">
//           <div className="relative">
//             <div className="w-32 h-32 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-2xl font-bold text-cyan-300">
//                 {Math.round(loadingProgression * 100)}%
//               </span>
//             </div>
//           </div>
//           <div className="text-center max-w-xs px-4">
//             <p className="text-cyan-300 font-medium">Memuat AR Unity...</p>
//             <p className="text-sm text-cyan-400/70 mt-2">
//               Arahkan kamera ke <strong>target image</strong> (tanya tim Unity)
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Unity Canvas */}
//       <div className="absolute inset-0">
//         <Unity
//           unityProvider={unityProvider}
//           style={{ width: '100%', height: '100%' }}
//         />
//       </div>

//       {/* Footer Info */}
//       <div className="absolute bottom-4 left-0 right-0 text-center px-4">
//         <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-cyan-300">
//           <AlertCircle className="w-4 h-4" />
//           <span>HP + Chrome + HTTPS + Izinkan Kamera</span>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// src/UnityARViewer.jsx
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function UnityARViewer({ onBack }) {
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.data.type === 'UNITY_LOADED') {
        setIsLoaded(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onBack}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-cyan-400" />
        </button>
        <h2 className="text-lg font-bold text-cyan-300">AR Unity Mode</h2>
        <div className="w-10" />
      </div>

      {/* Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 to-cyan-950">
          <div className="w-32 h-32 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-cyan-300 font-medium">Memuat AR...</p>
          <p className="text-sm text-cyan-400/70">Izinkan kamera</p>
        </div>
      )}

      {/* Iframe AR */}
      <iframe
        ref={iframeRef}
        src="/ar.html"
        className="absolute inset-0 w-full h-full border-0"
        allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />

      {/* Footer */}
      {/* <div className="absolute bottom-4 left-0 right-0 text-center px-4 z-10">
        <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-cyan-300">
          <AlertCircle className="w-4 h-4" />
          <span>HP + Chrome + HTTPS + Izinkan Kamera</span>
        </div>
      </div> */}
    </motion.div>
  );
}