import re

with open('src/RoyalSlot.tsx', 'r') as f:
    c = f.read()

newSpin = """  const executeSpin = (isFree: boolean) => {
    if (!isFree) {
      if (balance < bet) {
        setNotification(t(lang, "Not enough balance!"));
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
          
          setNotification(`🎰 ${t(lang, "JACKPOT! You won")} ${getCurrencySymbol()}${win}!`);
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
  };"""

# Replace old spin function completely.
c = re.sub(r'const spin = \(\) => \{[\s\S]*?clearInterval\(spinInterval\);\n      \}\n    \}, 100\);\n  \};', newSpin, c)

with open('src/RoyalSlot.tsx', 'w') as f:
    f.write(c)
