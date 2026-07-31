import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { t } from './i18n';

export default function LuckyWheel({
  balance,
  setBalance,
  setNotification,
  setHistory,
  setActiveTab,
  setPlayingAd,
  adminSettings,
  lang,
  currency,
  rate
}: any) {
    const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };
  const rewards = [0.10, 0.50, 2, 5, 10, 20, 50, 100, 0, 0, 0];
  const labels = rewards.map(r => r === 0 ? "TRY AGAIN" : r === 100 ? `JACKPOT ${(100 * (rate||1)).toFixed(2)}` : (r * (rate||1)).toFixed(2));
  const colors = [
    "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#fbbf24", "#374151", "#4b5563", "#1f2937"
  ];
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [bet, setBet] = useState(5);
  const controls = useAnimation();
  const currentRotation = useRef(0);

  
  useEffect(() => {
    const lastSpin = localStorage.getItem('lastWheelSpin');
    if (lastSpin) {
      const elapsed = Math.floor((Date.now() - Number(lastSpin)) / 1000);
      const reqCooldown = adminSettings?.wheelCooldown || 60;
      if (elapsed < reqCooldown) {
        setCooldown(reqCooldown - elapsed);
      }
    }
  }, [adminSettings?.wheelCooldown]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c: number) => {
          if (c <= 1) return 0;
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);


  
  const executeSpin = async (isFree: boolean) => {
    if (!isFree) {
      if (balance * (rate||1) < bet * (rate||1)) {
        setNotification(t(lang, `Not enough balance! (${getCurrencySymbol()}${(bet * (rate||1)).toFixed(2)} required)`));
        return;
      }
      setBalance((b: number) => b - bet);
    }

    setIsSpinning(true);
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = AudioContext ? new AudioContext() : null;
    let tickInterval: any = null;

    if (audioCtx) {
      tickInterval = setInterval(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.05);
        } catch(e) {}
      }, 150);
    }

    // Determine win based on jackpot probability
    const jackpotProb = adminSettings?.wheelJackpotProb || 5;
    let winIndex = 0;
    if (Math.random() * 100 < jackpotProb) {
      winIndex = 7; // Jackpot index
    } else {
      // Pick random non-jackpot
      do {
        winIndex = Math.floor(Math.random() * rewards.length);
      } while(winIndex === 7);
    }

    const segmentAngle = 360 / rewards.length;
    const targetRotation = currentRotation.current + 360 * 5 + (360 - (winIndex * segmentAngle));

    await controls.start({
      rotate: targetRotation,
      transition: { duration: 5, ease: [0.2, 0.8, 0.2, 1] }
    });

    if (tickInterval) clearInterval(tickInterval);
    currentRotation.current = targetRotation % 360;
    setIsSpinning(false);
    
    // Set cooldown
    localStorage.setItem('lastWheelSpin', Date.now().toString());
    setCooldown(adminSettings?.wheelCooldown || 60);

    const win = rewards[winIndex] * (bet / 5);
    if (win > 0) {
      setBalance((b: number) => b + win);
      setHistory((h: any) => [{
        id: Date.now(),
        type: "earn",
        amount: win,
        desc: win === (100 * (bet/5)) ? "🎰 JACKPOT WIN" : "Wheel Spin Win",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: "Paid"
      }, ...h]);
      
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        osc.start();
        osc.stop(audioCtx.currentTime + 1);
      }
      
      setNotification(win === (100 * (bet/5)) ? `${t(lang, "JACKPOT! You won")} ${getCurrencySymbol()}${(win * (rate||1)).toFixed(2)}!` : `🎉 ${t(lang, "You won")} ${getCurrencySymbol()}${(win * (rate||1)).toFixed(2)}!`);
    } else {
      setNotification(`😢 ${t(lang, "Try Again! Better luck next time!")}`);
    }
  };

  const spin = async () => {
    if (cooldown > 0) {
      setNotification(`Please wait ${cooldown}s before spinning again`);
      return;
    }
    await executeSpin(false);
  };

  const freeSpin = () => {
    if (cooldown > 0) {
      setNotification(`Please wait ${cooldown}s before spinning again`);
      return;
    }
    setPlayingAd({ type: 'free_spin', onSuccess: () => executeSpin(true) });
  };


  const conicString = colors.map((c, i) => `${c} ${(i * 360) / colors.length}deg ${((i + 1) * 360) / colors.length}deg`).join(', ');

  return (
    <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-[20px] p-6 text-center">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setActiveTab("home")} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h3 className="font-bold text-[18px] text-white">Lucky Wheel</h3>
        <div className="w-8"></div>
      </div>
      
      <p className="text-[12px] text-white/50 mb-8">Spin to win up to {getCurrencySymbol()}{(100 * (bet/5) * (rate||1)).toFixed(2)}</p>
      
      <div className="relative w-full max-w-[288px] aspect-square mx-auto mb-8">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-yellow-500 z-20" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
        
        <motion.div 
          animate={controls}
          className="w-full h-full rounded-full border-4 border-amber-500/50 relative shadow-[0_0_30px_rgba(147,51,234,0.3)]"
          style={{ 
            background: `conic-gradient(${conicString})`,
            transformOrigin: "50% 50%" 
          }}
        >
          {labels.map((label, i) => {
            const rotation = (i * 360) / labels.length + (360 / labels.length) / 2;
            return (
              <div 
                key={i} 
                className="absolute w-full h-full pointer-events-none"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "50% 50%"
                }}
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 origin-bottom text-center w-16">
                  <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] block">{label.includes("TRY") ? label : label.includes("JACKPOT") ? label : getCurrencySymbol() + label}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#1a1c24] rounded-full border-4 border-amber-500 z-10 flex items-center justify-center shadow-lg">
          <span className="text-[20px]">🎰</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border border-amber-500/5 shadow-inner rounded-xl p-3 mb-6">
        <span className="text-[13px] font-medium text-white/80">{t(lang, 'Bet Amount')}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setBet(b => Math.max(1, b - 5))} className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">-</button>
          <span className="w-16 text-center font-bold text-white text-[15px]">{getCurrencySymbol()}{(bet * (rate||1)).toFixed(2)}</span>
          <button onClick={() => setBet(b => b + 5)} className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">+</button>
        </div>
      </div>

      {adminSettings?.freeSpinEnabled && (
        <button 
          onClick={freeSpin}
          disabled={isSpinning || cooldown > 0}
          className={`w-full font-bold rounded-xl py-3 mb-3 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] ${isSpinning || cooldown > 0 ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white'}`}
        >
          {isSpinning ? t(lang, 'Spinning...') : cooldown > 0 ? `${t(lang, 'Wait')} ${cooldown}s` : t(lang, 'Free Spin (Watch Ad)')}
        </button>
      )}
      <button 
        onClick={spin}
        disabled={isSpinning || cooldown > 0}
        className={`w-full font-bold rounded-xl py-4 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all ${isSpinning || cooldown > 0 ? 'bg-amber-600/50 text-white/50 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 text-white'}`}
      >
        {isSpinning ? 'Spinning...' : cooldown > 0 ? `Wait ${cooldown}s` : `Spin Now (${getCurrencySymbol()}${(bet * (rate||1)).toFixed(2)})`}
      </button>
    </div>
  );
}
