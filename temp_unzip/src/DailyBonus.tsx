import React, { useState } from 'react';
import { ChevronRight, Gift, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyBonus({
  balance,
  setBalance,
  setNotification,
  setHistory,
  setActiveTab
}: any) {
  // Mock state for daily bonus
  const [currentStreak, setCurrentStreak] = useState(3); 
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const totalDays = 30;

  const claimBonus = () => {
    if (hasClaimedToday) {
      setNotification("Already claimed today! Come back tomorrow.");
      return;
    }

    const rewardAmount = (currentStreak + 1) * 2; // Increases every day: day1=2, day2=4, etc.

    setHasClaimedToday(true);
    setCurrentStreak(prev => prev + 1);
    setBalance((b: number) => b + rewardAmount);
    setHistory((h: any) => [{
      id: Date.now(),
      type: "earn",
      amount: rewardAmount,
      desc: `Daily Bonus (Day ${currentStreak + 1})`,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: "Paid"
    }, ...h]);
    
    setNotification(`🎉 Daily Bonus Claimed! You got ₹${rewardAmount}`);
  };

  const getRewardForDay = (day: number) => day * 2;

  return (
    <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[20px] p-6 text-center shadow-[0_0_30px_rgba(236,72,153,0.1)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setActiveTab("games")} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h3 className="font-bold text-[18px] text-white">Daily Bonus</h3>
        <div className="w-8"></div>
      </div>
      
      <p className="text-[12px] text-white/50 mb-8">Claim your free cash daily. Missing a day resets to Day 1.</p>
      
      <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full"></div>
        <Gift className="w-10 h-10 text-pink-400 relative z-10" />
      </div>

      <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-bold text-white">Reward Calendar</span>
          <span className="text-[12px] text-pink-400 font-bold">Streak: {currentStreak} / {totalDays}</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1">
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const isCompleted = day <= currentStreak;
            const isToday = day === currentStreak + 1;
            
            return (
              <motion.div 
                key={i} 
                initial={isToday ? { scale: 0.9 } : {}}
                animate={isToday ? { scale: [0.9, 1.05, 1] } : {}}
                transition={{ repeat: isToday && !hasClaimedToday ? Infinity : 0, duration: 1 }}
                className={`relative rounded-lg p-2 flex flex-col items-center justify-center border ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : isToday 
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)] z-10'
                      : 'bg-white/5 border-white/5 text-white/40'
                }`}
              >
                <div className="text-[9px] mb-1 font-bold">Day {day}</div>
                {isCompleted ? (
                  <Check className="w-4 h-4 mb-1" />
                ) : (
                  <div className="text-[11px] font-bold">₹{getRewardForDay(day)}</div>
                )}
                {isToday && !hasClaimedToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={claimBonus}
        disabled={hasClaimedToday}
        className={`w-full font-bold rounded-xl py-4 transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] ${
          hasClaimedToday 
            ? 'bg-pink-600/30 text-white/50 cursor-not-allowed' 
            : 'bg-pink-600 hover:bg-pink-500 text-white'
        }`}
      >
        {hasClaimedToday ? 'Come Back Tomorrow' : `Claim Day ${currentStreak + 1} Bonus`}
      </button>
    </div>
  );
}
