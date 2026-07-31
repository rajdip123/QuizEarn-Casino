const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('AdPlayer')) {
  content = content.replace(
    "import WatchAds from './WatchAds';",
    "import WatchAds from './WatchAds';\nimport AdPlayer from './AdPlayer';"
  );
}

if (!content.includes('const [playingAd')) {
  content = content.replace(
    'const [showAppOpenAd, setShowAppOpenAd] = useState(false);',
    'const [showAppOpenAd, setShowAppOpenAd] = useState(false);\n  const [playingAd, setPlayingAd] = useState<any>(null);'
  );
}

const adCompleteFn = `
  const handleAdComplete = (adInfo: any) => {
    setPlayingAd(null);
    if (adInfo.type === 'watch_ads') {
      const reward = adminSettings.adReward || 0.5;
      setBalance((b: number) => b + reward);
      setHistory((h: any) => [{ id: Date.now(), type: "earn", amount: reward, desc: "Watched Ad Reward", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: "Paid" }, ...h]);
      setNotification(\`🎉 You earned \${currency === 'USDT' ? '$' : currency === 'BDT' ? '৳' : '₹'}\${reward}!\`);
    } else if (adInfo.type === 'free_spin') {
      if (adInfo.onSuccess) adInfo.onSuccess();
    } else if (adInfo.type === 'free_slot') {
      if (adInfo.onSuccess) adInfo.onSuccess();
    }
  };
`;

if (!content.includes('handleAdComplete')) {
  content = content.replace(
    'const handleWithdraw = () => {',
    adCompleteFn + '\n  const handleWithdraw = () => {'
  );
}

if (!content.includes('<AdPlayer')) {
  content = content.replace(
    '{showAppOpenAd && (',
    `{playingAd && (
        <AdPlayer 
          lang={appLanguage}
          onComplete={() => handleAdComplete(playingAd)}
          onCancel={() => setPlayingAd(null)}
        />
      )}
      {showAppOpenAd && (`
  );
}

// Ensure WatchAds uses setPlayingAd
// WatchAds is passed via props, but Wait! App.tsx renders WatchAds. We can pass setPlayingAd to WatchAds, LuckyWheel, and RoyalSlot.
// I will patch the component renderings.

fs.writeFileSync('src/App.tsx', content, 'utf8');
