import React from 'react';
import { Home, Gamepad2, Wallet, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-t border-white/5 pb-safe">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setActiveTab('games')} className={`flex flex-col items-center gap-1 ${['games', 'slot', 'wheel'].includes(activeTab) ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}>
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Games</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center gap-1 ${activeTab === 'wallet' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}>
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}>
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </div>
    </div>
  );
}
