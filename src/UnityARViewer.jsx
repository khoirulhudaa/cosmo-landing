// // src/UnityARViewer.jsx
// import { motion } from 'framer-motion';
// import { ArrowLeft } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';

// export default function UnityARViewer({ onBack }) {
//   const iframeRef = useRef(null);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     const handler = (e) => {
//       if (e.data.type === 'UNITY_LOADED') {
//         setIsLoaded(true);
//       }
//     };
//     window.addEventListener('message', handler);
//     return () => window.removeEventListener('message', handler);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
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

//       {/* Loading */}
//       {!isLoaded && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 to-cyan-950">
//           <div className="w-32 h-32 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
//           <p className="text-cyan-300 font-medium">Memuat AR...</p>
//           <p className="text-sm text-cyan-400/70">Izinkan kamera</p>
//         </div>
//       )}

//       {/* Iframe AR */}
//       <iframe
//         ref={iframeRef}
//         src="/ar.html"
//         className="absolute inset-0 w-full h-full border-0"
//         allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
//         style={{ display: isLoaded ? 'block' : 'none' }}
//       />

//       {/* Footer */}
//       {/* <div className="absolute bottom-4 left-0 right-0 text-center px-4 z-10">
//         <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-cyan-300">
//           <AlertCircle className="w-4 h-4" />
//           <span>HP + Chrome + HTTPS + Izinkan Kamera</span>
//         </div>
//       </div> */}
//     </motion.div>
//   );
// }


// src/UnityARViewer.jsx
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
      <div className="w-max absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="p-2.5 mr-3 md:mt-0 border border-white/60 cursor-pointer active:scale-[0.98] mt-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-lg font-bold md:flex hidden text-white">AR Cosmo (Image Target)</h2>
        <div className="w-10" />
      </div>

      {/* Iframe AR */}
      <iframe
        ref={iframeRef}
        src="/ar.html"
        className="absolute inset-0 w-full h-full border-0"
        allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
      />
    </motion.div>
  );
}