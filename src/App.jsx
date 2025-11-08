import '@google/model-viewer';
import { motion } from 'framer-motion';
import {
  AlertCircle, ArrowLeft, Box, Camera, CameraIcon, Info,
  Sparkles
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ARViewer from './arViewer';
import ModelSelector from './modelUploader';
import UnityARViewer from './UnityARViewer';

// === DATA MODEL 3D ===
const API_DATA = [
  {
    filename: "toilet.glb",
    name: "toilet",
    size: 6602832,
    sizeFormatted: "6.3 MB",
    fullUrl: "https://vr.kiraproject.id/models/toilet.glb",
    description: "Model 3D toilet modern dengan detail keramik dan fitting premium.",
    desc_left: {
      title: "Fungsi Utama",
      list: [
        "Sistem flush otomatis dengan sensor inframerah",
        "Desain anti-splash untuk kebersihan maksimal",
        "Pemanas dudukan otomatis untuk kenyamanan",
        "Mode hemat air (dual flush 3L/6L)",
      ]
    },
    desc_right: {
      title: "Tujuan Penggunaan",
      value: `Toilet pintar untuk higienis & nyaman.\nTanpa sentuhan, bebas kuman.\nHemat air hingga 50%.\nCocok untuk rumah mewah & hotel bintang 5.`
    },
    system: "Smart Flush System v3.0",
    benefits: ["Hemat air 50%", "Bebas sentuhan", "Pemanas dudukan", "Bidet otomatis", "Anti-bakteri UV"],
    usage: ["Rumah mewah", "Hotel bintang 5", "Rumah sakit", "Apartemen premium"],
    certifications: ["SNI", "WaterSense®", "ISO 9001", "Green Product"],
    tags: ["higienis", "hemat", "premium", "smart home", "luxury"]
  },
  {
    filename: "shoe.glb",
    name: "shoe",
    size: 8947140,
    sizeFormatted: "8.53 MB",
    fullUrl: "https://vr.kiraproject.id/models/shoe.glb",
    description: "Sepatu sneaker high-res dengan tekstur kulit dan sol karet.",
    desc_left: {
      title: "Fitur Unggulan",
      list: [
        "Upper berbahan kulit premium tahan air & gores",
        "Sol karet anti-slip dengan pola grip 3D",
        "Insole memory foam dengan ventilasi udara",
        "Tali elastis anti-kendor + quick-lace system",
      ]
    },
    desc_right: {
      title: "Dirancang Untuk",
      value: `Gaya hidup aktif di kota.\nStylish tapi tetap nyaman.\nTahan air, anti-slip.\nIdeal untuk daily commute & jogging.`
    },
    system: "FlexGrip™ Technology",
    benefits: ["Tahan air 100%", "Anti-slip", "Memory foam", "Quick-lace", "Breathable mesh"],
    usage: ["Jogging", "Daily commute", "Outdoor adventure", "Gym"],
    certifications: ["ISO 20345", "EcoTex 100", "Vegan Certified"],
    tags: ["daily", "portable", "premium", "sport", "outdoor"]
  },
  {
    filename: "TissueCosmo.glb",
    name: "TissueCosmo",
    size: 70817700,
    sizeFormatted: "67.54 MB",
    fullUrl: "https://vr.kiraproject.id/models/TissueCosmo.glb",
    description: "Tisu wajah premium dalam kemasan Cosmo dengan efek emboss dan foil.",
    desc_left: {
      title: "Keunggulan Produk",
      list: [
        "3 ply ultra-soft dengan teknologi lotion aloe vera",
        "Tekstur emboss 3D untuk pembersihan lebih efektif",
        "Kemasan premium dengan foil metalik & hot stamp",
        "Aroma therapy alami (lavender & green tea)",
      ]
    },
    desc_right: {
      title: "Untuk Siapa?",
      value: `Konsumen yang peduli kelembutan.\nKemasan elegan & premium.\nHypoallergenic, ramah kulit.\nCocok untuk hotel, spa, & rumah modern.`
    },
    system: "UltraSoft 3-Ply Technology",
    benefits: ["Hypoallergenic", "Lotion aloe vera", "Emboss 3D", "Aroma therapy", "Biodegradable"],
    usage: ["Hotel bintang 5", "Spa & salon", "Rumah modern", "Hadiah perusahaan"],
    certifications: ["FSC", "Dermatest Excellent", "Halal MUI", "EU Ecolabel"],
    tags: ["higienis", "premium", "gift", "eco", "luxury"]
  },
  {
    filename: "product-sample.glb",
    name: "product-sample",
    size: 6540,
    sizeFormatted: "6.39 KB",
    fullUrl: "https://vr.kiraproject.id/models/product-sample.glb",
    description: "Contoh produk sederhana untuk demo AR dan rendering cepat.",
    desc_left: {
      title: "Fitur Demo",
      list: [
        "Ukuran file ringan untuk loading cepat",
        "Optimasi LOD untuk performa AR",
        "Material PBR siap render real-time",
        "UV mapping bersih & non-overlapping",
      ]
    },
    desc_right: {
      title: "Tujuan Demo",
      value: `Template cepat untuk pengujian AR.\nFile ringan, load instan.\nCocok untuk developer & desainer.\nSiap pakai di WebXR.`
    },
    system: "Demo Template v1",
    benefits: ["File ringan", "Loading cepat", "PBR ready", "WebXR optimized"],
    usage: ["Testing", "Demo", "Developer", "Portfolio"],
    certifications: [],
    tags: ["demo", "lightweight", "developer", "template"]
  },
  {
    filename: "box-sample.glb",
    name: "box-sample",
    size: 1664,
    sizeFormatted: "1.63 KB",
    fullUrl: "https://vr.kiraproject.id/models/box-sample.glb",
    description: "Kotak kemasan minimalis dengan tekstur karton dan logo timbul.",
    desc_left: {
      title: "Spesifikasi Kemasan",
      list: [
        "Material karton kraft 350 GSM",
        "Teknik emboss logo 3D dengan foil gold",
        "Lapisan anti-minyak food-grade",
        "Desain lipat otomatis (auto-lock bottom)",
      ]
    },
    desc_right: {
      title: "Aplikasi Ideal",
      value: `Kemasan premium untuk kosmetik & gift.\nDesain mewah, ramah lingkungan.\nMudah dirakit tanpa lem.\nTingkatkan pengalaman unboxing.`
    },
    system: "Premium Folding Box",
    benefits: ["Emboss 3D", "Foil gold", "Food-safe", "Eco-friendly", "Easy assembly"],
    usage: ["Kosmetik", "Gift box", "Makanan premium", "Brand luxury"],
    certifications: ["FSC", "Food Grade", "ISO 22000"],
    tags: ["packaging", "premium", "gift", "eco", "branding"]
  },
  {
    filename: "astronaut.glb",
    name: "astronaut",
    size: 2869044,
    sizeFormatted: "2.74 MB",
    fullUrl: "https://vr.kiraproject.id/models/astronaut.glb",
    description: "Astronaut dengan spacesuit detail, cocok untuk visualisasi luar angkasa.",
    desc_left: {
      title: "Detail Teknis",
      list: [
        "Spacesuit berbasis NASA EMU (Extravehicular Mobility Unit)",
        "Visor anti-reflektif dengan lapisan emas",
        "Life support backpack dengan detail pipa oksigen",
        "Articulated joints untuk animasi realistis",
      ]
    },
    desc_right: {
      title: "Konteks Penggunaan",
      value: `Visualisasi edukasi luar angkasa.\nSimulasi spacewalk & misi Mars.\nCocok untuk museum & VR training.\nDetail akurat berbasis NASA.`
    },
    system: "NASA EMU Spacesuit Replica",
    benefits: ["Detail NASA-accurate", "PBR materials", "Rigged joints", "4K textures", "AR/VR ready"],
    usage: ["Edukasi", "Museum", "VR training", "Space simulation"],
    certifications: ["NASA Reference", "PBR Standard"],
    tags: ["space", "nasa", "education", "vr", "science"]
  }
];

// === Rule-Based Fallback (Jika AI Lokal Gagal) ===
const ruleBot = (text, model) => {
  const t = text.toLowerCase();
  const name = model?.name?.toLowerCase() || '';

  if (/halo|hi|hai/.test(t)) return 'Halo! Ada yang bisa saya bantu tentang produk 3D ini?';
  if (/toilet|wc|closet/.test(t) || name.includes('toilet')) return 'Toilet pintar: flush otomatis, hemat air 50%, pemanas dudukan, anti-bakteri UV.';
  if (/sepatu|shoe|sneaker/.test(t) || name.includes('shoe')) return 'Sepatu tahan air 100%, anti-slip, memory foam, cocok untuk jogging & daily use.';
  if (/tisu|tissue|cosmo/.test(t) || name.includes('tissue')) return 'Tisu 3 ply ultra-soft, hypoallergenic, aroma therapy, kemasan premium foil.';
  if (/astronaut|nasa|luar angkasa/.test(t) || name.includes('astronaut')) return 'Model astronaut berbasis NASA EMU, cocok untuk simulasi VR luar angkasa.';
  if (/kotak|box|kemasan/.test(t) || name.includes('box')) return 'Kotak kemasan premium: emboss 3D, foil gold, food-safe, ramah lingkungan.';
  if (/ar|augmented/.test(t)) return 'Tekan "Tap to Place" saat AR aktif untuk meletakkan model di lantai.';
  return `Maaf, saya belum paham: "${text}". Coba tanya fitur produk atau AR!`;
};

export default function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [showAR, setShowAR] = useState(false);
  const [showUnityAR, setShowUnityAR] = useState(false);
  const [blobUrlToRevoke, setBlobUrlToRevoke] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // === Voice Chat State ===
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const recognitionRef = useRef(null);
  const generatorRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // === Speech Synthesis ===
  const speak = (text) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'id-ID';
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 1;
      utter.onend = resolve;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    });
  };

  // === Tambah Pesan ===
  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, id: Date.now() }]);
    setTimeout(() => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = 0;
      }
    }, 50);
  };

  // === Proses Pertanyaan ===
  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userText = text.trim();
    addMessage('user', userText);
    setInputText('');
    setIsLoadingAI(true);

    let reply = '';

    if (generatorRef.current) {
      try {
        const output = await generatorRef.current(`Q: ${userText}\nA:`, {
          max_new_tokens: 80,
          do_sample: true,
          temperature: 0.7,
          top_k: 50,
        });
        reply = output[0].generated_text.split('A:')[1]?.trim() || "Saya tidak yakin.";
      } catch (err) {
        reply = ruleBot(userText, selectedModel);
      }
    } else {
      reply = ruleBot(userText, selectedModel);
    }

    addMessage('bot', reply);
    await speak(reply);
    setIsLoadingAI(false);
  };

  // === Toggle Mic ===
  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // === Handler Model & AR ===
  const handleModelSelect = (model) => {
    if (model instanceof File) {
      const url = URL.createObjectURL(model);
      setBlobUrlToRevoke(url);
      setModelUrl(url);
      setSelectedModel({
        name: model.name,
        sizeFormatted: `${(model.size / 1024).toFixed(2)} KB`,
        desc_left: { title: "File", value: "Lokal" },
        desc_right: { title: "Ukuran", value: `${(model.size / 1024).toFixed(2)} KB` }
      });
    } else {
      setBlobUrlToRevoke(null);
      setModelUrl(model.fullUrl);
      setSelectedModel(model);
    }
    setShowAR(true);
  };

  const handleBack = () => {
    setShowAR(false);
    if (blobUrlToRevoke) {
      setTimeout(() => URL.revokeObjectURL(blobUrlToRevoke), 500);
    }
    setModelUrl(''); setBlobUrlToRevoke(null); setSelectedModel(null);
  };

  const handleUnityAR = () => setShowUnityAR(true);
  const handleBackFromUnity = () => setShowUnityAR(false);

  useEffect(() => {
    return () => {
      if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
    };
  }, [blobUrlToRevoke]);

  // === RENDER ===
  if (showAR && modelUrl) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ARViewer modelUrl={modelUrl} model={selectedModel} onBack={handleBack} />
      </motion.div>
    );
  }

  if (showUnityAR) {
    return <UnityARViewer onBack={handleBackFromUnity} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white">
    
      {/* === Tombol image-tracking AR === */}
      <div className='w-screen flex justify-center items-center'>
        <div className='fixed bg-white/14 w-full md:w-max px-20 h-[16vh] flex flex-col items-center backdrop-blur-xl justify-center bottom-0 md:bottom-4 rounded-tl-xl rounded-tr-xl md:rounded-3xl shadow-xl z-[2333] mt-12 text-center'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <button onClick={handleUnityAR} className="group flex cursor-pointer relative inline-flex items-center gap-3 px-5 w-max py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-103 transition-all duration-300 overflow-hidden">
              <CameraIcon className="w-6 h-6 group-hover:animate-pulse" />
              <p className='text-sm'>AR IMAGE-TRACKING | COSMO</p>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-yellow-300">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm text-white font-mono tracking-widest">
                POWERED BY <span className="text-white">AFRAME</span> • <span className="text-pink-400">2025</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* === Background & Main UI === */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-blue-600/10 to-indigo-600/10 animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 md:max-w-7xl mx-auto px-3 md:px-6 py-12">
        <motion.div className="absolute inset-0 -z-10 blur-3xl" animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(120, 219, 226, 0.3), transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(173, 109, 244, 0.3), transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(255, 105, 180, 0.3), transparent 50%)',
          ],
        }} transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }} />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-full md:flex justify-center items-center gap-6 mb-6">
            <div className='flex md:hidden'>
              <motion.div className='mx-auto mb-6'>
                <Box size={80} className="text-cyan-400 drop-shadow-glow" />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-7xl text-center font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              AR VIEWER COSMO
            </h1>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm md:text-xl text-cyan-200 text-center w-[86%] md:w-max font-light max-w-3xl mx-auto">
            Pilih model 3D atau fitur AR interaktif dengan aframe (Image Target).
          </motion.p>
        </motion.div>

        {/* Model Selector */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative w-full md:max-w-2xl mx-auto z-10">
          <div className="p-0 md:p-8 h-max">
            <ModelSelector onModelSelect={handleModelSelect} />
          </div>
        </motion.div>

        <div className="h-20 md:h-14" />

        {/* Info Cards */}
        <div className="relative mt-[-30px] md:mt-0 grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:px-0 px-4 md:max-w-5xl mx-auto z-20">
          {[
            { icon: <Info className="w-5 h-5" />, title: 'WebXR Ready', desc: 'Chrome Android • Safari iOS' },
            { icon: <ArrowLeft className="w-5 h-5" />, title: 'Tap to Place', desc: 'Arahkan ke lantai saat AR aktif' },
            { icon: <Sparkles className="w-5 h-5" />, title: 'Real-time', desc: 'Interaksi penuh: putar, zoom, geser' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ y: -8, scale: 1.01 }} className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-20 text-center">
          <p className="text-sm text-cyan-300/60 font-mono tracking-widest">AR</p>
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .drop-shadow-glow { filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.6)); }
        .animation-delay-2000 { animation-delay: 2s; }
      ` }} />
    </div>
  );
}
