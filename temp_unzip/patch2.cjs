const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import LoadingScreen')) {
  content = content.replace(
    "import PremiumWithdraw",
    "import LoadingScreen from './LoadingScreen';\nimport Confetti from 'react-confetti';\nimport { useWindowSize } from 'react-use';\nimport { AdBanner, AdNative } from './AdsPlaceholder';\nimport PremiumWithdraw"
  );
}

// Add state for loading screen, confetti, sound
if (!content.includes('const [isLoading, setIsLoading]')) {
  content = content.replace(
    'const [adminRevenue, setAdminRevenue] = useState(0);',
    'const [adminRevenue, setAdminRevenue] = useState(0);\n  const [isLoading, setIsLoading] = useState(true);\n  const [showConfetti, setShowConfetti] = useState(false);\n  const [soundEnabled, setSoundEnabled] = useState(true);\n  const { width, height } = useWindowSize();'
  );
}

// Add Confetti and Loading screen renders
if (!content.includes('<LoadingScreen')) {
  content = content.replace(
    'return (',
    `const triggerWin = (amount) => {
    setBalance(b => b + amount);
    if (soundEnabled) {
      // Play sound logic here (mock)
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#FBBF24', '#F59E0B', '#D97706', '#ffffff']} />}`
  );
  content = content.replace(/}\s*;\s*$/, '  </>\n  );\n}'); // close the fragment at the end
}

// Add Banner Ad below the header
if (!content.includes('<AdBanner />')) {
  content = content.replace(
    '<div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4">',
    '<div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4">\n        <div className="mb-4"><AdBanner /></div>'
  );
}

// Add Native ad in the Home tab
const homeGamesStart = content.indexOf('<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">');
if (homeGamesStart !== -1) {
  content = content.substring(0, homeGamesStart) + '<div className="mb-6"><AdNative /></div>\n        ' + content.substring(homeGamesStart);
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
