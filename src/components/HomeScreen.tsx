import { motion } from 'motion/react';
import { Scan, Wallet, Plus, History, Sparkles } from 'lucide-react';
import { usePlatform } from '../hooks/usePlatform';

interface Props {
  onScan: () => void;
  onViewSaved: () => void;
  key?: string;
}

export default function HomeScreen({ onScan, onViewSaved }: Props) {
  const platform = usePlatform();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden safe-top safe-bottom">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 120, 0],
            x: [0, 150, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-64 -left-64 w-[500px] h-[500px] ${platform === 'ios' ? 'bg-blue-500/15' : 'bg-teal-500/15'} rounded-full blur-[120px]`}
        />
        <motion.div
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [120, 0, 120],
            x: [0, -150, 0],
            y: [0, -80, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className={`absolute -bottom-64 -right-64 w-[500px] h-[500px] ${platform === 'ios' ? 'bg-indigo-500/15' : 'bg-emerald-500/15'} rounded-full blur-[120px]`}
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <motion.div 
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.8 }}
            className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${platform === 'ios' ? 'from-blue-400 to-indigo-600' : 'from-teal-400 to-emerald-600'} rounded-[2rem] shadow-2xl shadow-teal-500/20 mb-8 transform-style-3d`}
          >
            <Wallet className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-5xl font-black tracking-tight text-white mb-3">Vizi Wallet</h2>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'}`} />
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">AI-Powered Card Management</p>
          </div>
        </motion.div>

        {/* Responsive Grid for Foldables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg md:max-w-2xl">
          <motion.button
            whileHover={{ scale: 1.05, rotateX: -8, rotateY: 8 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScan}
            className={`group relative h-64 md:h-80 overflow-hidden perspective-1000 ${
              platform === 'ios' 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] shadow-2xl border border-white/20 backdrop-blur-xl' 
                : 'bg-teal-600 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-transparent'
            }`}
          >
            <div className={`absolute inset-0 ${platform === 'ios' ? 'bg-black/10' : 'bg-black/5'} group-hover:bg-transparent transition-colors`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className={`w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                platform === 'ios'
                  ? 'bg-white/20 backdrop-blur-xl rounded-3xl border border-white/20'
                  : 'bg-white/10 rounded-2xl'
              }`}>
                <Scan className="w-10 h-10 text-white" />
              </div>
              <span className={`text-2xl font-black text-white tracking-widest ${platform === 'ios' ? 'uppercase' : ''}`}>Scan Card</span>
              <span className={`text-[10px] ${platform === 'ios' ? 'text-white/70 uppercase' : 'text-teal-50 font-medium'} mt-2 tracking-widest`}>Instant AI Extraction</span>
            </div>
            {platform === 'ios' && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
            )}
            {platform === 'android' && (
              <div className="absolute inset-0 opacity-0 group-active:opacity-20 bg-white transition-opacity pointer-events-none" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotateX: 8, rotateY: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewSaved}
            className={`group relative h-64 md:h-80 overflow-hidden perspective-1000 ${
              platform === 'ios'
                ? 'bg-slate-900 rounded-[3rem] shadow-2xl border border-white/5 backdrop-blur-xl'
                : 'bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-transparent'
            }`}
          >
            <div className={`absolute inset-0 ${platform === 'ios' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : ''}`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className={`w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                platform === 'ios'
                  ? 'bg-slate-800 rounded-3xl border border-white/5'
                  : 'bg-slate-700/50 rounded-2xl'
              }`}>
                <History className={`w-10 h-10 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'}`} />
              </div>
              <span className={`text-2xl font-black text-white tracking-widest ${platform === 'ios' ? 'uppercase' : ''}`}>Saved Cards</span>
              <span className={`text-[10px] ${platform === 'ios' ? 'text-slate-400 uppercase tracking-widest font-bold' : 'text-slate-400 font-medium tracking-wide'} mt-2`}>Your Digital Collection</span>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
                  <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <span>Trusted by 10k+ professionals</span>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
