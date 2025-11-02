import { useEffect, useState } from 'react';

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  return (
    <div className="relative w-screen h-96 md:h-screen">
      {/* Model Viewer */}
        <model-viewer
        src="https://vr.kiraproject.id/models/box-sample.glb"
        camera-controls
        auto-rotate
        loading="lazy"
        className="w-full h-full"
      >
        <div slot="poster" className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat model 3D...</p>
          </div>
        </div>

        <button
          slot="ar-button"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 
                     bg-black text-white px-6 py-3 rounded-lg 
                     text-base font-medium z-10 shadow-lg 
                     hover:bg-gray-800 transition-colors"
        >
          Lihat di Ruangan Anda
        </button>
      </model-viewer>

      {/* Overlay Desktop */}
      {!isMobile && (
        <div
          className="absolute inset-0 
                     bg-black/70 text-white 
                     flex flex-col items-center justify-center 
                     text-center p-5 rounded-xl 
                     font-sans backdrop-blur-sm"
        >
          <p className="text-lg md:text-xl font-medium">
            Untuk melihat AR, buka halaman ini di <strong className="font-bold">HP</strong> menggunakan{' '}
            <strong className="font-bold">Chrome</strong> atau <strong className="font-bold">Safari</strong>
          </p>
          <p className="text-sm md:text-base mt-3 opacity-90">
            Arahkan kamera ke lantai → model akan muncul!
          </p>
        </div>
      )}
    </div>
  );
};

export default App;