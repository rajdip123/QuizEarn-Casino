const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('const [adminSettings')) {
  content = content.replace(
    'const [adminRevenue, setAdminRevenue] = useState(0);',
    `const [adminRevenue, setAdminRevenue] = useState(0);
  const [adminSettings, setAdminSettings] = useState({
    adReward: 0.5,
    wheelCooldown: 60,
    wheelJackpotProb: 5,
    freeSpinEnabled: true,
    slotWinProb: 30,
    freeSlotEnabled: true,
    dailyBonus: 5,
    referReward: 5,
    quizReward: 10,
    quizLockHours: 24,
  });`
  );
}

// Modify component renders
const renderReplacements = [
  {
    search: /<LuckyWheel[\s\S]*?\/>/,
    replace: `<LuckyWheel 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
            currency={currency}
            lang={appLanguage}
            adminSettings={adminSettings}
            setPlayingAd={setPlayingAd}
          />`
  },
  {
    search: /<RoyalSlot[\s\S]*?\/>/,
    replace: `<RoyalSlot 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
            currency={currency}
            lang={appLanguage}
            adminSettings={adminSettings}
            setPlayingAd={setPlayingAd}
          />`
  },
  {
    search: /<WatchAds[\s\S]*?\/>/,
    replace: `<WatchAds 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
            currency={currency}
            lang={appLanguage}
            adminSettings={adminSettings}
            setPlayingAd={setPlayingAd}
          />`
  },
  {
    search: /<DailyBonus[\s\S]*?\/>/,
    replace: `<DailyBonus 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
            currency={currency}
            lang={appLanguage}
            adminSettings={adminSettings}
          />`
  },
  {
    search: /<AdminRevenue[\s\S]*?\/>/,
    replace: `<AdminRevenue 
                  adminRevenue={adminRevenue} 
                  setAdminRevenue={setAdminRevenue} 
                  setNotification={setNotification} 
                  adminSettings={adminSettings}
                  setAdminSettings={setAdminSettings}
                />`
  }
];

renderReplacements.forEach(r => {
  content = content.replace(r.search, r.replace);
});

fs.writeFileSync('src/App.tsx', content, 'utf8');
