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
            className={`group relative h-64 md:h-80 bg-gradient-to-br ${platform === 'ios' ? 'from-blue-500 to-indigo-600' : 'from-teal-500 to-emerald-600'} rounded-[3rem] overflow-hidden shadow-2xl shadow-teal-500/30 border border-white/10 perspective-1000`}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/20">
                <Scan className="w-10 h-10 text-white" />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-widest">Scan Card</span>
              <span className="text-[10px] text-white/70 mt-2 font-bold uppercase tracking-widest">Instant AI Extraction</span>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotateX: 8, rotateY: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewSaved}
            className="group relative h-64 md:h-80 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5">
                <History className={`w-10 h-10 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'}`} />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-widest">Saved Cards</span>
              <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Your Digital Collection</span>
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
          
          {platform === 'ios' && (
            <div className="mt-4 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest">Optimized for iPhone 15 Pro</p>
            </div>
          )}
          {platform === 'android' && (
            <div className="mt-4 px-4 py-2 bg-teal-500/10 rounded-full border border-teal-500/20">
              <p className="text-teal-400 text-[9px] font-bold uppercase tracking-widest">Optimized for Galaxy Fold</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
