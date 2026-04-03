import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'motion/react';
import { X, Camera, RefreshCw, Sparkles, Flashlight, FlashlightOff } from 'lucide-react';
import { usePlatform } from '../hooks/usePlatform';

interface Props {
  onCapture: (image: string) => void;
  onBack: () => void;
  key?: string;
}

export default function CameraScanner({ onCapture, onBack }: Props) {
  const platform = usePlatform();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isFlashOn, setIsFlashOn] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setIsFlashOn(false); // Reset flash when switching cameras
  };

  const toggleFlash = async () => {
    if (!webcamRef.current?.stream) return;
    const track = webcamRef.current.stream.getVideoTracks()[0];
    if (track) {
      try {
        const advanced = { torch: !isFlashOn };
        await track.applyConstraints({ advanced: [advanced] } as any);
        setIsFlashOn(!isFlashOn);
      } catch (err) {
        console.error("Flash unavailable or unsupported", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
    >
      <div className="relative flex-1 overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: 16/9
          }}
          className="absolute inset-0 w-full h-full object-cover"
          mirrored={facingMode === "user"}
          disablePictureInPicture={true}
          forceScreenshotSourceSize={true}
          imageSmoothing={true}
          onUserMedia={() => {}}
          onUserMediaError={() => {}}
          screenshotQuality={0.8}
        />

        {/* Dynamic Scan Line */}
        <motion.div
          animate={{ top: ['20%', '80%', '20%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent ${platform === 'ios' ? 'via-blue-500' : 'via-teal-400'} to-transparent z-20 shadow-[0_0_15px_rgba(20,184,166,0.5)]`}
        />

        {/* Overlay Guide */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-6">
          <div className="relative w-full max-w-lg aspect-[1.6/1] border-2 border-white/30 rounded-[2rem] shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]">
            <div className={`absolute -top-2 -left-2 w-12 h-12 border-t-8 border-l-8 ${platform === 'ios' ? 'border-blue-500' : 'border-teal-400'} rounded-tl-3xl`} />
            <div className={`absolute -top-2 -right-2 w-12 h-12 border-t-8 border-r-8 ${platform === 'ios' ? 'border-blue-500' : 'border-teal-400'} rounded-tr-3xl`} />
            <div className={`absolute -bottom-2 -left-2 w-12 h-12 border-b-8 border-l-8 ${platform === 'ios' ? 'border-blue-500' : 'border-teal-400'} rounded-bl-3xl`} />
            <div className={`absolute -bottom-2 -right-2 w-12 h-12 border-b-8 border-r-8 ${platform === 'ios' ? 'border-blue-500' : 'border-teal-400'} rounded-br-3xl`} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Sparkles className={`w-8 h-8 ${platform === 'ios' ? 'text-blue-500/50' : 'text-teal-400/50'}`} />
              <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">Align Visiting Card</span>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 pt-[max(2rem,env(safe-area-inset-top))] px-8 pb-8 flex justify-between items-center z-30">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-14 h-14 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-2xl"
          >
            <X className="w-7 h-7" />
          </motion.button>

          <div className="flex items-center gap-4">
            {facingMode === 'environment' && (
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleFlash}
                className={`w-14 h-14 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl transition-colors ${isFlashOn ? 'text-yellow-400' : 'text-white'}`}
              >
                {isFlashOn ? <Flashlight className="w-7 h-7" /> : <FlashlightOff className="w-7 h-7" />}
              </motion.button>
            )}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleCamera}
              className="w-14 h-14 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-2xl"
            >
              <RefreshCw className="w-7 h-7" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-12 flex justify-center items-center z-30 safe-bottom">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={capture}
            className={`w-24 h-24 bg-white rounded-full p-1 shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center border-8 ${platform === 'ios' ? 'border-blue-500/20' : 'border-teal-500/20'}`}
          >
            <div className="w-full h-full bg-white rounded-full border-4 border-slate-100 flex items-center justify-center">
               <Camera className={`w-10 h-10 ${platform === 'ios' ? 'text-blue-600' : 'text-teal-600'}`} />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
