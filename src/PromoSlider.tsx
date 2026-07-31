import React, { useState, useEffect } from 'react';
import { Target, CircleDashed, Dices, Gift, Tv, Users, Brain } from 'lucide-react';
import { t } from './i18n';

const PROMO_SLIDES = [
  { text: "Play Quiz & Earn Real Money", icon: Target },
  { text: "Lucky Wheel", icon: CircleDashed },
  { text: "Royal Slots", icon: Dices },
  { text: "Daily Bonus", icon: Gift },
  { text: "Watch Ads", icon: Tv },
  { text: "Refer & Earn", icon: Users },
  { text: "Casino Quiz", icon: Brain }
];

export default function PromoSlider({ lang }: { lang: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4 relative overflow-hidden flex items-center justify-center min-h-[50px]">
        {PROMO_SLIDES.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="bg-yellow-500/20 p-1.5 rounded-lg shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                <Icon className="w-4 h-4 text-yellow-500" />
              </div>
              <span className="font-bold text-white text-[13px] tracking-wide shadow-black drop-shadow-md">
                {t(lang, slide.text)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-purple-500/30 p-6 flex items-center justify-center mb-6 min-h-[90px] bg-[#0a0a0a] group cursor-default">
        {/* Hidden game characters behind heavy blur */}
        <div className="absolute inset-0 flex items-center justify-between px-6 opacity-40 blur-[6px] pointer-events-none select-none transition-all duration-1000 group-hover:blur-[8px]">
          <span className="text-5xl transform -rotate-12">👾</span>
          <span className="text-4xl transform rotate-12">🧙‍♂️</span>
          <span className="text-5xl transform -rotate-6">🥷</span>
          <span className="text-4xl transform rotate-12">🤖</span>
        </div>
        
        {/* Heavy Blur Overlay */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[12px]"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center flex flex-col items-center gap-1.5">
          <div className="text-purple-400 text-[15px] font-extrabold tracking-widest drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center gap-2">
            ✨ {t(lang, 'More Interesting Games')}
          </div>
          <div className="text-white/60 text-[12px] font-bold tracking-widest uppercase animate-pulse">
            {t(lang, 'Coming Soon...')}
          </div>
        </div>
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
      </div>
    </>
  );
}
