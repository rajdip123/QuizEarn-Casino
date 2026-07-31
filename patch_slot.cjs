const fs = require('fs');

let content = fs.readFileSync('src/RoyalSlot.tsx', 'utf8');

// Props
content = content.replace(
  'setActiveTab\n}: any) {',
  'setActiveTab,\n  setPlayingAd,\n  adminSettings,\n  lang,\n  currency\n}: any) {'
);

content = content.replace(
  "import { ChevronRight } from 'lucide-react';",
  "import { ChevronRight } from 'lucide-react';\nimport { t } from './i18n';"
);

const getCurrencySymbol = `  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };`;

if (!content.includes('getCurrencySymbol')) {
  content = content.replace('const [reels, setReels]', getCurrencySymbol + '\n  const [reels, setReels]');
}

// Cooldown logic
const cooldownCode = `
  useEffect(() => {
    const lastSpin = localStorage.getItem('lastSlotSpin');
    if (lastSpin) {
      const elapsed = Math.floor((Date.now() - Number(lastSpin)) / 1000);
      const reqCooldown = adminSettings?.wheelCooldown || 30; // Using wheelCooldown or generic
      if (elapsed < reqCooldown) {
        setCooldown(reqCooldown - elapsed);
      }
    }
  }, [adminSettings?.wheelCooldown]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(c => {
          if (c <= 1) return 0;
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);
`;
content = content.replace(/useEffect\(\(\) => \{\n    let timer: any;[\s\S]*?\}, \[cooldown\]\);/, cooldownCode);

const originalSpin = /const spin = \(\) => \{[\s\S]*?const timer = setTimeout\(\(\) => \{[\s\S]*?\}, 2000\);\n  \};/m;

const newSpin = `
  const executeSpin = (isFree: boolean) => {
    if (!isFree) {
      if (balance < betAmount) {
        setNotification(t(lang, "Not enough balance!"));
        return;
      }
      setBalance((b: number) => b - betAmount);
    }

    setIsSpinning(true);
    
    // Play sound
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

    // Animation frames
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
        
        // Cooldown
        localStorage.setItem('lastSlotSpin', Date.now().toString());
        setCooldown(adminSettings?.wheelCooldown || 30);

        // Win logic based on admin probability
        const winProb = adminSettings?.slotWinProb || 30;
        let finalReels = [];
        if (Math.random() * 100 < winProb) {
          // Force win
          const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          finalReels = [sym, sym, sym];
        } else {
          // Random (highly unlikely to be 3 same naturally, but just in case)
          finalReels = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
          ];
          if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
             finalReels[2] = SYMBOLS[(SYMBOLS.indexOf(finalReels[2]) + 1) % SYMBOLS.length]; // force loss
          }
        }
        
        setReels(finalReels);

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          const win = isFree ? 10 : betAmount * 50; // free spin gives flat 10, otherwise 50x bet
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
          
          setNotification(\`🎰 \${t(lang, "JACKPOT! You won")} \${getCurrencySymbol()}\${win}!\`);
        } else {
          setNotification(\`😢 \${t(lang, "Try Again! Better luck next time!")}\`);
        }
      }
    }, 100);
  };

  const spin = () => {
    if (cooldown > 0) {
      setNotification(\`Please wait \${cooldown}s before spinning again\`);
      return;
    }
    executeSpin(false);
  };

  const freeSpin = () => {
    if (cooldown > 0) {
      setNotification(\`Please wait \${cooldown}s before spinning again\`);
      return;
    }
    setPlayingAd({ type: 'free_slot', onSuccess: () => executeSpin(true) });
  };
`;

content = content.replace(originalSpin, newSpin);

// UI formatting
content = content.replace(
  "Royal Slots",
  "{t(lang, 'Royal Slots')}"
);

content = content.replace(
  "Match 3 to win 50x your bet",
  "{t(lang, 'Match 3 to win 50x your bet')}"
);

content = content.replace(
  "Bet Amount",
  "{t(lang, 'Bet Amount')}"
);

content = content.replace(
  "₹{betAmount}",
  "{getCurrencySymbol()}{betAmount}"
);

content = content.replace(
  "₹10",
  "{getCurrencySymbol()}10"
);

content = content.replace(
  "₹20",
  "{getCurrencySymbol()}20"
);

content = content.replace(
  "₹50",
  "{getCurrencySymbol()}50"
);

content = content.replace(
  '<button \n        onClick={spin}',
  `{adminSettings?.freeSlotEnabled && (
        <button 
          onClick={freeSpin}
          disabled={isSpinning || cooldown > 0}
          className={\`w-full font-bold rounded-xl py-3 mb-3 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] \${isSpinning || cooldown > 0 ? 'bg-yellow-600/50 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black'}\`}
        >
          {isSpinning ? t(lang, 'Rolling...') : cooldown > 0 ? \`\${t(lang, 'Wait')} \${cooldown}s\` : t(lang, 'Free Slot (Watch Ad)')}
        </button>
      )}
      <button \n        onClick={spin}`
);

content = content.replace(
  "'SPIN SLOT'",
  "t(lang, 'SPIN SLOT')"
);

content = content.replace(
  "'Rolling...'",
  "t(lang, 'Rolling...')"
);

fs.writeFileSync('src/RoyalSlot.tsx', content, 'utf8');
