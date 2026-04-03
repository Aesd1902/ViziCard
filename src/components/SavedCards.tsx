import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Trash2, Phone, 
  Mail, MapPin, Globe, Calendar, 
  Plus, MoreVertical, ExternalLink, Sparkles
} from 'lucide-react';
import { VisitingCard } from '../types';
import { cn } from '../lib/utils';
import { usePlatform } from '../hooks/usePlatform';

interface Props {
  cards: VisitingCard[];
  onDelete: (id: string) => void;
  onBack: () => void;
  onScan: () => void;
  key?: string;
}

export default function SavedCards({ cards, onDelete, onBack, onScan }: Props) {
  const platform = usePlatform();
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<VisitingCard | null>(null);

  const filtered = cards.filter(c => 
    (c.name?.toLowerCase().includes(search.toLowerCase()) || 
     c.company?.toLowerCase().includes(search.toLowerCase()) ||
     c.extractedText?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-slate-950 flex flex-col safe-top"
    >
      {/* Header */}
      <div className="p-8 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-6 mb-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack} 
            className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-colors border border-white/5"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Your Wallet</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Digital Collection</p>
          </div>
          <div className="ml-auto">
            <div className={`${platform === 'ios' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'} px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border`}>
              {cards.length} Cards
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'} transition-colors`} />
          <input 
            type="text"
            placeholder="Search contacts, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full h-16 bg-slate-900/40 rounded-[1.5rem] pl-14 pr-6 text-sm font-bold text-white border border-white/5 focus:border-${platform === 'ios' ? 'blue-500/30' : 'teal-500/30'} focus:outline-none transition-all shadow-inner`}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-40">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
              <Search className="w-10 h-10 text-slate-800" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No cards found</p>
            <p className="text-slate-600 text-[10px] mt-2 font-medium">Try scanning a new business card to begin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, rotateX: -2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCard(card)}
                className="group relative bg-slate-900/40 rounded-[2rem] p-6 border border-white/5 hover:border-white/10 transition-all cursor-pointer overflow-hidden shadow-xl perspective-1000"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-20 rounded-2xl overflow-hidden bg-slate-800 border border-white/5 flex-shrink-0 shadow-lg">
                    <img 
                      src={card.image} 
                      alt="card" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-black text-white truncate leading-tight tracking-tight">{card.name || 'Unknown Contact'}</h4>
                    <p className={`text-[10px] font-black ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'} uppercase tracking-[0.2em] mt-2 truncate`}>{card.company || 'No Organization'}</p>
                    <div className="flex items-center gap-4 mt-4">
                      {card.phone && <Phone className="w-4 h-4 text-slate-600" />}
                      {card.email && <Mail className="w-4 h-4 text-slate-600" />}
                      {card.address && <MapPin className="w-4 h-4 text-slate-600" />}
                    </div>
                  </div>
                </div>
                
                {/* 3D Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onScan}
        className={`fixed bottom-10 right-10 w-20 h-20 bg-gradient-to-br ${platform === 'ios' ? 'from-blue-500 to-indigo-600 shadow-blue-500/40' : 'from-teal-500 to-emerald-600 shadow-teal-500/40'} rounded-[1.8rem] shadow-2xl flex items-center justify-center text-white z-40 border border-white/10`}
      >
        <Plus className="w-10 h-10" />
      </motion.button>

      {/* Card Details Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 safe-top safe-bottom"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="w-full max-w-lg bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[1.6/1] overflow-hidden">
                <img 
                  src={selectedCard.image} 
                  alt="card" 
                  className="w-full h-full object-cover brightness-110 contrast-110 saturate-0"
                  referrerPolicy="no-referrer"
                />
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="p-10 space-y-8">
                <div className="text-center">
                  <h3 className="text-4xl font-black text-white tracking-tight">{selectedCard.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Sparkles className={`w-4 h-4 ${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'}`} />
                    <p className={`${platform === 'ios' ? 'text-blue-400' : 'text-teal-400'} font-black uppercase tracking-[0.3em] text-[10px]`}>{selectedCard.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {selectedCard.phone && <DetailAction icon={Phone} label="Contact Number" value={selectedCard.phone} onClick={() => window.location.href = `tel:${selectedCard.phone}`} platform={platform} />}
                  {selectedCard.email && <DetailAction icon={Mail} label="Email Address" value={selectedCard.email} onClick={() => window.location.href = `mailto:${selectedCard.email}`} platform={platform} />}
                  {selectedCard.address && <DetailAction icon={MapPin} label="Get Directions" value={selectedCard.address} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCard.address!)}`, '_blank')} platform={platform} />}
                  {selectedCard.website && <DetailAction icon={Globe} label="Visit Website" value={selectedCard.website} onClick={() => window.open(`https://${selectedCard.website}`, '_blank')} platform={platform} />}
                </div>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDelete(selectedCard.id);
                    setSelectedCard(null);
                  }}
                  className="w-full h-16 rounded-[1.5rem] bg-rose-500/10 text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  Erase from Wallet
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailAction({ icon: Icon, label, value, onClick, platform }: any) {
  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-5 bg-slate-800/40 p-5 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all text-left w-full group"
    >
      <div className={`w-12 h-12 ${platform === 'ios' ? 'bg-blue-500/10 text-blue-400' : 'bg-teal-500/10 text-teal-400'} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-bold text-white truncate">{value}</p>
      </div>
      <ExternalLink className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
    </motion.button>
  );
}
