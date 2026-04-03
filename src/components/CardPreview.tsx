import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, Sparkles, Phone, Mail, MapPin, 
  Globe, Calendar, Copy, ExternalLink, 
  ChevronRight, Loader2, Save, Trash2 
} from 'lucide-react';
import { VisitingCard } from '../types';
import { extractCardData } from '../services/gemini';
import { cn } from '../lib/utils';
import { usePlatform } from '../hooks/usePlatform';

interface Props {
  card: VisitingCard;
  onSave: (card: VisitingCard) => void;
  onCancel: () => void;
  key?: string;
}

export default function CardPreview({ card, onSave, onCancel }: Props) {
  const platform = usePlatform();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [data, setData] = useState<Partial<VisitingCard> | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'raw'>('info');

  const [error, setError] = useState<string | null>(null);

  const normalizeArray = (val: string | string[] | undefined | null): string[] => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  useEffect(() => {
    handleEnhance();
  }, []);

  const handleEnhance = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const extracted = await extractCardData(card.image);
      setData(extracted);
      setIsEnhanced(true);
    } catch (e) {
      console.error("OCR failed", e);
      setError(e instanceof Error ? e.message : "Failed to extract card data. Please try again.");
      setIsEnhanced(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openDialer = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  const openMaps = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const openCalendar = (date: string) => {
    const event = {
      title: `Meeting with ${data?.name || 'Contact'}`,
      details: `From Vizi Card: ${data?.fullText || ''}`,
      location: data?.address || '',
    };
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col safe-top"
    >
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="flex justify-between items-center py-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onCancel} 
            className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-colors border border-white/5"
          >
            <X className="w-6 h-6" />
          </motion.button>
          <h3 className="text-xl font-black tracking-tight uppercase">Analyze Card</h3>
          <div className="w-12" />
        </div>

        {/* Card Display */}
        <div className="relative group perspective-1000 mb-10">
          <motion.div
            animate={{ 
              rotateX: isEnhanced ? 0 : 2,
              rotateY: isEnhanced ? 0 : -2,
            }}
            className={cn(
              "relative w-full max-w-lg mx-auto aspect-[1.6/1] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-1000",
              isEnhanced 
                ? platform === 'ios' ? "shadow-blue-500/20 ring-4 ring-blue-500/30" : "shadow-teal-500/20 ring-4 ring-teal-500/30"
                : "grayscale contrast-125"
            )}
          >
            <img 
              src={card.image} 
              alt="captured" 
              className={cn(
                "w-full h-full object-cover transition-all duration-1000",
                isEnhanced ? "brightness-110 contrast-110 saturate-0" : ""
              )}
              referrerPolicy="no-referrer"
            />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className={`w-14 h-14 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'}`} />
                </motion.div>
                <p className={`mt-6 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'} font-black tracking-[0.3em] uppercase text-[10px]`}>AI Processing...</p>
              </div>
            )}

            {isEnhanced && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-6 right-6"
              >
                <div className={`${platform === 'ios' ? 'bg-blue-500' : 'bg-teal-500'} text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl`}>
                  <Sparkles className="w-3 h-3" />
                  AI Verified
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Extracted Info */}
        <AnimatePresence mode="wait">
          {!isProcessing && error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-red-500/20 rounded-2xl">
                  <X className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <h4 className="text-red-400 font-bold mb-2">Processing Failed</h4>
              <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">{error}</p>
              <button 
                onClick={handleEnhance}
                className={`px-8 py-3 bg-gradient-to-r ${platform === 'ios' ? 'from-blue-500 to-indigo-600 shadow-blue-500/20' : 'from-teal-500 to-emerald-600 shadow-teal-500/20'} rounded-xl text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg`}
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!isProcessing && !error && data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex gap-6 border-b border-slate-900 mb-8">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={cn(
                    "pb-5 px-2 text-xs font-black uppercase tracking-[0.2em] transition-colors relative",
                    activeTab === 'info' ? platform === 'ios' ? "text-blue-400" : "text-teal-400" : "text-slate-600"
                  )}
                >
                  Smart Info
                  {activeTab === 'info' && <motion.div layoutId="tab" className={`absolute bottom-0 left-0 right-0 h-1.5 ${platform === 'ios' ? 'bg-blue-400' : 'bg-teal-400'} rounded-full`} />}
                </button>
                <button 
                  onClick={() => setActiveTab('raw')}
                  className={cn(
                    "pb-5 px-2 text-xs font-black uppercase tracking-[0.2em] transition-colors relative",
                    activeTab === 'raw' ? platform === 'ios' ? "text-blue-400" : "text-teal-400" : "text-slate-600"
                  )}
                >
                  Raw Data
                  {activeTab === 'raw' && <motion.div layoutId="tab" className={`absolute bottom-0 left-0 right-0 h-1.5 ${platform === 'ios' ? 'bg-blue-400' : 'bg-teal-400'} rounded-full`} />}
                </button>
              </div>

              {activeTab === 'info' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.name && <InfoItem icon={Check} label="Full Name" value={data.name} onCopy={() => copyToClipboard(data.name!)} platform={platform} />}
                  {data.company && <InfoItem icon={Sparkles} label="Organization" value={data.company} onCopy={() => copyToClipboard(data.company!)} platform={platform} />}
                  {normalizeArray(data.phone).map((p, i) => (
                    <InfoItem key={`phone-${i}`} icon={Phone} label={i === 0 ? "Primary Contact" : `Contact ${i + 1}`} value={p} onAction={() => openDialer(p)} onCopy={() => copyToClipboard(p)} platform={platform} />
                  ))}
                  {normalizeArray(data.email).map((e, i) => (
                    <InfoItem key={`email-${i}`} icon={Mail} label={i === 0 ? "Email Address" : `Alternative Email ${i + 1}`} value={e} onAction={() => window.location.href = `mailto:${e}`} onCopy={() => copyToClipboard(e)} platform={platform} />
                  ))}
                  {data.address && <InfoItem icon={MapPin} label="Location" value={data.address} onAction={() => openMaps(data.address!)} onCopy={() => copyToClipboard(data.address!)} platform={platform} />}
                  {data.website && <InfoItem icon={Globe} label="Digital Presence" value={data.website} onAction={() => window.open(`https://${data.website}`, '_blank')} onCopy={() => copyToClipboard(data.website!)} platform={platform} />}
                  
                  {data.dates && data.dates.length > 0 && (
                    <div className="col-span-full space-y-4 pt-4">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2">Detected Events</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.dates.map((date, i) => (
                          <InfoItem key={i} icon={Calendar} label="Schedule" value={date} onAction={() => openCalendar(date)} onCopy={() => copyToClipboard(date)} platform={platform} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/40 rounded-[2rem] p-8 border border-white/5 shadow-inner">
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {data.fullText}
                  </p>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(data.fullText!)}
                    className={`mt-8 flex items-center gap-3 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'} font-black text-[10px] uppercase tracking-[0.2em]`}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Extracted Text
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 flex gap-4 safe-bottom">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="flex-1 h-16 rounded-2xl bg-slate-900 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 border border-white/5"
        >
          <Trash2 className="w-4 h-4" />
          Discard
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onSave({ ...card, ...data })}
          disabled={isProcessing}
          className={`flex-[2] h-16 rounded-2xl bg-gradient-to-r ${platform === 'ios' ? 'from-blue-500 to-indigo-600 shadow-blue-500/20' : 'from-teal-500 to-emerald-600 shadow-teal-500/20'} text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50`}
        >
          <Save className="w-4 h-4" />
          Add to Wallet
        </motion.button>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value, onAction, onCopy, platform }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-4 p-4 transition-all ${
        platform === 'ios'
          ? 'bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] border border-white/10 hover:border-white/20'
          : 'bg-slate-800 rounded-2xl shadow-md border-b-[3px] border-black/20 hover:border-teal-500/30'
      }`}
    >
      <div className={`w-12 h-12 shrink-0 ${platform === 'ios' ? 'bg-blue-500/10 text-blue-400' : 'bg-teal-500/10 text-teal-400'} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-bold text-white leading-snug break-all">{value}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        {onAction && (
          <button onClick={onAction} className="p-2 text-slate-500 hover:text-white transition-colors">
            <ExternalLink className="w-5 h-5" />
          </button>
        )}
        <button onClick={onCopy} className="p-2 text-slate-500 hover:text-white transition-colors">
          <Copy className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
