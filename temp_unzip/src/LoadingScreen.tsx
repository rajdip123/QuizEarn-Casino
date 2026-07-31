import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { AdSplash } from './AdsPlaceholder';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Wait for fade out
          return 100;
        }
        return p + Math.floor(Math.random() * 10) + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-500 ${progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="absolute top-10 flex flex-col items-center">
        <div className="relative mb-6 animate-pulse">
          <div className="absolute inset-0 bg-amber-500 blur-[40px] opacity-20 rounded-full"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)] relative z-10 border border-yellow-300/50">
            <Crown className="w-10 h-10 text-black" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">QuizEarn Premium</h1>
        <p className="text-amber-500/70 font-medium tracking-widest text-[10px] uppercase">Secure Environment</p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <AdSplash />
      </div>

      <div className="absolute bottom-12 w-[250px] flex flex-col items-center">
        <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-3">{progress}% Loaded</div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-200 ease-out shadow-[0_0_15px_rgba(245,158,11,0.6)]"
            style={{ width: `${Math.min(100, progress)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
