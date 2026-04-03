import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, Eye, Database, Globe, UserCheck } from 'lucide-react';
import { usePlatform } from '../hooks/usePlatform';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: Props) {
  const platform = usePlatform();
  const accentColor = platform === 'ios' ? 'text-blue-400' : 'text-teal-400';
  const accentBg = platform === 'ios' ? 'bg-blue-500/10' : 'bg-teal-500/10';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 safe-top safe-bottom"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="w-full max-w-lg bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-xl z-10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${accentBg} ${accentColor} rounded-2xl flex items-center justify-center`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Privacy & Rules</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">User Agreement</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className={`w-5 h-5 ${accentColor}`} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">1. Data Privacy</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Vizi Card is built on a "Privacy First" architecture. All scanned business cards, images, and extracted contact information are stored <span className="text-white font-bold">exclusively on your local device</span> using IndexedDB.
                </p>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    "We never upload your data to any cloud, server, or GitHub repository. Your wallet is yours alone."
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Database className={`w-5 h-5 ${accentColor}`} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">2. Local Storage Rules</h4>
                </div>
                <ul className="space-y-3">
                  <RuleItem icon={Eye} text="Only you can access your data. No one else, including the developers, can see your scanned cards." />
                  <RuleItem icon={Globe} text="The app works offline. Data is persisted in your browser's secure local storage profile." />
                  <RuleItem icon={UserCheck} text="Clearing your browser cache or app data will permanently delete your saved cards. We recommend manual backups if needed." />
                </ul>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${accentColor}`} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">3. Terms of Use</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  By using Vizi Card, you agree to use the scanning technology responsibly. The app uses AI (Gemini) for text extraction, which may occasionally have inaccuracies. Always verify critical contact details.
                </p>
              </section>

              <div className="pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Version 2.0.0 • Secure Build</p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-8 bg-slate-950/50 border-t border-white/5">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`w-full h-16 rounded-[1.5rem] bg-gradient-to-r ${platform === 'ios' ? 'from-blue-500 to-indigo-600' : 'from-teal-500 to-emerald-600'} text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl`}
              >
                I Understand & Accept
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RuleItem({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <li className="flex gap-4 items-start">
      <div className="mt-1">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <p className="text-xs text-slate-400 font-medium leading-relaxed">{text}</p>
    </li>
  );
}
