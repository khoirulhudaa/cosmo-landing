import { Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'

// Data dari API (contoh: kamu bisa fetch dari API)
const API_DATA = [
  {
    filename: "toilet.glb",
    name: "toilet",
    size: 6602832,
    sizeFormatted: "6.3 MB",
    fullUrl: "https://vr.kiraproject.id/models/toilet.glb"
  },
  {
    filename: "shoe.glb",
    name: "shoe",
    size: 8947140,
    sizeFormatted: "8.53 MB",
    fullUrl: "https://vr.kiraproject.id/models/shoe.glb"
  },
  {
    filename: "product-sample.glb",
    name: "product-sample",
    size: 6540,
    sizeFormatted: "6.39 KB",
    fullUrl: "https://vr.kiraproject.id/models/product-sample.glb"
  },
  {
    filename: "machine.glb",
    name: "machine",
    size: 27500964,
    sizeFormatted: "26.23 MB",
    fullUrl: "https://vr.kiraproject.id/models/machine.glb"
  },
  {
    filename: "box-sample.glb",
    name: "box-sample",
    size: 1664,
    sizeFormatted: "1.63 KB",
    fullUrl: "https://vr.kiraproject.id/models/box-sample.glb"
  },
  {
    filename: "astronaut.glb",
    name: "astronaut",
    size: 2869044,
    sizeFormatted: "2.74 MB",
    fullUrl: "https://vr.kiraproject.id/models/astronaut.glb"
  },
  {
    filename: "TissueCosmo.glb",
    name: "TissueCosmo",
    size: 70817700,
    sizeFormatted: "67.54 MB",
    fullUrl: "https://vr.kiraproject.id/models/TissueCosmo.glb"
  },
  {
    filename: "BSP_TORRENS.glb",
    name: "BSP_TORRENS",
    size: 66046832,
    sizeFormatted: "62.99 MB",
    fullUrl: "https://vr.kiraproject.id/models/BSP_TORRENS.glb"
  },
];

const formatName = (str) => {
  return str
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ModelSelector({ onModelSelect }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Deteksi mobile + mouse tracking
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  const orbitingModels = API_DATA;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center md:mt-20 p-4 md:p-8">
        <div 
          className="w-full md:w-7xl mx-auto"
          style={{ perspective: '1600px' }}
        >
          <div className="h-max" style={{ transformStyle: 'preserve-3d' }}>

            {/* CENTRAL HUB - INTERACTIVE 3D MODERN PORTAL */}
            <div 
              className="md:flex hidden absolute bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl border-2 border-cyan-700/70 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              style={{ 
                transform: `translateZ(160px) rotateX(${mouse.y * 0.6}deg) rotateY(${mouse.x * 0.6}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center">
                
                {/* Glassmorphic Orb Background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-cyan-500/10 to-blue-600/5 
                                backdrop-blur-2xl border border-white/10 animate-float-subtle"
                     style={{
                       boxShadow: `
                         0 8px 40px rgba(0, 0, 0, 0.4),
                         0 0 100px rgba(0, 255, 255, 0.2),
                         inset 0 0 80px rgba(255, 255, 255, 0.05)
                       `,
                       transform: 'translateZ(10px)',
                     }}
                >
                  {/* Dynamic Glow (bereaksi ke hover orbiting cards) */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.3), transparent 70%)',
                      opacity: hoveredId ? 0.6 : 0.2,
                      filter: 'blur(30px)',
                    }}
                  />
                </div>

               {/* 3D Polyhedron Icon - PERFECTLY CENTERED */}
                <div className="absolute inset-0 flex items-center justify-center animate-spin-3d-dynamic">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
                    <svg 
                      viewBox="0 0 120 120" 
                      className="w-full h-full drop-shadow-2xl"
                      style={{ filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))' }}
                    >
                      <defs>
                        <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#67e8f9" />
                          <stop offset="50%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <filter id="polyGlow">
                          <feGaussianBlur stdDeviation="8" result="blur"/>
                          <feFlood floodColor="#22d3ee" floodOpacity="0.8"/>
                          <feComposite in2="blur" operator="in"/>
                          <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Tetrahedron - Didesain ULANG agar SIMETRIS & CENTERED */}
                      <g transform="translate(60, 52)" filter="url(#polyGlow)" className="animate-micro-pulse">
                        {/* Top Face */}
                        <path 
                          d="M0,-28 L24,14 L-24,14 Z" 
                          fill="url(#polyGradient)" 
                          opacity="0.95"
                        />
                        {/* Right Face */}
                        <path 
                          d="M0,-28 L24,14 L0,28 Z" 
                          fill="#22d3ee" 
                          opacity="0.75"
                        />
                        {/* Left Face */}
                        <path 
                          d="M0,-28 L-24,14 L0,28 Z" 
                          fill="#06b6d4" 
                          opacity="0.7"
                        />
                        {/* Bottom Face */}
                        <path 
                          d="M-24,14 L24,14 L0,28 Z" 
                          fill="url(#polyGradient)" 
                          opacity="0.85"
                        />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Minimalist Typography */}
                <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center animate-text-float">
                  <h1 className="text-white font-600 text-3xl sm:text-4xl md:text-3xl tracking-[0.3em]"
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                  >
                    COSMO
                  </h1>
                  <p className="text-white/80 font-light text-sm sm:text-base tracking-widest mt-2">
                    3D/AR MODELS
                  </p>
                </div>

                {/* Subtle Scan Line */}
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-15">
                  <div className="h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent 
                                  animate-subtle-scan"
                       style={{ backgroundSize: '100% 200%' }}
                  />
                </div>
              </div>
            </div>

            {/* LAYOUT: Mobile = Grid/List, Desktop = Orbit */}
            {isMobile ? (
              /* === MOBILE: GRID 2 KOLOM === */
              <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto mt-32 sm:mt-40">
                {orbitingModels.map((model) => {
                  const isHovered = hoveredId === model.filename;

                  return (
                    <button
                      key={model.filename}
                      onClick={() => onModelSelect(model.fullUrl)}
                      onTouchStart={() => setHoveredId(model.filename)}
                      onTouchEnd={() => setHoveredId(null)}
                      className="w-full aspect-square group touch-manipulation"
                    >
                      <div 
                        className="relative cursor-pointer w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl rounded-3xl border border-cyan-400/50 overflow-hidden"
                        style={{
                          boxShadow: isHovered 
                            ? '0 0 70px rgba(0, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.3)'
                            : '0 0 30px rgba(0, 255, 255, 0.2), 0 10px 20px rgba(0, 0, 0, 0.4)',
                          transform: 'translateZ(40px)',
                        }}
                      >
                        {/* Scan Line */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-card-scan-slow" 
                            style={{ backgroundSize: '100% 300%' }} 
                          />
                        </div>

                        {/* Icon */}
                        <div className="flex items-center justify-center h-full">
                          <Box size={40} className={`text-cyan-300 ${isHovered ? 'text-cyan-100' : ''} drop-shadow-2xl`} />
                        </div>

                        {/* Label + Size */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
                          <p className="text-cyan-100 font-bold text-xs sm:text-sm tracking-wider text-center">
                            {formatName(model.name)}
                          </p>
                          <p className="text-cyan-300 text-xs text-center mt-1 opacity-80">
                            {model.sizeFormatted}
                          </p>
                        </div>

                        {/* Glow */}
                        <div 
                          className={`absolute inset-0 rounded-3xl opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity pointer-events-none`}
                          style={{
                            background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.6), transparent 60%)',
                            filter: 'blur(25px)',
                            animation: isHovered ? 'pulse-glow 2s infinite' : 'none',
                          }} 
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* === DESKTOP: ORBIT MELINGKAR (sama seperti asli) === */
              orbitingModels.map((model, index) => {
                const total = orbitingModels.length;
                const angle = (index * 360) / total;
                const radius = window.innerWidth < 768 ? 260 : 380;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isHovered = hoveredId === model.filename;

                return (
                  <button
                    key={model.filename}
                    onClick={() => onModelSelect(model.fullUrl)}
                    onMouseEnter={() => setHoveredId(model.filename)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute cursor-pointer top-1/2 left-1/2 w-50 h-50 group"
                    style={{
                      transform: `
                        translate(-50%, -50%) 
                        translateX(${x}px) 
                        translateY(${y}px) 
                        translateZ(${isHovered ? 50 : 30}px) 
                        rotateY(${isHovered ? 5 : 0}deg) 
                        rotateX(${isHovered ? -10 : 0}deg)
                      `,
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                    }}
                  >
                    {/* CARD SAMA SEPERTI ASLI */}
                    <div 
                      className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-2xl rounded-3xl border border-cyan-400/50 overflow-hidden"
                      style={{
                        boxShadow: isHovered 
                          ? '0 0 90px rgba(0, 255, 255, 0.3), 0 35px 70px rgba(0, 0, 0, 0.2)'
                          : '0 0 35px rgba(0, 255, 255, 0.3), 0 15px 35px rgba(0, 0, 0, 0.5)',
                        transform: 'translateZ(60px)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-30">
                        <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-card-scan-slow" 
                          style={{ backgroundSize: '100% 300%' }} 
                        />
                      </div>

                      <div className='relative top-[-30px] flex items-center justify-center h-full z-10'>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                          <Box size={80} className="text-cyan-400 drop-shadow-glow" />
                        </motion.div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
                        <p className="text-cyan-100 font-bold text-md mx-auto text-center tracking-widest drop-shadow-lg">
                          {formatName(model.name)}
                        </p>
                        <p className="text-cyan-300 text-sm text-center mt-1 opacity-80">
                          {model.sizeFormatted}
                        </p>
                      </div>

                      <div 
                        className={`absolute inset-0 rounded-3xl opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity pointer-events-none`}
                        style={{
                          background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.7), transparent 60%)',
                          filter: 'blur(35px)',
                          animation: isHovered ? 'pulse-glow 2s infinite' : 'none',
                        }} 
                      />
                    </div>

                    {/* Line to Center */}
                    <div
                      className="absolute top-1/2 left-1/2 w-full h-px origin-left opacity-50"
                      style={{
                        background: 'linear-gradient(to right, rgba(0, 255, 255, 0.9), transparent)',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) scaleX(${isHovered ? 1.4 : 0.9})`,
                        transformOrigin: '0 0',
                        boxShadow: '0 0 14px rgba(0, 255, 255, 0.8)',
                      }}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Animasi Global */}
     <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes card-scan-slow {
              0%, 100% { background-position: 0% 0%; }
              50% { background-position: 0% 100%; }
            }
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
            .animate-card-scan-slow { animation: card-scan-slow 6s infinite linear; }
            .animate-pulse-glow { animation: pulse-glow 2s infinite; }
          `,
        }}
      />
    </>
  );
}