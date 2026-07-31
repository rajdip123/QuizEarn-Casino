import React, { useState, useEffect, useRef } from 'react';
import { X, Play } from 'lucide-react';
import { t } from './i18n';

export default function AdPlayer({ lang, onComplete, onCancel }: any) {
  const [progress, setProgress] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isPaused && progress < 100) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timerRef.current);
            setTimeout(() => onComplete(), 500);
            return 100;
          }
          return p + 2; // 5 seconds
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, progress, onComplete]);

  const handleBack = () => {
    setIsPaused(true);
    setShowExitConfirm(true);
  };

  const handleContinue = () => {
    setShowExitConfirm(false);
    setIsPaused(false);
  };

  const handleExit = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
      {!showExitConfirm && (
        <button onClick={handleBack} className="absolute top-4 left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 z-10 text-white">
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="w-full max-w-[320px] aspect-video bg-[#1a1c24] rounded-xl mb-8 flex items-center justify-center overflow-hidden relative shadow-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        <div className="flex flex-col items-center">
          <Play className="w-12 h-12 text-blue-500 mb-2 opacity-50" />
          <span className="text-[14px] text-white/50 font-bold tracking-widest">{t(lang, "Ad is playing")}</span>
        </div>
      </div>
      
      <div className="w-[80%] max-w-[300px]">
        <div className="flex justify-between text-[11px] font-bold text-white/50 mb-2 uppercase tracking-wider">
          <span>Reward</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#11141d] border border-white/10 rounded-2xl p-6 text-center shadow-2xl max-w-[300px] w-full">
            <h3 className="text-[18px] font-bold text-white mb-2">Wait!</h3>
            <p className="text-[13px] text-white/60 mb-6">{t(lang, "Please wait until the ad finishes to claim your reward.")}</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleContinue} className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                {t(lang, "Continue Watching")}
              </button>
              <button onClick={handleExit} className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">
                {t(lang, "Exit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
