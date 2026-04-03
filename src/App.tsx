import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck, Lock } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import CameraScanner from './components/CameraScanner';
import CardPreview from './components/CardPreview';
import SavedCards from './components/SavedCards';
import TermsModal from './components/TermsModal';
import { AppState, VisitingCard } from './types';
import { StorageService } from './services/storage';
import { usePlatform } from './hooks/usePlatform';

export default function App() {
  const platform = usePlatform();
  const [state, setState] = useState<AppState>('splash');
  const [savedCards, setSavedCards] = useState<VisitingCard[]>([]);
  const [currentCard, setCurrentCard] = useState<VisitingCard | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Load cards from IndexedDB on startup
  useEffect(() => {
    const initStorage = async () => {
      try {
        const stored = await StorageService.loadCards();
        setSavedCards(stored);
      } catch (e) {
        console.error("Failed to load cards from local device storage", e);
      } finally {
        setIsStorageReady(true);
      }
    };
    initStorage();
  }, []);

  const saveCard = async (card: VisitingCard) => {
    const updated = [card, ...savedCards];
    setSavedCards(updated);
    await StorageService.saveCards(updated);
  };

  const deleteCard = async (id: string) => {
    const updated = savedCards.filter(c => c.id !== id);
    setSavedCards(updated);
    await StorageService.saveCards(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-teal-500/30">
      {/* Privacy Badge (Encrypted Logo) */}
      <div className="fixed top-6 right-6 z-[100] mt-[env(safe-area-inset-top,0px)]">
        <motion.button 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsTermsOpen(true)}
          className="flex items-center justify-center w-11 h-11 bg-slate-900/60 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${platform === 'ios' ? 'from-blue-500/10 to-indigo-500/10' : 'from-emerald-500/10 to-teal-500/10'} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <Lock className={`w-4 h-4 ${platform === 'ios' ? 'text-blue-400' : 'text-emerald-400'} relative z-10`} />
          
          {/* Pulsing Aura */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`absolute inset-0 ${platform === 'ios' ? 'bg-blue-500/20' : 'bg-emerald-500/20'} rounded-xl`}
          />
        </motion.button>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setState('home')} />
        )}

        {state === 'home' && isStorageReady && (
          <HomeScreen
            key="home"
            onScan={() => setState('scan')}
            onViewSaved={() => setState('saved')}
          />
        )}

        {state === 'scan' && (
          <CameraScanner
            key="scan"
            onCapture={(image) => {
              setCurrentCard({
                id: crypto.randomUUID(),
                image,
                extractedText: '',
                timestamp: Date.now(),
              });
              setState('preview');
            }}
            onBack={() => setState('home')}
          />
        )}

        {state === 'preview' && currentCard && (
          <CardPreview
            key="preview"
            card={currentCard}
            onSave={(updatedCard) => {
              saveCard(updatedCard);
              setState('saved');
            }}
            onCancel={() => setState('home')}
          />
        )}

        {state === 'saved' && (
          <SavedCards
            key="saved"
            cards={savedCards}
            onDelete={deleteCard}
            onBack={() => setState('home')}
            onScan={() => setState('scan')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
