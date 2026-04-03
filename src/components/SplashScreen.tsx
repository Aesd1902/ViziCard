import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';
import { usePlatform } from '../hooks/usePlatform';

interface Props {
  onComplete: () => void;
  key?: string;
}

export default function SplashScreen({ onComplete }: Props) {
  const platform = usePlatform();

  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-teal-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, rotateY: -45, rotateX: 20, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, rotateX: 0, opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          ease: "easeOut",
          rotateY: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          rotateX: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }}
        className="relative perspective-1000 z-10"
      >
        <div className={`w-48 h-48 bg-gradient-to-br ${platform === 'ios' ? 'from-blue-500 to-indigo-600' : 'from-teal-400 to-emerald-600'} rounded-[2.5rem] shadow-2xl shadow-teal-500/20 flex items-center justify-center transform-style-3d`}>
          <Wallet className="w-24 h-24 text-white drop-shadow-2xl" />
          
          {/* 3D Floating Glass Cards */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotateZ: [0, 15, 0],
              rotateX: [0, 10, 0],
              translateZ: [0, 60, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 -top-8 w-32 h-24 bg-white/10 backdrop-blur-2xl rounded-[1.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            <div className="w-10 h-2 bg-white/20 rounded-full mb-2" />
            <div className="w-16 h-1.5 bg-white/10 rounded-full" />
            
            {/* Shimmer Effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </motion.div>

          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotateZ: [0, -15, 0],
              rotateX: [0, -10, 0],
              translateZ: [0, 40, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -left-8 -bottom-8 w-28 h-20 bg-white/5 backdrop-blur-xl rounded-[1.25rem] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex flex-col items-start p-4 justify-center gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-white/20" />
            <div className="w-12 h-1.5 bg-white/10 rounded-full" />
            
            {/* Shimmer Effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-16 text-center z-10"
      >
        <h1 className={`text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${platform === 'ios' ? 'from-blue-300 to-indigo-400' : 'from-teal-300 to-emerald-500'}`}>
          VIZI CARD
        </h1>
        <p className="mt-3 text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px]">
          {platform === 'ios' ? 'Premium iOS Experience' : 'Next-Gen Android Wallet'}
        </p>
      </motion.div>

      <motion.div 
        className="absolute bottom-20 w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden z-10"
      >
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className={`h-full bg-gradient-to-r ${platform === 'ios' ? 'from-blue-500 to-indigo-500' : 'from-teal-500 to-emerald-500'}`}
        />
      </motion.div>
    </motion.div>
  );
}
