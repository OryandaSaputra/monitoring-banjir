import { useNavigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1428] via-[#11223a] to-[#1e3a5f] flex items-center justify-center relative overflow-hidden">
      
      {/* Background Pattern Halus */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_0.8px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
      
      {/* Overlay gelap untuk nuansa premium */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Pop-up Modern & Premium */}
      <div className="glass max-w-xl w-full mx-4 rounded-3xl shadow-2xl p-10 md:p-12 text-center relative z-10 border border-white/20">
        
        {/* Icon dengan efek glow */}
        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-cyan-400/30">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Droplets className="w-20 h-20 text-cyan-300 drop-shadow-xl" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Monitoring Banjir
        </h1>
        <p className="text-cyan-300 text-xl md:text-2xl mb-10">
          Wilayah Kelurahan Meranti Pandak, Jalan Pesisir
        </p>
        
        {/* Gambar Lokasi - Lebih besar dan elegan */}
        <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <img 
            src="https://picsum.photos/id/1015/1200/600" 
            alt="Pesisir Meranti Pandak" 
            className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        
        {/* Button Modern */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.97] transition-all text-white font-semibold text-xl py-5 rounded-3xl flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
        >
          Lanjut ke Dashboard
          <span className="text-3xl leading-none mt-px">→</span>
        </button>
        
        <p className="text-xs text-white/50 mt-8 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Data diperbarui setiap menit • Real-time Monitoring
        </p>
      </div>
    </div>
  );
}