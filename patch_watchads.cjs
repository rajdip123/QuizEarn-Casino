const fs = require('fs');

let content = fs.readFileSync('src/WatchAds.tsx', 'utf8');

const target = `    setIsLoadingAd(true);
    setNotification("Loading Ad...");
    
    // Simulate Ad watching (e.g. 5 seconds)
    setTimeout(() => {
      setIsLoadingAd(false);
      setBalance((b: number) => b + rewardAmount);
      setHistory((h: any) => [{
        id: Date.now(),
        type: "earn",
        amount: rewardAmount,
        desc: "Watched Ad Reward",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: "Paid"
      }, ...h]);
      
      setAdsWatched(prev => prev + 1);
      setAdCooldown(30); // 30 seconds cooldown between ads
      setNotification(\`🎉 You earned ₹\${rewardAmount}!\`);
    }, 5000);`;

const replacement = `    
    setPlayingAd({ type: 'watch_ads' });
    setAdsWatched(prev => prev + 1);
    setAdCooldown(30);
`;

content = content.replace(target, replacement);

if (!content.includes('setPlayingAd')) {
  content = content.replace(
    'setActiveTab\n}: any) {',
    'setActiveTab,\n  setPlayingAd,\n  adminSettings,\n  lang,\n  currency\n}: any) {'
  );
}

content = content.replace(/rewardAmount = 0.5/g, 'rewardAmount = adminSettings?.adReward || 0.5');

// Update language strings using `t`
content = content.replace(
  "import { ChevronRight, Tv, CheckCircle2 } from 'lucide-react';",
  "import { ChevronRight, Tv, CheckCircle2 } from 'lucide-react';\nimport { t } from './i18n';"
);

// Currency formatting
content = content.replace(/₹\{rewardAmount\}/g, `{currency === 'USDT' ? '$' : currency === 'BDT' ? '৳' : '₹'}{rewardAmount}`);
content = content.replace(/Earn ₹\{rewardAmount\}/g, `Earn {currency === 'USDT' ? '$' : currency === 'BDT' ? '৳' : '₹'}{rewardAmount}`);

fs.writeFileSync('src/WatchAds.tsx', content, 'utf8');
