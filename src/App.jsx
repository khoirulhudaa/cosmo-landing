// import '@google/model-viewer';
// import { motion } from 'framer-motion';
// import { ArrowLeft, Box, Info, Sparkles } from 'lucide-react';
// import { useState } from 'react';
// import ARViewer from './arViewer';
// import ModelSelector from './modelUploader';

// export default function App() {
//   const [modelUrl, setModelUrl] = useState('');
//   const [showAR, setShowAR] = useState(false);

//   const handleModelSelect = (url) => {
//     setModelUrl(url);
//     setShowAR(true);
//   };

//   const handleBack = () => {
//     setShowAR(false);
//     if (modelUrl.startsWith('blob:')) {
//       URL.revokeObjectURL(modelUrl);
//     }
//     setModelUrl('');
//   };

//   if (showAR && modelUrl) {
//     return <ARViewer modelUrl={modelUrl} onBack={handleBack} />;
//   }

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white">
//       {/* Animated Background Mesh */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
//         <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-blue-600/10 to-indigo-600/10 animate-pulse animation-delay-2000" />
//       </div>

//       {/* Floating Grid Lines */}
//       <div className="absolute inset-0 pointer-events-none">
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
//             initial={{ y: -100 }}
//             animate={{ y: '100vh' }}
//             transition={{
//               duration: 8 + i * 2,
//               repeat: Infinity,
//               ease: 'linear',
//             }}
//             style={{ top: `${i * 20}%` }}
//           />
//         ))}
//       </div>

//       {/* Main Container */}
//       <div className="relative z-10 md:max-w-7xl mx-auto px-3 md:px-6 py-12">
//         {/* Backdrop Glow */}
//         <motion.div
//           className="absolute inset-0 -z-10 blur-3xl"
//           animate={{
//             background: [
//               'radial-gradient(circle at 20% 80%, rgba(120, 219, 226, 0.3), transparent 50%)',
//               'radial-gradient(circle at 80% 20%, rgba(173, 109, 244, 0.3), transparent 50%)',
//               'radial-gradient(circle at 40% 40%, rgba(255, 105, 180, 0.3), transparent 50%)',
//             ],
//           }}
//           transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
//         />

//         {/* Header - Futuristic 3D Title */}
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           className="text-center md:mb-16"
//         >
//           <div className="w-full md:flex justify-center items-center gap-6 mb-6">
//             <div className='flex md:hidden'>
//               <motion.div
//                 className='mx-auto mb-6'
//               >
//                 <Box size={80} className="text-cyan-400 drop-shadow-glow" />
//               </motion.div>
//             </div>
//             <h1 className="text-4xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
//               AR VIEWER 3D
//             </h1>
//           </div>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="text-sm md:text-xl text-cyan-200 font-light max-w-3xl mx-auto"
//           >
//             Masuk ke dunia nyata dengan model 3D interaktif. Upload atau pilih model, lalu lihat dalam Augmented Reality.
//           </motion.p>
//         </motion.div>

//         {/* Model Selector Card - Glassmorphism + Hover Lift */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//           className="relative w-full md:max-w-2xl -mt-20 pt-0 md:mt-30 mx-auto z-10"
//         >
//           <div className="absolute inset-0 blur-xl -z-10" />
//           <div className="md:p-8 shadow-2xl h-max">
//             <ModelSelector onModelSelect={handleModelSelect} />
//           </div>
//         </motion.div>

//         {/* SPASI PEMISAH – INI PENTING! */}
//         <div className="h-20 md:h-14" />

//         {/* Info Cards - Floating Orbs */}
//         <div className="relative mt-0 md:mt-40 grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:px-0 px-4 md:max-w-5xl mx-auto z-20">
//           {[
//             { icon: <Info className="w-5 h-5" />, title: 'WebXR Ready', desc: 'Chrome Android • Safari iOS' },
//             { icon: <ArrowLeft className="w-5 h-5" />, title: 'Tap to Place', desc: 'Arahkan ke lantai saat AR aktif' },
//             { icon: <Sparkles className="w-5 h-5" />, title: 'Real-time', desc: 'Interaksi penuh: putar, zoom, geser' },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 + i * 0.1 }}
//               whileHover={{ y: -8, scale: 1.01 }}
//               className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               <div className="relative z-10 flex items-start gap-3">
//                 <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
//                   {item.icon}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-white">{item.title}</h3>
//                   <p className="text-sm text-cyan-200/80">{item.desc}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Footer Tagline */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="mt-20 text-center"
//         >
//           <p className="text-sm text-cyan-300/60 font-mono tracking-widest">
//             POWERED BY <span className="text-cyan-400">Cosmo AR</span> • <span className="text-pink-400">2025</span>
//           </p>
//         </motion.div>
//       </div>

//       {/* Custom CSS untuk glow */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .drop-shadow-glow {
//           filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.6));
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         `,
//         }}
//       />
//     </div>
//   );
// }


import '@google/model-viewer';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, Info, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import ARViewer from './arViewer';
import ModelSelector from './modelUploader';

export default function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [showAR, setShowAR] = useState(false);
  const [blobUrlToRevoke, setBlobUrlToRevoke] = useState(null); // Simpan URL untuk revoke nanti

  // -------------------------------------------------
  // Pilih model (URL atau File)
  // -------------------------------------------------
  const handleModelSelect = (urlOrFile) => {
    let url = urlOrFile;

    // Jika file → buat blob URL
    if (urlOrFile instanceof File) {
      url = URL.createObjectURL(urlOrFile);
      setBlobUrlToRevoke(url); // Simpan untuk revoke nanti
    } else {
      setBlobUrlToRevoke(null); // Bukan blob
    }

    setModelUrl(url);
    setShowAR(true);
  };

  // -------------------------------------------------
  // Kembali dari AR
  // -------------------------------------------------
  const handleBack = () => {
    setShowAR(false); // Mulai unmount ARViewer

    // Revoke blob URL setelah ARViewer selesai (delay 500ms)
    if (blobUrlToRevoke) {
      setTimeout(() => {
        URL.revokeObjectURL(blobUrlToRevoke);
        console.log('Blob URL revoked:', blobUrlToRevoke);
      }, 500);
    }

    // Reset state
    setModelUrl('');
    setBlobUrlToRevoke(null);
  };

  // -------------------------------------------------
  // Cleanup saat komponen unmount (extra safety)
  // -------------------------------------------------
  useEffect(() => {
    return () => {
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
      }
    };
  }, [blobUrlToRevoke]);

  // -------------------------------------------------
  // Render ARViewer dengan animasi keluar
  // -------------------------------------------------
  if (showAR && modelUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ARViewer modelUrl={modelUrl} onBack={handleBack} />
      </motion.div>
    );
  }

  // -------------------------------------------------
  // Tampilan Utama
  // -------------------------------------------------
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-blue-600/10 to-indigo-600/10 animate-pulse animation-delay-2000" />
      </div>

      {/* Floating Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            initial={{ y: -100 }}
            animate={{ y: '100vh' }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ top: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 md:max-w-7xl mx-auto px-3 md:px-6 py-12">
        {/* Backdrop Glow */}
        <motion.div
          className="absolute inset-0 -z-10 blur-3xl"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 219, 226, 0.3), transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(173, 109, 244, 0.3), transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(255, 105, 180, 0.3), transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:mb-16"
        >
          <div className="w-full md:flex justify-center items-center gap-6 mb-6">
            <div className='flex md:hidden'>
              <motion.div className='mx-auto mb-6'>
                <Box size={80} className="text-cyan-400 drop-shadow-glow" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              AR VIEWER COSMO
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm md:text-xl text-cyan-200 font-light max-w-3xl mx-auto"
          >
            Masuk ke dunia nyata dengan model 3D interaktif. Upload atau pilih model, lalu lihat dalam Augmented Reality.
          </motion.p>
        </motion.div>

        {/* Model Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative w-full md:mt-30 md:max-w-2xl mx-auto z-10"
        >
          <div className="md:p-8 shadow-2xl h-max">
            <ModelSelector onModelSelect={handleModelSelect} />
          </div>
        </motion.div>

        <div className="h-20 md:h-14" />

        {/* Info Cards */}
        <div className="relative mt-0 md:mt-40 grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:px-0 px-4 md:max-w-5xl mx-auto z-20">
          {[
            { icon: <Info className="w-5 h-5" />, title: 'WebXR Ready', desc: 'Chrome Android • Safari iOS' },
            { icon: <ArrowLeft className="w-5 h-5" />, title: 'Tap to Place', desc: 'Arahkan ke lantai saat AR aktif' },
            { icon: <Sparkles className="w-5 h-5" />, title: 'Real-time', desc: 'Interaksi penuh: putar, zoom, geser' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                  <p className="text-sm text-cyan-200/80">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-cyan-300/60 font-mono tracking-widest">
            POWERED BY <span className="text-cyan-400">Cosmo AR</span> • <span className="text-pink-400">2025</span>
          </p>
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .drop-shadow-glow {
            filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.6));
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          `,
        }}
      />
    </div>
  );
}