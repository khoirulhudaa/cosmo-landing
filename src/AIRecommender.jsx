// src/AIRecommender.jsx
import { motion } from 'framer-motion';
import { Brain, CheckCircle, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const formatName = (str) => str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function AIRecommender({ models, onSelect }) {
  const [show, setShow] = useState(false);
  const [needs, setNeeds] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  const options = [
    { id: 'higienis', label: 'Higienis' },
    { id: 'hemat', label: 'Hemat' },
    { id: 'premium', label: 'Premium' },
    { id: 'daily', label: 'Harian' },
    { id: 'gift', label: 'Hadiah' }
  ];

  const toggle = (id) => setNeeds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const recommend = () => {
    const scores = models.map(m => ({
      model: m,
      score: m.tags.filter(t => needs.includes(t)).length + (m.certifications.length * 0.3)
    }));
    const best = scores.sort((a,b) => b.score - a.score)[0];
    setRecommendation(best.score > 0 ? best.model : null);
  };

  return (
    <>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setShow(true)}
        className="z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2">
        <Brain className="w-5 h-5" /> AI Rekomendasi
      </motion.button>

      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-cyan-500/50"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                <h2 className="text-2xl font-bold text-white">AI Rekomendasi</h2>
              </div>
              <button onClick={() => setShow(false)}><X className="w-6 h-6 text-white/60" /></button>
            </div>

            <p className="text-cyan-200 mb-6">Pilih kebutuhan Anda:</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {options.map(o => (
                <button key={o.id} onClick={() => toggle(o.id)}
                  className={`p-3 rounded-xl border transition-all ${needs.includes(o.id) ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100' : 'bg-white/5 border-white/20 text-white/70'}`}>
                  {o.label}
                </button>
              ))}
            </div>

            <button onClick={recommend} disabled={needs.length === 0}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white disabled:opacity-50">
              Dapatkan Rekomendasi
            </button>

            {recommendation && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-cyan-400/50">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-cyan-100">{formatName(recommendation.name)}</h3>
                </div>
                <p className="text-sm text-cyan-200 mb-3">{recommendation.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-cyan-400 font-medium">Sistem</p><p className="text-white/80">{recommendation.system}</p></div>
                  <div><p className="text-cyan-400 font-medium">Sertifikasi</p><p className="text-white/80">{recommendation.certifications.join(', ')}</p></div>
                </div>
                <button onClick={() => { onSelect(recommendation); setShow(false); }}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg font-medium text-sm">
                  Lihat di AR
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}