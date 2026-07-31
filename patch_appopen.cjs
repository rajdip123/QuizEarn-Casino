const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('const [showAppOpenAd, setShowAppOpenAd]')) {
  content = content.replace(
    'const [isLoading, setIsLoading] = useState(true);',
    'const [isLoading, setIsLoading] = useState(true);\n  const [showAppOpenAd, setShowAppOpenAd] = useState(false);'
  );
}

if (!content.includes('<AdAppOpen')) {
  content = content.replace(
    'import { AdBanner, AdNative } from \'./AdsPlaceholder\';',
    'import { AdBanner, AdNative, AdAppOpen } from \'./AdsPlaceholder\';'
  );
  
  content = content.replace(
    'return <LoadingScreen onComplete={() => setIsLoading(false)} />;',
    'return <LoadingScreen onComplete={() => { setIsLoading(false); setShowAppOpenAd(true); }} />;'
  );

  content = content.replace(
    '<div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden font-sans">',
    `{showAppOpenAd && (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
          <AdAppOpen />
          <button 
            onClick={() => setShowAppOpenAd(false)} 
            className="mt-6 text-[12px] text-white/50 uppercase tracking-widest font-bold hover:text-white transition-colors"
          >
            Continue to App &rarr;
          </button>
        </div>
      )}
      <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden font-sans">`
  );
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
