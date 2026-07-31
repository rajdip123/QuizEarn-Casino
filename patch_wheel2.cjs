const fs = require('fs');

let content = fs.readFileSync('src/LuckyWheel.tsx', 'utf8');

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
  content = content.replace('const rewards = ', getCurrencySymbol + '\n  const rewards = ');
}

// Fix labels
content = content.replace(
  'const labels = ["₹0.10", "₹0.50", "₹2", "₹5", "₹10", "₹20", "₹50", "JACKPOT ₹100", "TRY AGAIN", "TRY AGAIN", "TRY AGAIN"];',
  'const labels = ["0.10", "0.50", "2", "5", "10", "20", "50", "JACKPOT 100", "TRY AGAIN", "TRY AGAIN", "TRY AGAIN"];'
);

// We need to persist cooldown to localStorage.
const cooldownCode = `
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
        setCooldown(c => {
          if (c <= 1) return 0;
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);
`;

content = content.replace(
  /useEffect\(\(\) => \{\n    let timer: any;[\s\S]*?\}, \[cooldown\]\);/m,
  cooldownCode
);

const originalSpin = /const spin = async \(\) => \{[\s\S]*?\n  \};/m;

const newSpin = `
  const executeSpin = async (isFree: boolean) => {
    if (!isFree) {
      if (balance < 5) {
        setNotification(t(lang, "Not enough balance! (5 required)"));
        return;
      }
      setBalance((b: number) => b - 5);
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

    const win = rewards[winIndex];
    if (win > 0) {
      setBalance((b: number) => b + win);
      setHistory((h: any) => [{
        id: Date.now(),
        type: "earn",
        amount: win,
        desc: win === 100 ? "🎰 JACKPOT WIN" : "Wheel Spin Win",
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
      
      setNotification(win === 100 ? \`\${t(lang, "JACKPOT! You won")} \${getCurrencySymbol()}100!\` : \`🎉 \${t(lang, "You won")} \${getCurrencySymbol()}\${win}!\`);
    } else {
      setNotification(\`😢 \${t(lang, "Try Again! Better luck next time!")}\`);
    }
  };

  const spin = async () => {
    if (cooldown > 0) {
      setNotification(\`Please wait \${cooldown}s before spinning again\`);
      return;
    }
    await executeSpin(false);
  };

  const freeSpin = () => {
    if (cooldown > 0) {
      setNotification(\`Please wait \${cooldown}s before spinning again\`);
      return;
    }
    setPlayingAd({ type: 'free_spin', onSuccess: () => executeSpin(true) });
  };
`;

content = content.replace(originalSpin, newSpin);

// UI adjustments for labels
content = content.replace(
  '{label}',
  '{label.includes("TRY") ? label : label.includes("JACKPOT") ? label : getCurrencySymbol() + label}'
);

content = content.replace(
  '<button \n        onClick={spin}',
  `{adminSettings?.freeSpinEnabled && (
        <button 
          onClick={freeSpin}
          disabled={isSpinning || cooldown > 0}
          className={\`w-full font-bold rounded-xl py-3 mb-3 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] \${isSpinning || cooldown > 0 ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white'}\`}
        >
          {isSpinning ? t(lang, 'Spinning...') : cooldown > 0 ? \`\${t(lang, 'Wait')} \${cooldown}s\` : t(lang, 'Free Spin (Watch Ad)')}
        </button>
      )}
      <button \n        onClick={spin}`
);

// Translating basic strings
content = content.replace(
  "Spin to win up to ₹100",
  "{t(lang, 'Spin to win up to')} {getCurrencySymbol()}100"
);

content = content.replace(
  "Lucky Wheel",
  "{t(lang, 'Lucky Wheel')}"
);

content = content.replace(
  "'Spin Now (₹5)'",
  "`${t(lang, 'Spin Now')} (${getCurrencySymbol()}5)`"
);

fs.writeFileSync('src/LuckyWheel.tsx', content, 'utf8');
