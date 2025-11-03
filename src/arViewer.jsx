import '@google/model-viewer';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Camera, Check, Download, Home, Info, Link, Share2, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ARViewer({ modelUrl, onBack }) {
  const modelViewerRef = useRef(null);
  const [arStatus, setArStatus] = useState(''); // 'not-started', 'session-started', 'failed'
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Zoom state
  const [cameraDistance, setCameraDistance] = useState(2); // jarak awal
  const minDistance = 0.5;
  const maxDistance = 10;

  // -------------------------------------------------
  // Model-viewer event listeners
  // -------------------------------------------------
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => setIsLoading(false);
    const handleARStatus = (e) => setArStatus(e.detail.status);
    const handleError = (e) => {
      console.error('Model Viewer Error:', e);
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
  }, []);

  // -------------------------------------------------
  // Update camera distance
  // -------------------------------------------------
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (viewer && !isLoading) {
      viewer.cameraOrbit = `0deg 75deg ${cameraDistance}m`;
      viewer.fieldOfView = '30deg';
    }
  }, [cameraDistance, isLoading]);

  // -------------------------------------------------
  // Custom Pinch Zoom Handler
  // -------------------------------------------------
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer || isLoading) return;

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

        // Sensitivitas zoom (semakin kecil = semakin halus)
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
  }, [cameraDistance, isLoading]);

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
      const response = await fetch(modelUrl);
      if (!response.ok) throw new Error('Gagal mengambil file');

      const blob = await response.blob();
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
      alert('Gagal mengunduh file. Pastikan URL model dapat diakses secara publik.');
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
  // Render
  // -------------------------------------------------
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-cyan-950 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-600/30 to-pink-600/30 animate-pulse" />
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
        // Nonaktifkan zoom default
        touch-action="none"
        style={{ width: '100%', height: '100%' }}
        className="touch-none select-none"
      >
        {/* Loading Poster */}
        <div
          slot="poster"
          className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-900 to-purple-900"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Memuat Model 3D...</p>
          </div>
        </div>
      </model-viewer>

      {/* Status Bar */}
      <div className="w-full absolute top-4">
        <div className="left-4 right-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl pointer-events-auto">
          <div className="md:flex md:space-y-0 space-y-2 items-center justify-between">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-md p-1 px-2">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-white font-semibold text-sm">
                {isARActive ? 'AR Mode Aktif' : 'Preview 3D BY Cosmo'}
              </span>
            </div>
            <ul className="text-white/80 hidden md:flex gap-2 md:space-y-0 space-y-2 text-xs">
              <li className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-md p-1 px-2">
                • Putar: 1 jari | Zoom: cubit (halus & terkendali)
              </li>
              <li className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-md p-1 px-2">
                • Tekan <strong>Masuk AR</strong> → arahkan ke lantai
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="w-full justify-center gap-3 absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center pointer-events-auto px-4 max-w-lg">
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memuat...
            </motion.div>
          ) : arStatus === 'failed' ? (
            <motion.div
              key="error"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-red-600 text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 text-sm"
            >
              <Info className="w-4 h-4" />
              AR Gagal
            </motion.div>
          ) : isARActive ? (
            <motion.button
              key="exit"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm w-full sm:w-auto justify-center hover:scale-105 cursor-pointer transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden md:inline">Keluar AR</span>
            </motion.button>
          ) : (
            <motion.button
              key="start"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={startAR}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm w-full sm:w-auto justify-center hover:scale-105 cursor-pointer transition-all"
            >
              <Box className="w-4 h-4" />
              <span className="hidden md:inline">Masuk AR</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Back */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={onBack}
          className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 cursor-pointer hover:bg-white/20 transition-all flex items-center gap-2 text-sm mt-2 sm:mt-0"
        >
          <Home className="w-4 h-4" />
        </motion.button>

        {/* Download */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleDownload}
          disabled={downloading || !modelUrl}
          className="relative flex items-center gap-2 px-4 py-3 rounded-full font-bold shadow-xl text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-105 cursor-pointer transition-all mt-2 sm:mt-0 disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden md:inline">{downloading ? '...' : 'Download'}</span>
        </motion.button>

        {/* Share */}
        <div className="relative mt-2 sm:mt-0">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 cursor-pointer transition-all flex items-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">Share</span>
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/20 transition-all text-sm"
                >
                  {shareStatus === 'copied' ? <Check className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4" />}
                  {shareStatus === 'copied' ? 'Tersalin!' : 'Salin Link'}
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/20 transition-all text-sm border-t border-white/20"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
  );
}