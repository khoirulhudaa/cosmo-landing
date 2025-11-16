// import '@google/model-viewer';
// import { motion } from 'framer-motion';
// import {
//   AlertCircle, ArrowLeft,
//   Box,
//   CameraIcon, Info,
//   Mic,
//   Sparkles,
//   X
// } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import ARViewer from './arViewer';
// import ModelSelector from './modelUploader';
// import UnityARViewer from './UnityARViewer';

// // === Fallback RuleBot ===
// const ruleBot = (text, model) => {
//   const t = text.toLowerCase();
//   const name = model?.name?.toLowerCase() || '';
//   if (/halo|hi|hai/.test(t)) return 'Halo! Ada yang bisa saya bantu?';
//   if (/toilet/.test(t) || name.includes('toilet')) return 'Toilet pintar: flush otomatis, hemat air 50%, pemanas dudukan.';
//   if (/sepatu|shoe/.test(t) || name.includes('shoe')) return 'Sepatu tahan air, anti-slip, memory foam.';
//   if (/tisu|tissue/.test(t) || name.includes('tissue')) return 'Tisu 3 ply ultra-soft, hypoallergenic, aroma therapy.';
//   if (/astronaut/.test(t) || name.includes('astronaut')) return 'Model astronaut NASA EMU, cocok untuk VR luar angkasa.';
//   if (/kotak|box/.test(t) || name.includes('box')) return 'Kotak kemasan premium: emboss, foil, food-safe.';
//   if (/ar/.test(t)) return 'Tekan "Tap to Place" saat AR aktif.';
//   return `Maaf, saya belum paham: "${text}". Coba tanya fitur produk!`;
// };

// // === API BASE ===
// const API_BASE = 'https://vr.kiraproject.id';

// export default function App() {
//   const [modelUrl, setModelUrl] = useState('');
//   const [showAR, setShowAR] = useState(false);
//   const [showUnityAR, setShowUnityAR] = useState(false);
//   const [blobUrlToRevoke, setBlobUrlToRevoke] = useState(null);
//   const [selectedModel, setSelectedModel] = useState(null);

//   // === CHAT STATE ===
//   const [showChat, setShowChat] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [isLoadingAI, setIsLoadingAI] = useState(false);
//   const [selectedSku, setSelectedSku] = useState('');
//   const [selectedProductName, setSelectedProductName] = useState('');
//   const recognitionRef = useRef(null);
//   const chatHistoryRef = useRef(null);

//   // === PRODUK STATE ===
//   const [products, setProducts] = useState([]);

//   // === FETCH PRODUK ===
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/products`);
//         const json = await res.json();
//         if (json.success) setProducts(json.data);
//       } catch (err) {
//         console.warn('Gagal fetch produk:', err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // === SPEECH RECOGNITION ===
//   useEffect(() => {
//     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
//       recognition.lang = 'id-ID';
//       recognition.interimResults = false;
//       recognition.continuous = false;

//       recognition.onresult = (e) => {
//         setInputText(e.results[0][0].transcript);
//         setIsListening(false);
//       };
//       recognition.onerror = () => setIsListening(false);
//       recognition.onend = () => setIsListening(false);

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   // === TEXT TO SPEECH ===
//   const speak = (text) => {
//     return new Promise((resolve) => {
//       if (!('speechSynthesis' in window)) return resolve();
//       const utter = new SpeechSynthesisUtterance(text);
//       utter.lang = 'id-ID';
//       utter.rate = 0.9;
//       utter.onend = resolve;
//       window.speechSynthesis.cancel();
//       window.speechSynthesis.speak(utter);
//     });
//   };

//   // === TAMBAH PESAN ===
//   const addMessage = (role, content) => {
//     setMessages(prev => [...prev, { role, content, id: Date.now() }]);
//     setTimeout(() => {
//       if (chatHistoryRef.current) {
//         chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//       }
//     }, 50);
//   };

//   // === KIRIM KE LLM ===
//   const sendToLLM = async (message) => {
//     if (selectedSku) {
//       const payload = { sku: selectedSku, question: message };
//       const endpoint = `${API_BASE}/api/llm/product-chat`;
//       try {
//         const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//         const json = await res.json();
//         if (json.success) return json.data.response;
//         throw new Error();
//       } catch {
//         return ruleBot(message, selectedModel);
//       }
//     } else {
//       const payload = { message };
//       const endpoint = `${API_BASE}/api/llm/chat`;
//       try {
//         const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//         const json = await res.json();
//         if (json.success) return json.data.response;
//         throw new Error();
//       } catch {
//         return ruleBot(message, selectedModel);
//       }
//     }
//   };

//   // === HANDLE SEND ===
//   const handleSend = async (text) => {
//     if (!text.trim()) return;
//     const userText = text.trim();
//     addMessage('user', userText);
//     setInputText('');
//     setIsLoadingAI(true);
//     const reply = await sendToLLM(userText);
//     addMessage('bot', reply);
//     await speak(reply);
//     setIsLoadingAI(false);
//   };

//   // === TOGGLE MIC ===
//   const toggleMic = () => {
//     if (!recognitionRef.current) return;
//     if (isListening) recognitionRef.current.stop();
//     else recognitionRef.current.start();
//     setIsListening(!isListening);
//   };

//   // === HANDLE SKU CHANGE ===
//   const handleSkuChange = (e) => {
//     const sku = e.target.value;
//     const product = products.find(p => p.sku === sku);
//     setSelectedSku(sku);
//     setSelectedProductName(product?.name || '');
//   };

//   // === MODEL & AR HANDLER ===
//   const handleModelSelect = (model) => {
//     if (model instanceof File) {
//       const url = URL.createObjectURL(model);
//       setBlobUrlToRevoke(url);
//       setModelUrl(url);
//       setSelectedModel({ name: model.name, sizeFormatted: `${(model.size / 1024).toFixed(2)} KB` });
//     } else {
//       setBlobUrlToRevoke(null);
//       setModelUrl(model.fullUrl);
//       setSelectedModel(model);
//     }
//     setShowAR(true);
//   };

//   const handleBack = () => {
//     setShowAR(false);
//     if (blobUrlToRevoke) setTimeout(() => URL.revokeObjectURL(blobUrlToRevoke), 500);
//     setModelUrl(''); setBlobUrlToRevoke(null); setSelectedModel(null);
//   };

//   const handleUnityAR = () => setShowUnityAR(true);
//   const handleBackFromUnity = () => setShowUnityAR(false);

//   useEffect(() => {
//     return () => { if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke); };
//   }, [blobUrlToRevoke]);

//   // === RENDER AR ===
//   if (showAR && modelUrl) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ARViewer modelUrl={modelUrl} model={selectedModel} onBack={handleBack} /></motion.div>;
//   if (showUnityAR) return <UnityARViewer onBack={handleBackFromUnity} />;

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white">
//       {/* === AR IMAGE-TRACKING + TOMBOL CHAT DI TENGAH ATAS === */}
//       <div className='w-screen flex justify-center items-center relative'>
//         <div className='fixed bg-white/14 w-full md:w-max md:px-6 h-[12vh] md:h-[16vh] flex items-center backdrop-blur-xl justify-center bottom-0 md:bottom-4 rounded-tl-xl rounded-tr-xl md:rounded-3xl shadow-xl z-[2333] mt-12 text-center'>
          
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='w-full md:px-0 px-10'>
//             <button 
//               onClick={handleUnityAR} 
//               className="group flex cursor-pointer relative inline-flex items-center gap-3 px-5 w-full text-center justify-center md:w-max py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-103 transition-all duration-300 overflow-hidden"
//             >
//               <CameraIcon className="w-6 h-6 group-hover:animate-pulse" />
//               <p className='text-sm flex w-max'>AR IMAGE-TRACKING</p>
//               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
//             </button>
//             <div className="mt-3 md:flex hidden items-center justify-center gap-1 text-xs text-yellow-300">
//               <AlertCircle className="w-4 h-4" />
//               <p className="text-sm text-white font-mono tracking-widest">
//                 POWERED BY <span className="text-white">AFRAME</span>
//               </p>
//             </div>
//           </motion.div>

//           <div className='md:flex hidden w-[2px] h-full bg-white/20 mx-6'>

//           </div>

//          <div className="md:relative absolute md:left-0 left-1/2 md:-translate-x-0 -translate-x-1/2 md:top-0 -top-22">
//           <div className="border-white/30 border shadow-3xl p-1.5 w-[80px] h-[80px] bg-white/16 backdrop-blur-3xl rounded-full flex items-center justify-center">
//             {!showChat ? (
//               <motion.button
//                 onClick={() => setShowChat(true)}
//                 style={{
//                   backgroundSize: '400% 400%',
//                   animation: 'gradientWave 2s ease infinite',
//                 }}
//                 className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
//                           cursor-pointer hover:brightness-95 hover:scale-[1.1] active:scale-[1]
//                           text-white rounded-full shadow-2xl flex items-center justify-center
//                           z-[9999] hover:shadow-purple-500/50 transition-all"
//               >
//                 <Sparkles className="w-6 h-6" />
//               </motion.button>
//             ) : (
//               <motion.button
//                 onClick={() => setShowChat(false)}
//                 style={{
//                   backgroundSize: '400% 400%',
//                   animation: 'gradientWave 4s ease infinite',
//                 }}
//                 className="w-full h-full bg-gradient-to-r from-red-200 via-red-500 to-red-200
//                           cursor-pointer hover:brightness-95 hover:scale-[1.1] active:scale-[1]
//                           text-white rounded-full shadow-2xl flex items-center justify-center
//                           z-[9999] hover:shadow-purple-500/50 transition-all"
//               >
//                 <X className="w-6 h-6" />
//               </motion.button>
//             )}
//           </div>
//           </div>

//         </div>
//       </div>

//       {/* === BACKGROUND === */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
//         <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-blue-600/10 to-indigo-600/10 animate-pulse animation-delay-2000" />
//       </div>

//       <div className="relative z-10 md:max-w-7xl mx-auto px-3 md:px-6 py-12">
//         <motion.div className="absolute inset-0 -z-10 blur-3xl" animate={{
//           background: [
//             'radial-gradient(circle at 20% 80%, rgba(120, 219, 226, 0.3), transparent 50%)',
//             'radial-gradient(circle at 80% 20%, rgba(173, 109, 244, 0.3), transparent 50%)',
//             'radial-gradient(circle at 40% 40%, rgba(255, 105, 180, 0.3), transparent 50%)',
//           ],
//         }} transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }} />

//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
//           <div className="w-full md:flex justify-center items-center gap-6 mb-6">
//             <div className='flex md:hidden'><motion.div className='mx-auto mb-6'><Box size={80} className="text-cyan-400 drop-shadow-glow" /></motion.div></div>
//             <h1 className="text-3xl md:text-7xl text-center font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
//               AR VIEWER COSMO
//             </h1>
//           </div>
//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm md:text-xl text-cyan-200 text-center w-[86%] md:w-max font-light max-w-3xl mx-auto">
//             Pilih model 3D atau fitur AR interaktif dengan aframe (Image Target).
//           </motion.p>
//         </motion.div>

//         {/* Model Selector */}
//         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative w-full md:max-w-2xl mx-auto z-10">
//           <div className="p-0 md:p-8 h-max">
//             <ModelSelector onModelSelect={handleModelSelect} />
//           </div>
//         </motion.div>

//         <div className="h-20 md:h-14" />

//         {/* Info Cards */}
//         <div className="relative mt-[-30px] md:mt-0 grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:px-0 px-4 md:max-w-5xl mx-auto z-20">
//           {[
//             { icon: <Info className="w-5 h-5" />, title: 'WebXR Ready', desc: 'Chrome Android • Safari iOS' },
//             { icon: <ArrowLeft className="w-5 h-5" />, title: 'Tap to Place', desc: 'Arahkan ke lantai saat AR aktif' },
//             { icon: <Sparkles className="w-5 h-5" />, title: 'Real-time', desc: 'Interaksi penuh: putar, zoom, geser' },
//           ].map((item, i) => (
//             <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ y: -8, scale: 1.01 }} className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
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

//         {/* Footer */}
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-20 text-center">
//           <p className="text-sm text-cyan-300/60 font-mono tracking-widest">AR</p>
//         </motion.div>
//       </div>

//       {/* === CHATBOT UI === */}
//       <div className='md:w-max md:p-0 flex items-center justify-center'>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8, y: 100 }}
//           animate={{ opacity: showChat ? 1 : 0, scale: showChat ? 1 : 0.8, y: showChat ? 0 : 100 }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//           className={`fixed bottom-0 md:bottom-4 right-0 md:right-4 w-full md:w-96 h-[80vh] bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 rounded-tl-3xl rounded-tr-3xl md:rounded-3xl shadow-2xl z-[9999] flex flex-col ${showChat ? 'pointer-events-auto' : 'pointer-events-none'}`}
//         >
//           {/* Header */}
//           <div className="p-4 border-b border-white/10 flex items-center justify-between">
//             <div className="flex items-center gap-3 cursor-pointer">
//               <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-white">COSMO Assistant</h3>
//                 <p className="text-xs text-cyan-300">
//                   Online • {selectedProductName || selectedSku ? selectedProductName || `SKU: ${selectedSku}` : 'Chat Umum'}
//                 </p>
//               </div>
//             </div>
//             <button onClick={() => setShowChat(false)} className="text-white cursor-pointer hover:brightness-95 active:scale-[0.99] hover:text-white transition">
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Messages */}
//           <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20" style={{ scrollBehavior: 'smooth' }}>
//             {messages.length === 0 && (
//               <div className="text-center text-white/50 text-sm mt-8">
//                 <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-400 animate-pulse" />
//                 <p>Pilih produk atau tanya umum!</p>
//               </div>
//             )}
//             {messages.map((msg) => (
//               <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-white/10 text-cyan-100 border border-white/10'}`}>
//                   <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
//                 </div>
//               </motion.div>
//             ))}
//             {isLoadingAI && (
//               <div className="flex justify-start">
//                 <div className="bg-white/10 border border-white/10 p-3 rounded-2xl">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Input Area */}
//           <div className="p-3 border-t border-white/10">
//             <div className="space-y-2">

//               {/* === SELECT PRODUK (LANGSUNG TAMPIL) === */}
//               <select
//                 value={selectedSku}
//                 onChange={handleSkuChange}
//                 className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-black-400 transition"
//               >
//                 <option className='text-black' value="">Chat Umum</option>
//                 {products.map((product) => (
//                   <option key={product.sku} className='text-black' value={product.sku}>
//                     {product.name} (SKU: {product.sku})
//                   </option>
//                 ))}
//               </select>

//               {/* Input Text */}
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={inputText}
//                   onChange={(e) => setInputText(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
//                   placeholder={selectedProductName ? `Tanya tentang ${selectedProductName}...` : "Tanya apa saja..."}
//                   className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition"
//                 />
//                 <button
//                   onClick={toggleMic}
//                   className={`w-[40px] h-[40px] flex items-center justify-center p-2 rounded-xl transition ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
//                 >
//                   <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
//                 </button>
//                 <button
//                   onClick={() => handleSend(inputText)}
//                   disabled={!inputText.trim()}
//                   className="w-[40px] h-[40px] flex items-center justify-center p-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Custom CSS */}
//       <style dangerouslySetInnerHTML={{ __html: `
//         .drop-shadow-glow { filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.6)); }
//         .animation-delay-2000 { animation-delay: 2s; }
//         .scrollbar-thin::-webkit-scrollbar { width: 6px; }
//         .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
//         .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
//       ` }} />
//     </div>
//   );
// }




import '@google/model-viewer';
import { PointMaterial, Points } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import {
    Bot,
    Box,
    CameraIcon,
    Mic,
    Sparkles, X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ARViewer from './arViewer';
import ModelSelector from './modelUploader';
import UnityARViewer from './UnityARViewer';

// === VIDEO BACKGROUND PATH ===
const VIDEO_BG = '/videos/wave3.mp4'; // Ganti dengan path video kamu

// === Fallback RuleBot ===
const ruleBot = (text, model) => {
  const t = text.toLowerCase();
  const name = model?.name?.toLowerCase() || '';
  if (/halo|hi|hai/.test(t)) return 'Halo! Ada yang bisa saya bantu?';
  if (/toilet/.test(t) || name.includes('toilet')) return 'Toilet pintar: flush otomatis, hemat air 50%, pemanas dudukan.';
  if (/sepatu|shoe/.test(t) || name.includes('shoe')) return 'Sepatu tahan air, anti-slip, memory foam.';
  if (/tisu|tissue/.test(t) || name.includes('tissue')) return 'Tisu 3 ply ultra-soft, hypoallergenic, aroma therapy.';
  if (/astronaut/.test(t) || name.includes('astronaut')) return 'Model astronaut NASA EMU, cocok untuk VR luar angkasa.';
  if (/kotak|box/.test(t) || name.includes('box')) return 'Kotak kemasan premium: emboss, foil, food-safe.';
  if (/ar/.test(t)) return 'Tekan "Tap to Place" saat AR aktif.';
  return `Maaf, saya belum paham: "${text}". Coba tanya fitur produk!`;
};

// === API BASE ===
const API_BASE = 'https://vr.kiraproject.id';

export default function App() {
  const [modelUrl, setModelUrl] = useState('');
  const [showAR, setShowAR] = useState(false);
  const [showUnityAR, setShowUnityAR] = useState(false);
  const [blobUrlToRevoke, setBlobUrlToRevoke] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // === CHAT STATE ===
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedSku, setSelectedSku] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const recognitionRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // === PRODUK STATE ===
  const [products, setProducts] = useState([]);

  
  const videoRef = useRef(null);

  // Tambahkan useEffect untuk mengatur kecepatan
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1; // 50% kecepatan (bisa 0.3, 0.7, dll)
    }
  }, []);

  // === FETCH PRODUK ===
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        console.warn('Gagal fetch produk:', err);
      }
    };
    fetchProducts();
  }, []);

  // === SPEECH RECOGNITION ===
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (e) => {
        setInputText(e.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // === TEXT TO SPEECH ===
  const speak = (text) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'id-ID';
      utter.rate = 0.9;
      utter.onend = resolve;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    });
  };

  // === TAMBAH PESAN ===
  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, id: Date.now() }]);
    setTimeout(() => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    }, 50);
  };

  // === KIRIM KE LLM ===
  const sendToLLM = async (message) => {
    if (selectedSku) {
      const payload = { sku: selectedSku, question: message };
      const endpoint = `${API_BASE}/api/llm/product-chat`;
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (json.success) return json.data.response;
        throw new Error();
      } catch {
        return ruleBot(message, selectedModel);
      }
    } else {
      const payload = { message };
      const endpoint = `${API_BASE}/api/llm/chat`;
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (json.success) return json.data.data.response;
        throw new Error();
      } catch {
        return ruleBot(message, selectedModel);
      }
    }
  };

  // === HANDLE SEND ===
  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userText = text.trim();
    addMessage('user', userText);
    setInputText('');
    setIsLoadingAI(true);
    const reply = await sendToLLM(userText);
    addMessage('bot', reply);
    await speak(reply);
    setIsLoadingAI(false);
  };

  // === TOGGLE MIC ===
  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setIsListening(!isListening);
  };

  // === HANDLE SKU CHANGE ===
  const handleSkuChange = (e) => {
    const sku = e.target.value;
    const product = products.find(p => p.sku === sku);
    setSelectedSku(sku);
    setSelectedProductName(product?.name || '');
  };

  // === MODEL & AR HANDLER ===
  const handleModelSelect = (model) => {
    if (model instanceof File) {
      const url = URL.createObjectURL(model);
      setBlobUrlToRevoke(url);
      setModelUrl(url);
      setSelectedModel({ name: model.name, sizeFormatted: `${(model.size / 1024).toFixed(2)} KB` });
    } else {
      setBlobUrlToRevoke(null);
      setModelUrl(model.fullUrl);
      setSelectedModel(model);
      setShowAR(true);
    }
  };

  const handleBack = () => {
    setShowAR(false);
    if (blobUrlToRevoke) setTimeout(() => URL.revokeObjectURL(blobUrlToRevoke), 500);
    setModelUrl(''); setBlobUrlToRevoke(null); setSelectedModel(null);
  };

  const handleUnityAR = () => setShowUnityAR(true);
  const handleBackFromUnity = () => setShowUnityAR(false);

  useEffect(() => {
    return () => { if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke); };
  }, [blobUrlToRevoke]);

  // === RENDER AR ===
  if (showAR && modelUrl) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ARViewer modelUrl={modelUrl} model={selectedModel} onBack={handleBack} /></motion.div>;
  if (showUnityAR) return <UnityARViewer onBack={handleBackFromUnity} />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800">
      {/* === VIDEO BACKGROUND (MP4) === */}
      <div className='absolute bg-black opacity-[0.6] z-[1] w-screen h-[200vh]'></div>
      <div className="absolute inset-0 overflow-hidden" aria-label='"https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=202587'>
        <video
          ref={videoRef}
          autoPlay
          muted
          aria-label='"https://pixabay.com/users/olenchic-16658974/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=202587'
          loop
          playsInline
          className="w-full h-full object-cover brightness-80"
        >
          <source src={VIDEO_BG} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay Blur + Tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-blue-50/60 backdrop-blur-sm" />
      </div>

      {/* === 3D PARTICLES (Soft Overlay) === */}
      <div className="fixed inset-0 z-[1] overflow-hidden opacity-50">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Particles />
        </Canvas>
      </div>

      {/* === AR BUTTON + CHAT TOGGLE === */}

      <div className="relative z-10 md:max-w-7xl mx-auto px-3 md:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-full md:flex justify-center items-center gap-6 mb-6">
            <div className='flex md:hidden'><motion.div className='mx-auto mb-6'><Box size={80} className="text-blue-500 drop-shadow-md" /></motion.div></div>
            <h1 className="text-5xl md:text-8xl text-center font-black bg-clip-text text-white">
              AR VIEWER COSMO
            </h1>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base md:text-xl text-white text-center max-w-3xl mx-auto font-light">
            Pilih model 3D atau aktifkan AR interaktif dengan image tracking.
          </motion.p>
        </motion.div>

        <div className='z-[900999] w-full md:w-max mx-auto relative justify-center items-center'>
          <div className='relative w-max md:w-full h-[12vh] md:gap-0 gap-3 md:h-[16vh] flex items-center justify-center bottom-0 rounded-lg rounded-tr-xl z-[2333] mt-12 text-center'>
            
            {/* AR HOLOGRAM BUTTON */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="relative group cursor-pointer"
              onClick={handleUnityAR}
            >
              <div className="relative p-1 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl backdrop-blur-xl border border-white/40">
                <div className="relative px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-bold overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-white/40 rounded-xl backdrop-blur">
                      <CameraIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-md md:text-lg font-black font-medium tracking-wide flex items-center gap-2"><span className='hidden md:flex'>AR</span>IMAGE-TRACKING</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            <div className='md:flex hidden w-[2px] h-[75%] bg-gray-300/60 mx-6'></div>

            {/* CHAT TOGGLE ORB */}
            <div className="relative md:left-0 md:-translate-x-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="p-1 w-max h-[72px] bg-white/40 rounded-xl shadow-2xl flex items-center justify-center border border-white/40">
                {!showChat ? (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                    onClick={() => setShowChat(true)}
                    className="relative overflow-hidden min-w-[90px] px-4 gap-2 hover:brightness-90 h-full cursor-pointer bg-white rounded-xl flex items-center justify-center hover:shadow-inner"
                  >
                    <Bot className="w-6 h-6 text-purple-600" />
                    <p className='font-medium'>Chat</p>
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                    onClick={() => setShowChat(false)}
                    className="w-[90px] cursor-pointer hover:brightness-90 h-full bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center text-white"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Model Selector */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative w-full md:max-w-[90vw] mx-auto z-[9999999999999999]">
          <div className="p-0 md:p-8 h-max">
            <ModelSelector onModelSelect={handleModelSelect} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center">
          <p className="text-xs text-white font-mono tracking-widest">AR EXPERIENCE With COSMO - 2025</p>
        </motion.div>
      </div>

      {/* === CHATBOT UI (Light Mode) === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 100 }}
        animate={{ opacity: showChat ? 1 : 0, scale: showChat ? 1 : 0.9, y: showChat ? 0 : 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-0 md:bottom-4 right-0 md:right-4 w-full md:w-96 h-[80vh] bg-white/50 backdrop-blur-2xl border border-gray-200 rounded-tl-3xl rounded-tr-3xl md:rounded-3xl shadow-2xl z-[9999] flex flex-col ${showChat ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <h3 className="font-bold text-white">COSMO Assistant</h3>
              <p className="text-xs text-white flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {selectedProductName || selectedSku ? selectedProductName || `SKU: ${selectedSku}` : 'Online'}
              </p>
            </div>
          </div>
          <div onClick={() => setShowChat(false)} className='bg-red-500 flex items-center justify-center rounded-md p-1 shadow-lg border-[1px] border-white/80 cursor-pointer active:scale-[0.99]'>
            <button className="text-white hover:text-white/80 cursor-pointer transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-white text-sm mt-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-white" />
              <p>Pilih produk atau mulai chat!</p>
            </div>
          )}
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isLoadingAI && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-200">
          <div className="space-y-2">
            <select
              value={selectedSku}
              onChange={handleSkuChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-purple-500 transition"
            >
              <option value="">Chat Umum</option>
              {products.map((product) => (
                <option key={product.sku} value={product.sku}>
                  {product.name} (SKU: {product.sku})
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                placeholder={selectedProductName ? `Tanya ${selectedProductName}...` : "Ketik pesan..."}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
              />
              <button
                onClick={toggleMic}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim()}
                className="px-4 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
      ` }} />
    </div>
  );
}

// === 3D PARTICLES (Soft Overlay) ===
function Particles() {
  const ref = useRef();
  const { positions } = (() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    return { positions };
  })();

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#c4b5fd"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}