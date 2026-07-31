import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Coins, History, Settings, Info, Volume2, VolumeX } from 'lucide-react';

export default function CoinFlip({
  balance,
  setBalance,
  setNotification,
  setHistory,
  setActiveTab,
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

  const enabled = adminSettings.coinFlipEnabled !== false;
  const maintenance = adminSettings.coinFlipMaintenance === true;
  const minBet = adminSettings.coinFlipMinBet || 1;
  const maxBet = adminSettings.coinFlipMaxBet || 100;
  const multiplier = adminSettings.coinFlipMultiplier || 2;
  const winProb = adminSettings.coinFlipWinProb || 50;
  const dailyLimit = adminSettings.coinFlipDailyLimit || 10;
  const cooldownSecs = adminSettings.coinFlipCooldown || 0;

  const [betAmount, setBetAmount] = useState(minBet * (rate || 1));
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [dailyPlays, setDailyPlays] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Sounds
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    flipSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-coin-win-space-device-3272.wav');
    winSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-arcade-bonus-alert-767.wav');
    loseSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2954/2954-game-over-trombone-39.wav');
  }, []);

  const playSound = (sound: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && sound.current) {
      sound.current.currentTime = 0;
      sound.current.play().catch(e => console.log('Audio play failed', e));
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleFlip = () => {
    if (!enabled || maintenance) return;
    if (cooldown > 0) {
      setNotification(`Wait ${cooldown}s before next flip!`);
      return;
    }
    if (dailyPlays >= dailyLimit) {
      setNotification("Daily limit reached for Coin Flip!");
      return;
    }
    if (!selectedSide) {
      setNotification("Please select Heads or Tails!");
      return;
    }
    
    const actualBet = betAmount / (rate || 1);
    
    if (balance < actualBet) {
      setNotification("Insufficient balance!");
      return;
    }
    if (actualBet < minBet || actualBet > maxBet) {
      setNotification(`Bet must be between ${getCurrencySymbol()}${(minBet * rate).toFixed(2)} and ${getCurrencySymbol()}${(maxBet * rate).toFixed(2)}`);
      return;
    }

    setBalance((prev: number) => prev - actualBet);
    setIsFlipping(true);
    setResult(null);
    playSound(flipSound);

    setTimeout(() => {
      const isWin = Math.random() * 100 <= winProb;
      const flipResult = isWin ? selectedSide : (selectedSide === 'heads' ? 'tails' : 'heads');
      
      setResult(flipResult);
      setIsFlipping(false);
      
      if (isWin) {
        const winnings = actualBet * multiplier;
        setBalance((prev: number) => prev + winnings);
        setNotification(`You won ${getCurrencySymbol()}${(winnings * rate).toFixed(2)}!`);
        setHistory((prev: any) => [{
          id: Date.now(),
          type: "earn",
          desc: "Coin Flip Win",
          amount: winnings,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          status: "Paid"
        }, ...prev]);
        playSound(winSound);
      } else {
        setNotification("You lost! Better luck next time.");
        setHistory((prev: any) => [{
          id: Date.now(),
          type: "loss",
          desc: "Coin Flip Loss",
          amount: actualBet,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          status: "Lost"
        }, ...prev]);
        playSound(loseSound);
      }
      
      setDailyPlays(p => p + 1);
      setCooldown(cooldownSecs);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="bg-yellow-500/10 text-yellow-500 text-[12px] font-bold px-3 py-1.5 rounded-full border border-yellow-500/20">
            {dailyPlays}/{dailyLimit} Plays
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
            <Coins className="w-5 h-5 text-white drop-shadow-md" />
          </div>
          <div>
            <div className="font-bold text-[16px] text-white">Coin Flip</div>
            <div className="text-[12px] text-white/80 font-medium">Double your money!</div>
          </div>
        </div>
      </div>

      {(!enabled || maintenance) ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-center p-6 rounded-xl font-medium">
          Coin Flip is currently unavailable.
        </div>
      ) : (
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl p-6">
          <div className="flex justify-center mb-8 h-40 items-center perspective-1000">
            <motion.div 
              className="w-32 h-32 relative preserve-3d"
              animate={isFlipping ? { rotateY: [0, 360, 720, 1080, 1440] } : { rotateY: result === 'tails' ? 180 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Heads Side */}
              <div className="absolute inset-0 backface-hidden rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border-4 border-yellow-700 shadow-2xl flex items-center justify-center">
                <span className="text-4xl font-black text-yellow-900">H</span>
              </div>
              {/* Tails Side */}
              <div className="absolute inset-0 backface-hidden rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-4 border-gray-600 shadow-2xl flex items-center justify-center [transform:rotateY(180deg)]">
                <span className="text-4xl font-black text-gray-800">T</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => !isFlipping && setSelectedSide('heads')}
              className={`py-3 rounded-xl font-bold transition-all border ${selectedSide === 'heads' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
              disabled={isFlipping}
            >
              HEADS
            </button>
            <button 
              onClick={() => !isFlipping && setSelectedSide('tails')}
              className={`py-3 rounded-xl font-bold transition-all border ${selectedSide === 'tails' ? 'bg-gray-400/20 border-gray-400 text-gray-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
              disabled={isFlipping}
            >
              TAILS
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-[12px] font-bold text-white/50">
              <span>Bet Amount</span>
              <span>Min: {getCurrencySymbol()}{(minBet * rate).toFixed(2)} | Max: {getCurrencySymbol()}{(maxBet * rate).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4 bg-black/40 rounded-xl p-2 border border-white/5">
              <button 
                onClick={() => setBetAmount(Math.max(minBet * rate, betAmount / 2))}
                className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                disabled={isFlipping}
              >
                /2
              </button>
              <div className="flex-1 text-center font-black text-xl text-yellow-500">
                {getCurrencySymbol()}{betAmount.toFixed(2)}
              </div>
              <button 
                onClick={() => setBetAmount(Math.min(maxBet * rate, betAmount * 2))}
                className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                disabled={isFlipping}
              >
                x2
              </button>
            </div>
          </div>

          <button 
            onClick={handleFlip}
            disabled={isFlipping || cooldown > 0}
            className="w-full h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center text-[16px]"
          >
            {isFlipping ? "FLIPPING..." : cooldown > 0 ? `WAIT ${cooldown}s` : "FLIP COIN"}
          </button>
          
          <div className="mt-4 text-center text-[11px] text-white/40 font-medium">
            Win {multiplier}x your bet! ({winProb}% Chance)
          </div>
        </div>
      )}
    </div>
  );
}
