const fs = require('fs');
let content = fs.readFileSync('src/SettingsTab.tsx', 'utf8');

// Add soundEnabled and setSoundEnabled to props
content = content.replace(
  'export default function SettingsTab({ currency, setCurrency, setActiveTab }: any) {',
  'export default function SettingsTab({ currency, setCurrency, setActiveTab, soundEnabled, setSoundEnabled }: any) {'
);

// Add Volume2/VolumeX icons
if (!content.includes('Volume2')) {
  content = content.replace(
    'import { Image, ShieldCheck, CheckCircle2, ChevronRight, Mail, Download, LogOut } from \'lucide-react\';',
    'import { Image, ShieldCheck, CheckCircle2, ChevronRight, Mail, Download, LogOut, Volume2, VolumeX } from \'lucide-react\';'
  );
}

// Inject Sound Toggle UI before App Info section
const target = `{/* App Info Section */}`;
const replacement = `
      {/* Settings Options */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Options</h4>
        <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
            </div>
            <div>
              <div className="font-bold text-[13px] text-white">Sound Effects</div>
              <div className="text-[11px] text-white/50">Play sounds on rewards & spins</div>
            </div>
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={\`w-12 h-6 rounded-full relative transition-colors \${soundEnabled ? 'bg-amber-500' : 'bg-white/10'}\`}
          >
            <div className={\`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform \${soundEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
          </button>
        </div>
      </div>
      
      {/* App Info Section */}`;

content = content.replace(target, replacement);

// Replace purple with amber
content = content.replace(/purple-600/g, 'amber-600');
content = content.replace(/purple-500/g, 'amber-500');
content = content.replace(/purple-400/g, 'amber-400');

fs.writeFileSync('src/SettingsTab.tsx', content, 'utf8');
