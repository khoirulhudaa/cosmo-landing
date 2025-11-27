// // src/components/ModelSelector.jsx
// import { AnimatePresence, motion } from "framer-motion";
// import { Download } from "lucide-react";
// import { useEffect, useState } from "react";

// const API_BASE = "https://vr.kiraproject.id";

// const formatName = (str) => 
//   str
//     .replace(/-/g, " ")
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// export default function ModelSelector({ onModelSelect }) {
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hoveredSku, setHoveredSku] = useState(null);

//   // Mapping SKU ke QR statis (sesuaikan dengan SKU produkmu)
//   const qrMap = {
//     "cosmo-royal-blue": "/assets/qr1.png",
//     "cosmo-emerald-green": "/assets/qr2.png",
//     "cosmo-premium-black": "/assets/qr3.png",
//     "cosmo-luxury-white": "/assets/qr4.png",
//     // Tambah lagi kalau ada produk baru
//     // "sku-baru": "/assets/qr5.png",
//   };

//   // Fallback otomatis pakai qr1-qr4 berulang
//   const getQRImage = (sku, index) => {
//     return qrMap[sku] || `/assets/qr${(index % 4) + 1}.png`;
//   };

//   // Fetch produk dari API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_BASE}/api/products`);
//         const json = await res.json();

//         if (json.success && Array.isArray(json.data)) {
//           const formatted = json.data.map((p, i) => {
//             let secureModelUrl = "";

//             if (p.modelUrl) {
//               if (p.modelUrl.startsWith("http://")) {
//                 secureModelUrl = p.modelUrl.replace("http://", "https://");
//               } else if (p.modelUrl.startsWith("https://")) {
//                 secureModelUrl = p.modelUrl;
//               } else {
//                 secureModelUrl = `${API_BASE}${p.modelUrl.startsWith("/") ? "" : "/"}${p.modelUrl}`;
//               }
//             }

//             return {
//               name: p.name || formatName(p.sku),
//               price: p.price || 0,
//               category: p.category || "Premium",
//               fullUrl: "/assets/cosmo2.glb",
//               // fullUrl: secureModelUrl || "/assets/cosmo2.glb",
//               description: p.description || "Model 3D produk premium.",
//               sku: p.sku,
//             };
//           });

//           setModels(formatted);
//         } else {
//           throw new Error(json.message || "Data tidak valid");
//         }
//       } catch (err) {
//         console.error("Gagal fetch produk:", err);
//         setError("Gagal memuat produk. Periksa koneksi internet.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 py-12">
//       {/* Loading */}
//       {loading && (
//         <div className="flex items-center justify-center py-32">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="text-center py-20">
//           <p className="text-red-400 text-lg mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition"
//           >
//             Coba Lagi
//           </button>
//         </div>
//       )}

//       {/* Empty */}
//       {!loading && !error && models.length === 0 && (
//         <div className="text-center py-32 text-gray-500">
//           <p className="text-2xl">Belum ada produk tersedia</p>
//         </div>
//       )}

//       {/* Grid Produk */}
//       {!loading && !error && models.length > 0 && (
//         <motion.div
//           layout
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//         >
//           {models.map((model, index) => {
//             const isHovered = hoveredSku === model.sku;
//             const qrImage = getQRImage(model.sku, index);

//             return (
//               <motion.div
//                 key={model.sku}
//                 layout
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 onClick={() => onModelSelect(model)}
//                 onMouseEnter={() => setHoveredSku(model.sku)}
//                 onMouseLeave={() => setHoveredSku(null)}
//                 className="group relative cursor-pointer"
//                 whileHover={{ y: -12 }}
//               >
//                 <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden transition-all duration-300">
//                   {/* 3D Model */}
//                   <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
//                     <model-viewer
//                       src={model.fullUrl}
//                       alt={model.name}
//                       camera-controls
//                       auto-rotate
//                       rotation-per-second="20deg"
//                       loading="eager"
//                       className="w-full h-full"
//                       shadow-intensity="1"
//                       exposure="1"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//                   </div>

//                   {/* Info */}
//                   <div className="p-6 text-white">
//                     <h3 className="font-bold text-xl truncate">{model.name}</h3>
//                     <div className="flex justify-between items-center mt-3">
//                       <span className="text-sm opacity-80">{model.category}</span>
//                       <span className="font-bold text-lg">
//                         {new Intl.NumberFormat("id-ID", {
//                           style: "currency",
//                           currency: "IDR",
//                           minimumFractionDigits: 0,
//                         }).format(model.price)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* QR Overlay saat Hover */}
//                   <AnimatePresence>
//                     {isHovered && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="absolute inset-0 bg-white/98 backdrop-blur-lg flex items-center justify-center z-20 p-8"
//                       >
//                         <div className="text-center space-y-6">
//                           <img
//                             src={qrImage}
//                             alt={`QR ${model.name}`}
//                             className="w-50 h-50 mx-auto rounded-2xl shadow-2xl border-8 border-white"
//                           />
//                           <div>
//                             <p className="text-xl font-bold text-gray-800">Scan untuk AR</p>
//                             <p className="text-sm text-gray-600 mt-1">Arahkan kamera ke QR Code</p>
//                           </div>
//                           <a
//                             href={qrImage}
//                             download={`COSMO-QR-${model.sku}.png`}
//                             onClick={(e) => e.stopPropagation()}
//                             className="cursor-pointer hover:brightness-90 active:scale-[0.98] flex items-center justify-center gap-1.5 mx-auto px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs rounded-md hover:shadow-md transition-shadow"
//                             >
//                               <Download className="w-3.5 h-3.5" />
//                             Download QR
//                           </a>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       )}
//     </div>
//   );
// }



// src/components/ModelSelector.jsx
// src/components/ModelSelector.jsx
import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

const formatName = (str) => 
  str
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function ModelSelector({ onModelSelect }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSku, setHoveredSku] = useState(null);

  // Array file GLB yang akan digunakan secara berurutan (siklus berulang)
  const glbFiles = [
    "/assets/tissue60.glb",
    "/assets/tissue50.glb", 
    "/assets/qf70.glb",
    "/assets/emberpsw.glb",
  ];
  
  // Array QR Code yang akan digunakan secara berurutan (siklus berulang)
  const qrFiles = [
    "/assets/pattern-qr1.png",
    "/assets/pattern-qr2.png",
    "/assets/pattern-qr3.png",
    "/assets/pattern-qr4.png"
  ];

  // Data dummy produk (ganti dengan data sesuai kebutuhan)
  const dummyProducts = [
    {
      sku: "cosmo-royal-blue",
      name: "MR-50",
      price: 150000,
      category: "Premium",
      description: "Model 3D produk premium Cosmo Royal Blue."
    },
    {
      sku: "cosmo-emerald-green",
      name: "JR-60",
      price: 175000,
      category: "Luxury",
      description: "Model 3D produk premium Cosmo Emerald Green."
    },
    {
      sku: "cosmo-premium-black",
      name: "QF-70",
      price: 225000,
      category: "Luxury",
      description: "Model 3D produk premium Cosmo Luxury White."
    },
    {
      sku: "cosmo-luxury-white",
      name: "PSW",
      price: 200000,
      category: "Premium",
      description: "Model 3D produk premium Cosmo Premium Black."
    },
  ];

  // Gunakan data dummy (simulasi loading sederhana)
  useEffect(() => {
    const loadDummyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulasi delay loading (opsional, bisa dihapus)
        await new Promise(resolve => setTimeout(resolve, 800));

        const formatted = dummyProducts.map((p, index) => {
          // Ambil file GLB dan QR berdasarkan index (siklus berulang)
          const modelUrl = glbFiles[index % glbFiles.length];
          const qrImageUrl = qrFiles[index % qrFiles.length];

          return {
            name: p.name || formatName(p.sku),
            price: p.price || 0,
            category: p.category || "Premium",
            fullUrl: modelUrl,
            qrImage: qrImageUrl,
            description: p.description || "Model 3D produk premium.",
            sku: p.sku,
          };
        });

        setModels(formatted);
      } catch (err) {
        console.error("Gagal memuat data dummy:", err);
        setError("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    loadDummyData();
  }, []);

  // Fungsi untuk mendapatkan QR Image berdasarkan model
  const getQRImage = (model) => {
    return model.qrImage || "/assets/pattern-qr1.png";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && models.length === 0 && (
        <div className="text-center py-32 text-gray-500">
          <p className="text-2xl">Belum ada produk tersedia</p>
        </div>
      )}

      {/* Grid Produk */}
      {!loading && !error && models.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {models.map((model, index) => {
            const isHovered = hoveredSku === model.sku;
            const qrImage = getQRImage(model);

            return (
              <motion.div
                key={model.sku}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onModelSelect(model)}
                onMouseEnter={() => setHoveredSku(model.sku)}
                onMouseLeave={() => setHoveredSku(null)}
                className="group relative cursor-pointer"
                whileHover={{ y: -12 }}
              >
                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden transition-all duration-300">
                  {/* 3D Model */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                    <model-viewer
                      src={model.fullUrl}
                      alt={model.name}
                      camera-controls
                      auto-rotate
                      rotation-per-second="20deg"
                      loading="eager"
                      className="w-full h-full"
                      shadow-intensity="1"
                      exposure="1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>

                  {/* Info */}
                  <div className="p-6 text-white">
                    <h3 className="font-bold text-xl truncate">{model.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm opacity-80">{model.category}</span>
                      <span className="font-bold text-lg">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(model.price)}
                      </span>
                    </div>
                  </div>

                  {/* QR Overlay saat Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-white/98 backdrop-blur-lg flex items-center justify-center z-20 p-8"
                      >
                        <div className="text-center space-y-6">
                          <img
                            src={qrImage}
                            alt={`QR ${model.name}`}
                            className="w-50 h-50 mx-auto rounded-2xl shadow-2xl border-8 border-white"
                          />
                          <div>
                            <p className="text-xl font-bold text-gray-800">Scan untuk AR</p>
                            <p className="text-sm text-gray-600 mt-1">Arahkan kamera ke QR Code</p>
                          </div>
                          <a
                            href={qrImage}
                            download={`COSMO-QR-${model.sku}.png`}
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-pointer hover:brightness-90 active:scale-[0.98] flex items-center justify-center gap-1.5 mx-auto px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs rounded-md hover:shadow-md transition-shadow"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download QR
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}