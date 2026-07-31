import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const SYMBOLS = ["💎", "7️⃣", "🍒", "🍋", "🔔", "⭐"];

export default function RoyalSlot({
  balance,
  setBalance,
  setNotification,
  setHistory,
  setActiveTab,
  currency // INR, BDT, USDT
}: any) {
  const [reels, setReels] = useState(["💎", "💎", "💎"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  
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

  const spin = () => {
    if (balance < bet) {
      setNotification(`Not enough balance! (${getCurrencySymbol()}${bet} required)`);
      return;
    }

    setIsSpinning(true);
    setBalance((b: number) => b - bet);
    playSound('spin');
    
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
      spinCount++;
      if (spinCount % 5 === 0) playSound('spin');
      
      if (spinCount > 20) {
        clearInterval(spinInterval);
        
        // Final result logic (30% win chance as per prompt requirement)
        const isWin = Math.random() < 0.3;
        let finalReels = [];
        if (isWin) {
          const winSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          finalReels = [winSymbol, winSymbol, winSymbol];
          const winAmount = bet * 50; // 50x multiplier
          
          setBalance((b: number) => b + winAmount);
          setHistory((h: any) => [{
            id: Date.now(),
            type: "earn",
            amount: winAmount,
            desc: "Slot Machine Win (50x)",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: "Paid"
          }, ...h]);
          
          setTimeout(() => {
            playSound('win');
            setNotification(`🎰 BIG WIN! You won ${getCurrencySymbol()}${winAmount} (50x multiplier)!`);
          }, 100);
        } else {
          // ensure lose
          const r1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          let r2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          let r3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          if (r1 === r2 && r2 === r3) {
            r3 = SYMBOLS[(SYMBOLS.indexOf(r3) + 1) % SYMBOLS.length]; // prevent accidental win
          }
          finalReels = [r1, r2, r3];
          
          setTimeout(() => {
            playSound('lose');
            setNotification("😢 No match! Try again.");
          }, 100);
        }
        setReels(finalReels);
        setIsSpinning(false);
      }
    }, 100);
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
      
      <p className="text-[12px] text-white/50 mb-8">Match 3 to win 50x your bet</p>
      
      <div className="bg-[#050505] border-4 border-yellow-500/30 rounded-2xl p-6 mb-8 relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 rounded-xl pointer-events-none z-10"></div>
        <div className="flex justify-center gap-4 relative z-0">
          {reels.map((symbol, i) => (
            <motion.div 
              key={i} 
              animate={isSpinning ? { y: [0, -20, 20, 0] } : { y: 0 }}
              transition={{ repeat: isSpinning ? Infinity : 0, duration: 0.2 }}
              className="w-20 h-28 bg-[#1a1c24] border-2 border-yellow-500/20 rounded-xl flex items-center justify-center text-[40px] shadow-lg"
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
        <span className="text-[13px] font-medium text-white/80">Bet Amount</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setBet(b => Math.max(1, b - 5))} className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">-</button>
          <span className="w-16 text-center font-bold text-white text-[15px]">{getCurrencySymbol()}{bet}</span>
          <button onClick={() => setBet(b => b + 5)} className="w-8 h-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">+</button>
        </div>
      </div>

      <button 
        onClick={spin}
        disabled={isSpinning}
        className={`w-full font-bold rounded-xl py-4 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] ${isSpinning ? 'bg-yellow-600/50 text-black/50 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black'}`}
      >
        {isSpinning ? 'Rolling...' : `SPIN SLOT (${getCurrencySymbol()}${bet})`}
      </button>
    </div>
  );
}
