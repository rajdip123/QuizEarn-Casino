import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { t } from './i18n';

const SYMBOLS = ["💎", "7️⃣", "🍒", "🍋", "🔔", "⭐"];

export default function RoyalSlot({balance, setBalance, setNotification, setHistory, setActiveTab, setPlayingAd, adminSettings, lang, currency, rate}: any) {
  const [reels, setReels] = useState(["💎", "💎", "💎"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [cooldown, setCooldown] = useState(0);
  
  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };

  const playSound = (type: 'spin' | 'win' | 'lose') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'spin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'win') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.2);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    }
  };

    const executeSpin = (isFree: boolean) => {
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
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400 + Math.random()*200, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.05);
        } catch(e) {}
      }, 100);
    }

    let counter = 0;
    const animInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
      counter++;
      if (counter > 20) {
        clearInterval(animInterval);
        if (tickInterval) clearInterval(tickInterval);
        setIsSpinning(false);
        
        localStorage.setItem('lastSlotSpin', Date.now().toString());
        setCooldown(adminSettings?.wheelCooldown || 30);

        const winProb = adminSettings?.slotWinProb || 30;
        let finalReels = [];
        if (Math.random() * 100 < winProb) {
          const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          finalReels = [sym, sym, sym];
        } else {
          finalReels = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
          ];
          if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
             finalReels[2] = SYMBOLS[(SYMBOLS.indexOf(finalReels[2]) + 1) % SYMBOLS.length]; 
          }
        }
        
        setReels(finalReels);

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          const win = isFree ? 10 : bet * 50; 
          setBalance((b: number) => b + win);
          setHistory((h: any) => [{
            id: Date.now(),
            type: "earn",
            amount: win,
            desc: "Slot Machine Jackpot",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: "Paid"
          }, ...h]);
          
          if (audioCtx) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.2);
            osc.frequency.setValueAtTime(900, audioCtx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
            osc.start();
            osc.stop(audioCtx.currentTime + 1);
          }
          
          setNotification(`🎰 ${t(lang, "JACKPOT! You won")} ${getCurrencySymbol()}${(win * (rate||1)).toFixed(2)}!`);
        } else {
          setNotification(`😢 ${t(lang, "Try Again! Better luck next time!")}`);
        }
      }
    }, 100);
  };

  const spin = () => {
    if (cooldown > 0) {
      setNotification(`Please wait ${cooldown}s before spinning again`);
      return;
    }
    executeSpin(false);
  };

  const freeSpin = () => {
    if (cooldown > 0) {
      setNotification(`Please wait ${cooldown}s before spinning again`);
      return;
    }
    setPlayingAd({ type: 'free_slot', onSuccess: () => executeSpin(true) });
  };

  return (
    <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-[20px] p-6 text-center shadow-[0_0_30px_rgba(234,179,8,0.1)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setActiveTab("home")} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h3 className="font-bold text-[18px] text-white">Royal Slots</h3>
        <div className="w-8"></div>
      </div>
      
      <p className="text-[12px] text-white/50 mb-8">{t(lang, 'Match 3 to win 50x your bet')}</p>
      
      <div className="bg-[#050505] border-4 border-yellow-500/30 rounded-2xl p-6 mb-8 relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 rounded-xl pointer-events-none z-10"></div>
        <div className="flex justify-center gap-2 sm:gap-4 relative z-0">
          {reels.map((symbol, i) => (
            <motion.div 
              key={i} 
              animate={isSpinning ? { y: [0, -20, 20, 0] } : { y: 0 }}
              transition={{ repeat: isSpinning ? Infinity : 0, duration: 0.2 }}
              className="flex-1 max-w-[80px] aspect-[5/7] bg-[#1a1c24] border-2 border-yellow-500/20 rounded-xl flex items-center justify-center text-[40px] md:text-[50px] shadow-lg"
            >
              {symbol}
            </motion.div>
          ))}
        </div>
        {/* Slot machine accents */}
        <div className="absolute top-1/2 -left-2 w-4 h-12 bg-yellow-500/50 rounded-r-lg -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-2 w-4 h-12 bg-yellow-500/50 rounded-l-lg -translate-y-1/2"></div>
      </div>

      <div className="flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3 mb-6">
        <span className="text-[13px] font-medium text-white/80">{t(lang, 'Bet Amount')}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setBet(b => Math.max(1, b - 5))} className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">-</button>
          <span className="w-16 text-center font-bold text-white text-[15px]">{getCurrencySymbol()}{(bet * (rate||1)).toFixed(2)}</span>
          <button onClick={() => setBet(b => b + 5)} className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">+</button>
        </div>
      </div>

      {adminSettings?.freeSlotEnabled && (
        <button 
          onClick={freeSpin}
          disabled={isSpinning || cooldown > 0}
          className={`w-full font-bold rounded-xl py-3 mb-3 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] ${isSpinning || cooldown > 0 ? 'bg-yellow-600/50 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black'}`}
        >
          {isSpinning ? t(lang, 'Rolling...') : cooldown > 0 ? `${t(lang, 'Wait')} ${cooldown}s` : t(lang, 'Free Slot (Watch Ad)')}
        </button>
      )}
      <button 
        onClick={spin}
        disabled={isSpinning}
        className={`w-full font-bold rounded-xl py-4 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] ${isSpinning ? 'bg-yellow-600/50 text-black/50 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black'}`}
      >
        {isSpinning ? 'Rolling...' : `SPIN SLOT (${getCurrencySymbol()}${(bet * (rate||1)).toFixed(2)})`}
      </button>
    </div>
  );
}
