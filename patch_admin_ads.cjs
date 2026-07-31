const fs = require('fs');
let content = fs.readFileSync('src/AdminRevenue.tsx', 'utf8');

if (!content.includes('Ad Controls')) {
  const target = '</div>\n\n      <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl p-4 flex flex-col gap-3">';
  const replacement = `</div>
      
      <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl p-4 mb-6">
        <div className="font-bold text-[13px] text-white mb-4">Ad Controls</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Splash Ad', 'App Open', 'Banner', 'Native', 'Interstitial', 'Rewarded'].map(ad => (
            <div key={ad} className="flex justify-between items-center bg-[#1a1c24] border border-white/5 rounded-lg p-3">
              <span className="text-[12px] text-white/60">{ad}</span>
              <input type="checkbox" defaultChecked className="accent-amber-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl p-4 flex flex-col gap-3">`;
  
  content = content.replace(target, replacement);
  fs.writeFileSync('src/AdminRevenue.tsx', content, 'utf8');
}
