import React from 'react';
import { Target, Dice5, Tv, Gift, Users } from 'lucide-react';

export default function GamesTab({ setActiveTab }: any) {
  return (
    <div className="space-y-4 pb-20">
      <h3 className="font-bold text-[18px] text-white px-2">Earn & Play</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Quiz */}
        <div onClick={() => setActiveTab('quiz_categories')} className="bg-[#0a0a0a] border border-yellow-500/30 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <Target className="w-8 h-8 text-yellow-500 mb-3" />
          <div className="font-bold text-white text-[15px]">Quiz Earn</div>
          <div className="text-[11px] text-white/50 mt-1">Play 5000+ quizzes</div>
        </div>

        {/* Lucky Wheel */}
        <div onClick={() => setActiveTab('wheel')} className="bg-[#0a0a0a] border border-amber-500/30 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <Dice5 className="w-8 h-8 text-amber-400 mb-3" />
          <div className="font-bold text-white text-[15px]">Lucky Wheel</div>
          <div className="text-[11px] text-white/50 mt-1">Spin & Win up to ₹100</div>
        </div>

        {/* Slot Game */}
        <div onClick={() => setActiveTab('slot')} className="bg-[#0a0a0a] border border-emerald-500/30 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group col-span-2 sm:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <Dice5 className="w-8 h-8 text-emerald-400 mb-3" />
          <div className="font-bold text-white text-[15px]">Slot Machine</div>
          <div className="text-[11px] text-white/50 mt-1">Bet & Multiply your cash</div>
        </div>

        {/* Watch Ads */}
        <div onClick={() => setActiveTab('watch_ads')} className="bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <Tv className="w-8 h-8 text-blue-400 mb-3" />
          <div className="font-bold text-white text-[15px]">Watch Ads</div>
          <div className="text-[11px] text-white/50 mt-1">Earn for every video</div>
        </div>

        {/* Daily Bonus */}
        <div onClick={() => setActiveTab('daily_bonus')} className="bg-[#0a0a0a] border border-pink-500/30 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <Gift className="w-8 h-8 text-pink-400 mb-3" />
          <div className="font-bold text-white text-[15px]">Daily Bonus</div>
          <div className="text-[11px] text-white/50 mt-1">Claim your free cash</div>
        </div>

        {/* Refer & Earn */}
        <div onClick={() => setActiveTab('refer')} className="bg-[#0a0a0a] border border-orange-500/30 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <Users className="w-8 h-8 text-orange-400 mb-3" />
          <div className="font-bold text-white text-[15px]">Refer & Earn</div>
          <div className="text-[11px] text-white/50 mt-1">Invite friends, get paid</div>
        </div>
      </div>
    </div>
  );
}
