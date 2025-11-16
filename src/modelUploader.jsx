// // src/modelSelector.jsx
// import { motion } from 'framer-motion';
// import { Box } from 'lucide-react';
// import { useEffect, useState } from 'react';

// const API_DATA = [
//   {
//     filename: "cosmo.glb",
//     name: "JR-50",
//     size: 70817700,
//     category: "19 MB",
//     // fullUrl: "https://vr.kiraproject.id/models/TissueCosmo.glb",
//     fullUrl: "/assets/cosmo.glb",
//     description: "Tisu wajah premium dalam kemasan Cosmo dengan efek emboss dan foil.",
    
//     desc_left: {
//       title: "Keunggulan Produk",
//       list: [
//         "3 ply ultra-soft dengan teknologi lotion aloe vera",
//         "Tekstur emboss 3D untuk pembersihan lebih efektif",
//         "Kemasan premium dengan foil metalik & hot stamp",
//         "Aroma therapy alami (lavender & green tea)",
//       ]
//     },
//     desc_right: {
//       title: "Untuk Siapa?",
//       value: `Konsumen yang peduli kelembutan.\nKemasan elegan & premium.\nHypoallergenic, ramah kulit.\nCocok untuk hotel, spa, & rumah modern.`
//     },

//     system: "UltraSoft 3-Ply Technology",
//     benefits: ["Hypoallergenic", "Lotion aloe vera", "Emboss 3D", "Aroma therapy", "Biodegradable"],
//     usage: ["Hotel bintang 5", "Spa & salon", "Rumah modern", "Hadiah perusahaan"],
//     certifications: ["FSC", "Dermatest Excellent", "Halal MUI", "EU Ecolabel"],
//     tags: ["higienis", "premium", "gift", "eco", "luxury"]
//   },
//   {
//     filename: "product-sample.glb",
//     name: "product-sample",
//     size: 6540,
//     category: "6.39 KB",
//     fullUrl: "https://vr.kiraproject.id/models/product-sample.glb",
//     description: "Contoh produk sederhana untuk demo AR dan rendering cepat.",
    
//     desc_left: {
//       title: "Fitur Demo",
//       list: [
//         "Ukuran file ringan untuk loading cepat",
//         "Optimasi LOD untuk performa AR",
//         "Material PBR siap render real-time",
//         "UV mapping bersih & non-overlapping",
//       ]
//     },
//     desc_right: {
//       title: "Tujuan Demo",
//       value: `Template cepat untuk pengujian AR.\nFile ringan, load instan.\nCocok untuk developer & desainer.\nSiap pakai di WebXR.`
//     },

//     system: "Demo Template v1",
//     benefits: ["File ringan", "Loading cepat", "PBR ready", "WebXR optimized"],
//     usage: ["Testing", "Demo", "Developer", "Portfolio"],
//     certifications: [],
//     tags: ["demo", "lightweight", "developer", "template"]
//   },
//   {
//     filename: "box-sample.glb",
//     name: "box-sample",
//     size: 1664,
//     category: "1.63 KB",
//     fullUrl: "https://vr.kiraproject.id/models/box-sample.glb",
//     description: "Kotak kemasan minimalis dengan tekstur karton dan logo timbul.",
    
//     desc_left: {
//       title: "Spesifikasi Kemasan",
//       list: [
//         "Material karton kraft 350 GSM",
//         "Teknik emboss logo 3D dengan foil gold",
//         "Lapisan anti-minyak food-grade",
//         "Desain lipat otomatis (auto-lock bottom)",
//       ]
//     },
//     desc_right: {
//       title: "Aplikasi Ideal",
//       value: `Kemasan premium untuk kosmetik & gift.\nDesain mewah, ramah lingkungan.\nMudah dirakit tanpa lem.\nTingkatkan pengalaman unboxing.`
//     },

//     system: "Premium Folding Box",
//     benefits: ["Emboss 3D", "Foil gold", "Food-safe", "Eco-friendly", "Easy assembly"],
//     usage: ["Kosmetik", "Gift box", "Makanan premium", "Brand luxury"],
//     certifications: ["FSC", "Food Grade", "ISO 22000"],
//     tags: ["packaging", "premium", "gift", "eco", "branding"]
//   },
//   {
//     filename: "astronaut.glb",
//     name: "astronaut",
//     size: 2869044,
//     category: "2.74 MB",
//     fullUrl: "https://vr.kiraproject.id/models/astronaut.glb",
//     description: "Astronaut dengan spacesuit detail, cocok untuk visualisasi luar angkasa.",
    
//     desc_left: {
//       title: "Detail Teknis",
//       list: [
//         "Spacesuit berbasis NASA EMU (Extravehicular Mobility Unit)",
//         "Visor anti-reflektif dengan lapisan emas",
//         "Life support backpack dengan detail pipa oksigen",
//         "Articulated joints untuk animasi realistis",
//       ]
//     },
//     desc_right: {
//       title: "Konteks Penggunaan",
//       value: `Visualisasi edukasi luar angkasa.\nSimulasi spacewalk & misi Mars.\nCocok untuk museum & VR training.\nDetail akurat berbasis NASA.`
//     },

//     system: "NASA EMU Spacesuit Replica",
//     benefits: ["Detail NASA-accurate", "PBR materials", "Rigged joints", "4K textures", "AR/VR ready"],
//     usage: ["Edukasi", "Museum", "VR training", "Space simulation"],
//     certifications: ["NASA Reference", "PBR Standard"],
//     tags: ["space", "nasa", "education", "vr", "science"]
//   }
// ];

// const orbitingModels = API_DATA;

// const formatName = (str) => str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// export default function ModelSelector({ onModelSelect }) {
//   const [hoveredId, setHoveredId] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [mouse, setMouse] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 640);
//     check(); window.addEventListener('resize', check);
//     const move = (e) => {
//       setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
//     };
//     window.addEventListener('mousemove', move);
//     return () => { window.removeEventListener('resize', check); window.removeEventListener('mousemove', move); };
//   }, []);

//   const models = API_DATA;

//   return (
//     <>
//       <div className="md:min-h-screen flex items-center justify-center md:mt-20 px-4 md:p-8">
//         <div 
//           className="w-full md:w-7xl mx-auto"
//           style={{ perspective: '1600px' }}
//         >
//           <div className="h-max" style={{ transformStyle: 'preserve-3d' }}>

//             {/* CENTRAL HUB - INTERACTIVE 3D MODERN PORTAL */}
//             <div 
//               className="md:flex hidden absolute bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl border-2 border-cyan-700/70 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
//               style={{ 
//                 transform: `translateZ(160px) rotateX(${mouse.y * 0.6}deg) rotateY(${mouse.x * 0.6}deg)`,
//                 transition: 'transform 0.3s ease-out',
//               }}
//             >
//               <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[320px] md:h-[320px] flex items-center justify-center">
                
//                 {/* Glassmorphic Orb Background */}
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-cyan-500/10 to-blue-600/5 
//                                 backdrop-blur-2xl border border-white/10 animate-float-subtle"
//                      style={{
//                        boxShadow: `
//                          0 8px 40px rgba(0, 0, 0, 0.4),
//                          0 0 100px rgba(0, 255, 255,),
//                          inset 0 0 80px rgba(255, 255, 255, 0.05)
//                        `,
//                        transform: 'translateZ(10px)',
//                      }}
//                 >
//                   {/* Dynamic Glow (bereaksi ke hover orbiting cards) */}
//                   <div 
//                     className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
//                     style={{
//                       background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.3), transparent 70%)',
//                       opacity: hoveredId ? 0.6 :,
//                       filter: 'blur(30px)',
//                     }}
//                   />
//                 </div>

//                {/* 3D Polyhedron Icon - PERFECTLY CENTERED */}
//                 <div className="absolute inset-0 flex items-center justify-center animate-spin-3d-dynamic">
//                   <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
//                     <svg 
//                       viewBox="0 0 120 120" 
//                       className="w-full h-full drop-shadow-2xl"
//                       style={{ filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))' }}
//                     >
//                       <defs>
//                         <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#67e8f9" />
//                           <stop offset="50%" stopColor="#22d3ee" />
//                           <stop offset="100%" stopColor="#0284c7" />
//                         </linearGradient>
//                         <filter id="polyGlow">
//                           <feGaussianBlur stdDeviation="8" result="blur"/>
//                           <feFlood floodColor="#22d3ee" floodOpacity="0.8"/>
//                           <feComposite in2="blur" operator="in"/>
//                           <feMerge>
//                             <feMergeNode/>
//                             <feMergeNode in="SourceGraphic"/>
//                           </feMerge>
//                         </filter>
//                       </defs>

//                       {/* Tetrahedron - Didesain ULANG agar SIMETRIS & CENTERED */}
//                       <g transform="translate(60, 52)" filter="url(#polyGlow)" className="animate-micro-pulse">
//                         {/* Top Face */}
//                         <path 
//                           d="M0,-28 L24,14 L-24,14 Z" 
//                           fill="url(#polyGradient)" 
//                           opacity="0.95"
//                         />
//                         {/* Right Face */}
//                         <path 
//                           d="M0,-28 L24,14 L0,28 Z" 
//                           fill="#22d3ee" 
//                           opacity="0.75"
//                         />
//                         {/* Left Face */}
//                         <path 
//                           d="M0,-28 L-24,14 L0,28 Z" 
//                           fill="#06b6d4" 
//                           opacity="0.7"
//                         />
//                         {/* Bottom Face */}
//                         <path 
//                           d="M-24,14 L24,14 L0,28 Z" 
//                           fill="url(#polyGradient)" 
//                           opacity="0.85"
//                         />
//                       </g>
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Minimalist Typography */}
//                 <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center animate-text-float">
//                   <h1 className="text-white font-600 text-3xl sm:text-4xl md:text-3xl tracking-[0.3em]"
//                       style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
//                   >
//                     COSMO
//                   </h1>
//                   <p className="text-white/80 font-light text-sm sm:text-base tracking-widest mt-2">
//                     3D/AR MODELS
//                   </p>
//                 </div>

//                 {/* Subtle Scan Line */}
//                 <div className="absolute inset-0 rounded-full overflow-hidden opacity-15">
//                   <div className="h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent 
//                                   animate-subtle-scan"
//                        style={{ backgroundSize: '100% 200%' }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* LAYOUT: Mobile = Grid/List, Desktop = Orbit */}
//             {isMobile ? (
//               /* === MOBILE: GRID 2 KOLOM === */
//               <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto mt-12 sm:mt-40">
//                 {orbitingModels.map((model) => {
//                   const isHovered = hoveredId === model.filename;

//                   return (
//                     <button
//                       key={model.filename}
//                       onClick={() => onModelSelect(model)}
//                       onTouchStart={() => setHoveredId(model.filename)}
//                       onTouchEnd={() => setHoveredId(null)}
//                       className="w-full aspect-square group touch-manipulation"
//                     >
//                       <div 
//                         className="relative cursor-pointer w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl rounded-3xl border border-cyan-400/50 overflow-hidden"
//                         style={{
//                           boxShadow: isHovered 
//                             ? '0 0 70px rgba(0, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.3)'
//                             : '0 0 30px rgba(0, 255, 255,), 0 10px 20px rgba(0, 0, 0, 0.4)',
//                           transform: 'translateZ(40px)',
//                         }}
//                       >
//                         {/* Scan Line */}
//                         <div className="absolute inset-0 opacity-30">
//                           <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-card-scan-slow" 
//                             style={{ backgroundSize: '100% 300%' }} 
//                           />
//                         </div>

//                         {/* Icon */}
//                         <div className="relative top-[-26px] md:top-0 flex items-center justify-center h-full">
//                           <Box size={40} className={`text-cyan-300 ${isHovered ? 'text-cyan-100' : ''} drop-shadow-2xl`} />
//                         </div>

//                         {/* Label + Size */}
//                         <div className="absolute bottom-0 left-0 right-0 py-4 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
//                           <p className="text-cyan-100 font-bold text-xs sm:text-sm tracking-wider text-center">
//                             {formatName(model.name)}
//                           </p>
//                           <p className="text-cyan-300 text-xs text-center mt-1 opacity-80">
//                             {model.category}
//                           </p>
//                         </div>

//                         {/* Glow */}
//                         <div 
//                           className={`absolute inset-0 rounded-3xl opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity pointer-events-none`}
//                           style={{
//                             background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.6), transparent 60%)',
//                             filter: 'blur(25px)',
//                             animation: isHovered ? 'pulse-glow 2s infinite' : 'none',
//                           }} 
//                         />
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             ) : (
//               /* === DESKTOP: ORBIT MELINGKAR (sama seperti asli) === */
//               orbitingModels.map((model, index) => {
//                 const total = orbitingModels.length;
//                 const baseAngle = 45;
//                 const angle = baseAngle + (index * 360 / total);
//                 const radius = 320;
//                 const x = Math.cos((angle * Math.PI) / 180) * radius;
//                 const y = Math.sin((angle * Math.PI) / 180) * radius;
//                 const isHovered = hoveredId === model.filename;

//                 return (
//                   <button
//                     key={model.filename}
//                     onClick={() => onModelSelect(model)}
//                     onMouseEnter={() => setHoveredId(model.filename)}
//                     onMouseLeave={() => setHoveredId(null)}
//                     className="absolute cursor-pointer top-1/2 left-1/2 w-50 h-50 group"
//                     style={{
//                       transform: `
//                         translate(-50%, -50%) 
//                         translateX(${x}px) 
//                         translateY(${y}px) 
//                         translateZ(${isHovered ? 50 : 30}px) 
//                         rotateY(${isHovered ? 5 : 0}deg) 
//                         rotateX(${isHovered ? -10 : 0}deg)
//                       `,
//                       transformStyle: 'preserve-3d',
//                       transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
//                     }}
//                   >
//                     {/* CARD SAMA SEPERTI ASLI */}
//                     <div 
//                       className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl rounded-3xl border border-cyan-400/50 overflow-hidden"
//                       style={{
//                         boxShadow: isHovered 
//                           ? '0 0 90px rgba(0, 255, 255, 0.3), 0 35px 70px rgba(0, 0, 0,)'
//                           : '0 0 35px rgba(0, 255, 255, 0.3), 0 15px 35px rgba(0, 0, 0, 0.5)',
//                         transform: 'translateZ(60px)',
//                       }}
//                     >
//                       <div className="absolute inset-0 opacity-30">
//                         <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-card-scan-slow" 
//                           style={{ backgroundSize: '100% 300%' }} 
//                         />
//                       </div>

//                       <div className='relative top-[-30px] flex items-center justify-center h-full z-10'>
//                         <motion.div
//                         >
//                           <Box size={80} className="text-cyan-400 drop-shadow-glow" />
//                         </motion.div>
//                       </div>

//                       <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
//                         <p className="text-cyan-100 font-bold text-md mx-auto text-center tracking-widest drop-shadow-lg">
//                           {formatName(model.name)}
//                         </p>
//                         <p className="text-cyan-300 text-sm text-center mt-1 opacity-80">
//                           {model.category}
//                         </p>
//                       </div>

//                       <div 
//                         className={`absolute inset-0 rounded-3xl opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity pointer-events-none`}
//                         style={{
//                           background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.7), transparent 60%)',
//                           filter: 'blur(35px)',
//                           animation: isHovered ? 'pulse-glow 2s infinite' : 'none',
//                         }} 
//                       />
//                     </div>
//                   </button>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Animasi Global */}
//      <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             @keyframes card-scan-slow {
//               0%, 100% { background-position: 0% 0%; }
//               50% { background-position: 0% 100%; }
//             }
//             @keyframes pulse-glow {
//               0%, 100% { opacity: 0.6; }
//               50% { opacity: 1; }
//             }
//             .animate-card-scan-slow { animation: card-scan-slow 6s infinite linear; }
//             .animate-pulse-glow { animation: pulse-glow 2s infinite; }
//           `,
//         }}
//       />
//     </>
//   );
// }



// src/components/ModelSelector.jsx
// import { Box, Download } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { generateQRWithLogo } from './utils/generateQrCode';

// const API_BASE = 'https://vr.kiraproject.id';

// const formatName = (str) =>
//   str
//     .replace(/-/g, ' ')
//     .replace(/_/g, ' ')
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// export default function ModelSelector({ onModelSelect }) {
//   const [hoveredId, setHoveredId] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [mouse, setMouse] = useState({ x: 0, y: 0 });
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [qrs, setQRs] = useState(new Map()); // sku -> base64 QR

//   // === FETCH PRODUK DARI API ===
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/products`);
//         const json = await res.json();

//         if (json.success && Array.isArray(json.data)) {
//           const formatted = json.data.map((p) => ({
//             filename: p.modelUrl?.split('/').pop() || p.sku,
//             name: p.name || p.sku,
//             size: p.modelSize || 0,
//             category: p.modelSize
//               ? `${(p.modelSize / 1024 / 1024).toFixed(2)} MB`
//               : 'Unknown',
//             fullUrl: p.modelUrl?.startsWith('http')
//               ? p.modelUrl
//               : `${API_BASE}${p.modelUrl}`,
//             description: p.description || 'Model 3D produk premium.',
//             sku: p.sku,
//             desc_left: {
//               title: 'Keunggulan Produk',
//               list: p.features?.split('\n') || ['Kualitas premium', 'Desain eksklusif'],
//             },
//             desc_right: {
//               title: 'Untuk Siapa?',
//               value: p.target || 'Konsumen modern yang mengutamakan kualitas.',
//             },
//             system: p.system || 'Premium Product',
//             benefits: p.benefits || [],
//             usage: p.usage || [],
//             certifications: p.certifications || [],
//             tags: p.tags || [],
//           }));
//           setModels(formatted);
//         } else {
//           throw new Error('Invalid response');
//         }
//       } catch (err) {
//         console.error('Gagal fetch produk:', err);
//         setError('Gagal memuat produk. Coba refresh.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // === GENERATE QR CODE UNTUK SEMUA MODEL ===
//   useEffect(() => {
//     const generateQRs = async () => {
//       const baseUrl = 'https://cosmo.kiraproject.id/ar';
//       const qrMap = new Map();

//       for (const model of models) {
//         const url = `${baseUrl}/${model.sku}`;
//         try {
//           const qr = await generateQRWithLogo(url, '/logo.jpg');
//           qrMap.set(model.sku, qr);
//         } catch (err) {
//           console.warn(`Gagal generate QR untuk ${model.sku}`, err);
//         }
//       }

//       setQRs(qrMap);
//     };

//     if (models.length > 0) {
//       generateQRs();
//     }
//   }, [models]);

//   // === DETEKSI MOBILE & MOUSE ===
//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 640);
//     check();
//     window.addEventListener('resize', check);

//     const move = (e) => {
//       setMouse({
//         x: (e.clientX / window.innerWidth - 0.5) * 20,
//         y: (e.clientY / window.innerHeight - 0.5) * 20,
//       });
//     };
//     window.addEventListener('mousemove', move);

//     return () => {
//       window.removeEventListener('resize', check);
//       window.removeEventListener('mousemove', move);
//     };
//   }, []);

//   // === LOADING STATE ===
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-96 text-red-400">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (models.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96 text-cyan-300">
//         <p>Tidak ada produk tersedia.</p>
//       </div>
//     );
//   }

//   // === DOWNLOAD QR ===
//   const downloadQR = (e, base64, sku) => {
//     e.stopPropagation();
//     const link = document.createElement('a');
//     link.href = base64;
//     link.download = `COSMO-QR-${sku}.png`;
//     link.click();
//   };

//   return (
//     <>
//       <div className="md:min-h-screen flex items-center justify-center md:mt-20 px-4 md:p-8">
//         <div className="w-full md:w-7xl mx-auto" style={{ perspective: '1600px' }}>
//           <div className="h-max" style={{ transformStyle: 'preserve-3d' }}>

//             {/* CENTRAL HUB */}
//             <div 
//               className="md:flex hidden absolute bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl border-2 border-cyan-700/70 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
//               style={{ 
//                 transform: `translateZ(160px) rotateX(${mouse.y * 0.6}deg) rotateY(${mouse.x * 0.6}deg)`,
//                 transition: 'transform 0.3s ease-out',
//               }}
//             >
//               <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[320px] md:h-[320px] flex items-center justify-center">
                
//                 {/* Glassmorphic Orb Background */}
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-cyan-500/10 to-blue-600/5 
//                                 backdrop-blur-2xl border border-white/10 animate-float-subtle"
//                      style={{
//                        boxShadow: `
//                          0 8px 40px rgba(0, 0, 0, 0.4),
//                          0 0 100px rgba(0, 255, 255,),
//                          inset 0 0 80px rgba(255, 255, 255, 0.05)
//                        `,
//                        transform: 'translateZ(10px)',
//                      }}
//                 >
//                   {/* Dynamic Glow (bereaksi ke hover orbiting cards) */}
//                   <div 
//                     className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
//                     style={{
//                       background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.3), transparent 70%)',
//                       opacity: hoveredId ? 0.6 :,
//                       filter: 'blur(30px)',
//                     }}
//                   />
//                 </div>

//                {/* 3D Polyhedron Icon - PERFECTLY CENTERED */}
//                 <div className="absolute inset-0 flex items-center justify-center animate-spin-3d-dynamic">
//                   <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
//                     <svg 
//                       viewBox="0 0 120 120" 
//                       className="w-full h-full drop-shadow-2xl"
//                       style={{ filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))' }}
//                     >
//                       <defs>
//                         <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#67e8f9" />
//                           <stop offset="50%" stopColor="#22d3ee" />
//                           <stop offset="100%" stopColor="#0284c7" />
//                         </linearGradient>
//                         <filter id="polyGlow">
//                           <feGaussianBlur stdDeviation="8" result="blur"/>
//                           <feFlood floodColor="#22d3ee" floodOpacity="0.8"/>
//                           <feComposite in2="blur" operator="in"/>
//                           <feMerge>
//                             <feMergeNode/>
//                             <feMergeNode in="SourceGraphic"/>
//                           </feMerge>
//                         </filter>
//                       </defs>

//                       {/* Tetrahedron - Didesain ULANG agar SIMETRIS & CENTERED */}
//                       <g transform="translate(60, 52)" filter="url(#polyGlow)" className="animate-micro-pulse">
//                         {/* Top Face */}
//                         <path 
//                           d="M0,-28 L24,14 L-24,14 Z" 
//                           fill="url(#polyGradient)" 
//                           opacity="0.95"
//                         />
//                         {/* Right Face */}
//                         <path 
//                           d="M0,-28 L24,14 L0,28 Z" 
//                           fill="#22d3ee" 
//                           opacity="0.75"
//                         />
//                         {/* Left Face */}
//                         <path 
//                           d="M0,-28 L-24,14 L0,28 Z" 
//                           fill="#06b6d4" 
//                           opacity="0.7"
//                         />
//                         {/* Bottom Face */}
//                         <path 
//                           d="M-24,14 L24,14 L0,28 Z" 
//                           fill="url(#polyGradient)" 
//                           opacity="0.85"
//                         />
//                       </g>
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Minimalist Typography */}
//                 <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center animate-text-float">
//                   <h1 className="text-white font-600 text-3xl sm:text-4xl md:text-3xl tracking-[0.3em]"
//                       style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
//                   >
//                     COSMO
//                   </h1>
//                   <p className="text-white/80 font-light text-sm sm:text-base tracking-widest mt-2">
//                     3D/AR MODELS
//                   </p>
//                 </div>

//                 {/* Subtle Scan Line */}
//                 <div className="absolute inset-0 rounded-full overflow-hidden opacity-15">
//                   <div className="h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent 
//                                   animate-subtle-scan"
//                        style={{ backgroundSize: '100% 200%' }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* MOBILE: GRID */}
//             {isMobile ? (
//               <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto mt-12 sm:mt-40">
//                 {models.map((model) => {
//                   const isHovered = hoveredId === model.sku;
//                   const qrCode = qrs.get(model.sku);

//                   return (
//                     <button
//                       key={model.sku}
//                       onClick={() => onModelSelect(model)}
//                       onTouchStart={() => setHoveredId(model.sku)}
//                       onTouchEnd={() => setHoveredId(null)}
//                       className="w-full aspect-square group touch-manipulation relative"
//                     >
//                       <div
//                         className="relative cursor-pointer w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl rounded-3xl border border-cyan-400/50 overflow-hidden"
//                         style={{
//                           boxShadow: isHovered
//                             ? '0 0 70px rgba(0, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.3)'
//                             : '0 0 30px rgba(0, 255, 255,), 0 10px 20px rgba(0, 0, 0, 0.4)',
//                           transform: 'translateZ(40px)',
//                         }}
//                       >
//                         {/* Scan Animation */}
//                         <div className="absolute inset-0 opacity-30">
//                           <div
//                             className="h-full w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-card-scan-slow"
//                             style={{ backgroundSize: '100% 300%' }}
//                           />
//                         </div>

//                         {/* Icon */}
//                         <div className="relative top-[-26px] md:top-0 flex items-center justify-center h-full">
//                           <Box size={40} className={`text-cyan-300 ${isHovered ? 'text-cyan-100' : ''} drop-shadow-2xl`} />
//                         </div>

//                         {/* Info */}
//                         <div className="absolute bottom-0 left-0 right-0 py-4 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
//                           <p className="text-cyan-100 font-bold text-xs sm:text-sm tracking-wider text-center">
//                             {formatName(model.name)}
//                           </p>
//                           <p className="text-cyan-300 text-xs text-center mt-1 opacity-80">
//                             {model.category}
//                           </p>
//                         </div>

//                         {/* QR Code (Hover/Tap) */}
//                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
//                           {qrCode ? (
//                             <img src={qrCode} alt="QR" className="w-20 h-20 rounded-lg shadow-2xl" />
//                           ) : (
//                             <div className="w-20 h-20 bg-gray-200 border-2 border-dashed rounded-xl animate-pulse" />
//                           )}
//                         </div>

//                         {/* Download Button */}
//                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                           {qrCode && (
//                             <button
//                               onClick={(e) => downloadQR(e, qrCode, model.sku)}
//                               className="p-1.5 bg-cyan-500/80 text-white rounded-full hover:bg-cyan-400 transition-colors shadow-lg"
//                             >
//                               <Download size={14} />
//                             </button>
//                           )}
//                         </div>

//                         {/* Glow Pulse */}
//                         <div
//                           className={`absolute inset-0 rounded-3xl opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity pointer-events-none`}
//                           style={{
//                             background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.6), transparent 60%)',
//                             filter: 'blur(25px)',
//                             animation: isHovered ? 'pulse-glow 2s infinite' : 'none',
//                           }}
//                         />
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             ) : (
//               /* DESKTOP: ORBIT */
//               models.map((model, index) => {
//                 const total = models.length;
//                 const baseAngle = 45;
//                 const angle = baseAngle + (index * 360 / total);
//                 const radius = 320;
//                 const x = Math.cos((angle * Math.PI) / 180) * radius;
//                 const y = Math.sin((angle * Math.PI) / 180) * radius;
//                 const isHovered = hoveredId === model.sku;
//                 const qrCode = qrs.get(model.sku);

//                 return (
//                   <button
//                     key={model.sku}
//                     onClick={() => onModelSelect(model)}
//                     onMouseEnter={() => setHoveredId(model.sku)}
//                     onMouseLeave={() => setHoveredId(null)}
//                     className="absolute cursor-pointer top-1/2 left-1/2 w-50 h-50 group"
//                     style={{
//                       transform: `
//                         translate(-50%, -50%) 
//                         translateX(${x}px) 
//                         translateY(${y}px) 
//                         translateZ(${isHovered ? 50 : 30}px) 
//                         rotateY(${isHovered ? 5 : 0}deg) 
//                         rotateX(${isHovered ? -10 : 0}deg)
//                       `,
//                       transformStyle: 'preserve-3d',
//                       transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
//                     }}
//                   >
//                     <div
//                       className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl rounded-3xl border border-cyan-400/50 overflow-hidden"
//                       style={{
//                         boxShadow: isHovered
//                           ? '0 0 90px rgba(0, 255, 255, 0.3), 0 35px 70px rgba(0, 0, 0,)'
//                           : '0 0 35px rgba(0, 255, 255, 0.3), 0 15px 35px rgba(0, 0, 0, 0.5)',
//                         transform: 'translateZ(60px)',
//                       }}
//                     >
//                       {/* Scan Animation */}
//                       <div className="absolute inset-0 opacity-30">
//                         <div
//                           className="h-full w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-card-scan-slow"
//                           style={{ backgroundSize: '100% 300%' }}
//                         />
//                       </div>

//                       {/* Icon */}
//                       <div className="relative top-[-30px] flex items-center justify-center h-full z-10">
//                         <Box size={80} className="text-cyan-400 drop-shadow-glow" />
//                       </div>

//                       {/* Info */}
//                       <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
//                         <p className="text-cyan-100 font-bold text-md mx-auto text-center tracking-widest drop-shadow-lg">
//                           {formatName(model.name)}
//                         </p>
//                         <p className="text-cyan-300 text-sm text-center mt-1 opacity-80">
//                           {model.category}
//                         </p>
//                       </div>

//                       {/* QR Code (Hover) */}
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
//                         {qrCode ? (
//                           <img src={qrCode} alt="QR" className="w-24 h-24 rounded-lg shadow-2xl" />
//                         ) : (
//                           <div className="w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl animate-pulse" />
//                         )}
//                       </div>

//                       {/* Download Button */}
//                       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
//                         {qrCode && (
//                           <button
//                             onClick={(e) => downloadQR(e, qrCode, model.sku)}
//                             className="p-2 bg-cyan-500/90 text-white rounded-full hover:bg-cyan-400 transition-all shadow-lg"
//                           >
//                             <Download size={16} />
//                           </button>
//                         )}
//                       </div>

//                       {/* Glow Pulse */}
//                       <div
//                         className={`absolute inset-0 rounded-3xl opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity pointer-events-none`}
//                         style={{
//                           background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.7), transparent 60%)',
//                           filter: 'blur(35px)',
//                           animation: isHovered ? 'pulse-glow 2s infinite' : 'none',
//                         }}
//                       />
//                     </div>
//                   </button>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { Box, Download, RefreshCcw } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { generateQRWithLogo } from './utils/generateQrCode';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://vr.kiraproject.id';

const formatName = (str) =>
  str
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function ModelSelector({ onModelSelect }) {
  // === SEMUA HOOK DI ATAS ===
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSku, setHoveredSku] = useState(null);
  const [qrs, setQRs] = useState(new Map());
  const isGenerating = useRef(false); // CEGAH LOOP

  // === FETCH PRODUK ===
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/products`);
        const json = await res.json();

        console.log('json.data', json.data)

        if (json.success && Array.isArray(json.data)) {
          const formatted = json.data.map((p) => ({
            filename: p.modelUrl?.split('/').pop() || p.sku,
            name: p.name || p.sku,
            size: p.modelSize || 0,
            category: p.category
              ? p.category
              : 'Unknown',
            fullUrl: p.modelUrl?.startsWith('http')
              ? p.modelUrl
              : `${API_BASE}${p.modelUrl}`,
            description: p.description || 'Model 3D produk premium.',
            sku: p.sku,
            desc_left: {
              title: 'Keunggulan Produk',
              list: p.features?.split('\n') || ['Kualitas premium', 'Desain eksklusif'],
            },
            desc_right: {
              title: 'Untuk Siapa?',
              value: p.target || 'Konsumen modern yang mengutamakan kualitas.',
            },
            system: p.system || 'Premium Product',
            benefits: p.benefits || [],
            usage: p.usage || [],
            certifications: p.certifications || [],
            tags: p.tags || [],
          }));
          setModels(formatted);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('Gagal fetch produk:', err);
        setError('Gagal memuat produk. Coba refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // === GENERATE QR: HANYA SEKALI, TIDAK LOOP ===
  useEffect(() => {
    if (models.length === 0 || isGenerating.current) return;

    isGenerating.current = true;
    const baseUrl = 'https://cosmo.kiraproject.id/ar';
    const qrMap = new Map(qrs);

    const generateAll = async () => {
      for (const model of models) {
        if (qrMap.has(model.sku)) continue;

        try {
          const url = `${baseUrl}/${model.sku}`;
          const qr = await generateQRWithLogo(url, '/logo.jpg');
          qrMap.set(model.sku, qr);
        } catch (err) {
          console.warn(`QR gagal: ${model.sku}`, err);
        }
      }
      setQRs(qrMap);
    };

    generateAll().finally(() => {
      isGenerating.current = false;
    });
  }, [models]); // HANYA DEPENDENCY: models

  // === DOWNLOAD QR ===
  const downloadQR = (e, base64, sku) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = base64;
    link.download = `COSMO-QR-${sku}.png`;
    link.click();
  };

  // === RENDER: TIDAK ADA RETURN SEBELUM INI ===
  return (
    <div className="w-full max-w-7xl mx-auto px-1 md:px-4 py-12">
      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="flex gap-3 items-center justify-center bg-white/20 backdrop-blur-2xl py-2 rounded-md w-max h-max px-4 mx-auto text-white">
          <p>{error}</p>
          <div onClick={() => window.location.reload()} className='h-[30px] w-[30px] cursor-pointer hover:brightness-95 active:scale-[0.98] flex items-center justify-center bg-red-500 text-white rounded-md'>
            <RefreshCcw size={16} />  
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && models.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Box className="w-16 h-16 mb-4 opacity-50" />
          <p>Tidak ada produk tersedia.</p>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && models.length > 0 && (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {models.map((model, i) => {
              const isHovered = hoveredSku === model.sku;
              const qrCode = qrs.get(model.sku);

              return (
                <motion.div
                  key={model.sku}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onModelSelect(model)}
                  onMouseEnter={() => setHoveredSku(model.sku)}
                  onMouseLeave={() => setHoveredSku(null)}
                  className="group relative cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <div className="relative h-full bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <model-viewer
                        src={model.fullUrl}
                        alt={model.name}
                        camera-controls
                        auto-rotate
                        rotation-per-second="30deg"
                        className="w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-5 space-y-1">
                      <h3 className="font-bold text-lg text-gray-800 truncate">
                        {formatName(model.name)}
                      </h3>
                      <p className="text-sm text-gray-500">{model.category}</p>
                    </div>

                   <AnimatePresence>
                      {isHovered && qrCode && (
                        <motion.div
                          initial={{ display: 'hidden', transition: {duration: 0} }}
                          animate={{ 
                            display: 'visible',
                            transition: { duration: 0, ease: 'easeOut' }
                          }}
                          exit={{ 
                            display: 'hidden',
                            transition: { duration: 0, ease: 'easeIn' }
                          }}
                          // Pastikan tidak ada interaksi saat exit
                          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
                          className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10 p-6 rounded-xl"
                        >
                          <div className="text-center space-y-3">
                            <img 
                              src={qrCode} 
                              alt="QR Code" 
                              className="w-48 h-48 mx-auto rounded-xl shadow-xl border border-gray-200"
                            />
                            <p className="text-sm text-gray-600 font-normal">Scan untuk buka AR</p>
                            <button
                              onClick={(e) => downloadQR(e, qrCode, model.sku)}
                              className="cursor-pointer hover:brightness-90 active:scale-[0.98] flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs rounded-md hover:shadow-md transition-shadow"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}