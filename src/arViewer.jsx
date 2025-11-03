
import '@google/model-viewer';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Camera, Check, Download, Home, Info, Link, Share2, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ARViewer({ modelUrl, onBack }) {
  const modelViewerRef = useRef(null);
  const [arStatus, setArStatus] = useState(''); // 'not-started', 'session-started', 'failed'
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  console.log('modeUrl', modelUrl)

  // Zoom state
  const [cameraDistance, setCameraDistance] = useState(2);
  const minDistance = 0.5;
  const maxDistance = 10;

  // -------------------------------------------------
  // DEBUG: Cek modelUrl
  // -------------------------------------------------
  useEffect(() => {
    console.log('[ARViewer] modelUrl:', modelUrl);
    if (!modelUrl) {
      setLoadError('URL model tidak diberikan.');
      setIsLoading(false);
    } else if (!modelUrl.startsWith('http')) {
      setLoadError('URL model tidak valid (harus dimulai dengan http/https).');
      setIsLoading(false);
    }
  }, [modelUrl]);

  // -------------------------------------------------
  // Model-viewer event listeners
  // -------------------------------------------------
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer || loadError) return;

    const handleLoad = () => {
      console.log('[ModelViewer] Load success');
      setIsLoading(false);
      setLoadError(null);
    };

    const handleARStatus = (e) => {
      console.log('[ModelViewer] AR Status:', e.detail.status);
      setArStatus(e.detail.status);
    };

    const handleError = (e) => {
      console.error('[ModelViewer] Error:', e.detail);
      const errorMsg = e.detail?.sourceError?.message || 'Gagal memuat model';
      setLoadError(errorMsg);
      setIsLoading(false);
      setArStatus('failed');
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('ar-status', handleARStatus);
    viewer.addEventListener('error', handleError);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('ar-status', handleARStatus);
      viewer.removeEventListener('error', handleError);
    };
  }, [loadError]);

  // -------------------------------------------------
  // Update camera distance
  // -------------------------------------------------
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer && !isLoading && !loadError) {
      viewer.cameraOrbit = `0deg 75deg ${cameraDistance}m`;
      viewer.fieldOfView = '30deg';
    }
  }, [cameraDistance, isLoading, loadError]);

  // -------------------------------------------------
  // Custom Pinch Zoom Handler
  // -------------------------------------------------
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer || isLoading || loadError) return;

    let startDistance = 0;
    let isPinching = false;

    const getPinchDistance = (touches) => {
      const [t1, t2] = touches;
      return Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isPinching = true;
        startDistance = getPinchDistance(e.touches);
      }
    };

    const handleTouchMove = (e) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getPinchDistance(e.touches);
        const delta = startDistance - currentDistance;
        const sensitivity = 0.001;
        const newDistance = cameraDistance + delta * sensitivity;

        setCameraDistance(prev => {
          const clamped = Math.max(minDistance, Math.min(maxDistance, newDistance));
          return clamped;
        });

        startDistance = currentDistance;
      }
    };

    const handleTouchEnd = () => {
      isPinching = false;
    };

    viewer.addEventListener('touchstart', handleTouchStart, { passive: false });
    viewer.addEventListener('touchmove', handleTouchMove, { passive: false });
    viewer.addEventListener('touchend', handleTouchEnd);

    return () => {
      viewer.removeEventListener('touchstart', handleTouchStart);
      viewer.removeEventListener('touchmove', handleTouchMove);
      viewer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [cameraDistance, isLoading, loadError]);

  // -------------------------------------------------
  // AR activation
  // -------------------------------------------------
  const startAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  // -------------------------------------------------
  // DOWNLOAD .glb
  // -------------------------------------------------
  const handleDownload = async () => {
    if (!modelUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(modelUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      if (!blob.type.includes('model/gltf-binary') && !blob.type.includes('octet-stream')) {
        throw new Error('File bukan format .glb');
      }

      const url = URL.createObjectURL(blob);
      const fileName = modelUrl.split('/').pop()?.split('?')[0] ?? 'model.glb';

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Gagal mengunduh: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // -------------------------------------------------
  // SHARE
  // -------------------------------------------------
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(modelUrl);
      setShareStatus('copied');
      setTimeout(() => {
        setShareStatus('');
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      alert('Gagal menyalin link.');
    }
  };

  const shareToWhatsApp = () => {
    const text = `Lihat model 3D ini: ${modelUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setShareStatus('whatsapp');
    setTimeout(() => {
      setShareStatus('');
      setShowShareMenu(false);
    }, 1000);
  };

  const isARActive = arStatus === 'session-started';

  // -------------------------------------------------
  // RENDER: Validasi modelUrl & Error Handling
  // -------------------------------------------------
  if (!modelUrl || !modelUrl.startsWith('https')) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white space-y-6 px-4">
        <Info className="w-12 h-12 text-red-400" />
        <div className="text-center max-w-md">
          <h3 className="text-xl font-bold mb-2">Model Tidak Tersedia</h3>
          <p className="text-sm text-white/70">
            URL model tidak valid atau tidak diberikan.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-3 md:px-6 py-3 bg-cyan-600 rounded-full font-medium hover:scale-105 transition-all flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Kembali
        </button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white space-y-6 px-4">
        <Info className="w-12 h-12 text-yellow-400" />
        <div className="text-center max-w-md">
          <h3 className="text-xl text-black font-bold mb-2">Gagal Memuat Model</h3>
          <p className="text-sm  text-black/80 break-words">{loadError}</p>
          <p className="text-xs  text-black/80 mt-2">Cek URL, CORS, atau format file (.glb)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-emerald-600 rounded-full text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Coba Download
          </button>
          <button
            onClick={onBack}
            className="px-5 py-2 bg-cyan-600 rounded-full text-sm flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // Render Utama
  // -------------------------------------------------
  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-b from-black via-cyan-950 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-600/30 to-pink-600/30 animate-pulse" />
      </div>

      {/* Animated Grid Floor Background — LEBAR & PENUH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 255, 255, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 255, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center bottom',
            
            // Kunci: scale besar + geser ke bawah
            transform: `
              perspective(300px) 
              rotateX(45deg) 
              scale(3.2) 
              translateY(0%)
      `,
      transformOrigin: 'center bottom',
      
      animation: 'gridMove 18s linear infinite',
      filter: 'brightness(1.3)', // opsional: lebih cerah
    }}
  />
</div>

      {/* Optional: Tambahan efek glow di tengah */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse" />
      </div>

      {/* Model Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt="3D Model AR"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        camera-controls
        shadow-intensity="1.5"
        exposure="1.0"
        field-of-view="30deg"
        min-camera-orbit="auto auto 0.1m"
        max-camera-orbit="auto auto 600m"
        interaction-prompt="none"
        crossorigin="anonymous"
        loading="eager"
        touch-action="none"
        style={{ width: '100%', height: '100%' }}
        className="touch-none select-none"
      >
        {/* Loading Poster */}
        <div
          slot="poster"
          className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-900 to-brand-800"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Memuat Model 3D...</p>
          </div>
        </div>
      </model-viewer>

      {/* Status Bar */}
      <div className="w-full absolute top-4 px-4 z-50">
        <div className="max-w-[94vw] mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between gap-3">

            {/* Status Label */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-md py-1.5 px-3">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-white font-medium text-xs md:text-sm">
                {isARActive ? 'AR Mode Aktif' : 'Preview 3D'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">

              {/* AR Control Button */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="cursor-pointer active:scale-[0.98] hover:brightness-95bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-4 rounded-full font-medium text-xs md:text-sm flex items-center gap-1.5 shadow-lg"
                  >
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </motion.div>
                ) : arStatus === 'failed' ? (
                  <motion.div
                    key="error"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="cursor-pointer active:scale-[0.98] hover:brightness-95 bg-red-600 text-white py-2 px-4 rounded-full font-medium text-xs md:text-sm flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                    AR Gagal
                  </motion.div>
                ) : isARActive ? (
                  <motion.button
                    key="exit"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={() => window.history.back()}
                    className="cursor-pointer active:scale-[0.98] hover:brightness-95 bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-full font-medium text-xs md:text-sm flex items-center gap-1.5 hover:scale-105 transition-all shadow-lg"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Keluar AR</span>
                  </motion.button>
                ) : (
                  <motion.button
                    key="start"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={startAR}
                    className="cursor-pointer active:scale-[0.98] hover:brightness-95 h-9 w-9 md:w-max md:h-max bg-gradient-to-r from-cyan-500 to-blue-600 text-white md:py-2 md:px-4 rounded-full font-medium text-xs justify-center md:text-sm flex items-center gap-1.5 hover:scale-105 transition-all shadow-lg"
                  >
                    <Box className="w-4 md:w-3.5 h-4 md:h-3.5" />
                    <span className="hidden md:inline">Masuk AR</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Back Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                onClick={onBack}
                className="cursor-pointer active:scale-[0.98] hover:brightness-95 p-2.5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full shadow-md hover:scale-105 hover:bg-white/20 transition-all"
              >
                <Home className="w-4 h-4" />
              </motion.button>

              {/* Download Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={handleDownload}
                disabled={downloading}
                className="cursor-pointer active:scale-[0.98] hover:brightness-95 p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-md hover:scale-105 transition-all disabled:opacity-50"
              >
                {downloading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </motion.button>

              {/* Share Button + Dropdown */}
              <div className="relative">
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="cursor-pointer active:scale-[0.98] hover:brightness-95 p-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-md hover:scale-105 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute top-[150%] mb-2 right-0 w-40 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-xl overflow-hidden z-50 text-xs"
                    >
                      <button
                        onClick={copyToClipboard}
                        className="w-full cursor-pointer px-3 py-2.5 flex items-center gap-2 text-white hover:bg-white/20 transition-all"
                      >
                        {shareStatus === 'copied' ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Link className="w-3.5 h-3.5" />
                        )}
                        {shareStatus === 'copied' ? 'Tersalin!' : 'Salin Link'}
                      </button>
                      <button
                        onClick={shareToWhatsApp}
                        className="w-full cursor-pointer px-3 py-2.5 flex items-center gap-2 text-white hover:bg-white/20 transition-all border-t border-white/20"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.488" />
                        </svg>
                        WhatsApp
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}