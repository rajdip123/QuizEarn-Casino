import React from 'react';

export function AdBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full relative flex items-center justify-center overflow-hidden transition-[height,opacity,margin] duration-300 ease-in-out group empty:h-0 empty:min-h-0 empty:opacity-0 empty:-mb-4 has-[[data-ad-status='unfilled']]:h-0 has-[[data-ad-status='unfilled']]:min-h-0 has-[[data-ad-status='unfilled']]:opacity-0 has-[[data-ad-status='unfilled']]:-mb-4 has-[ins:empty]:h-0 has-[ins:empty]:min-h-0 has-[ins:empty]:opacity-0 has-[ins:empty]:-mb-4 [&:not(:empty)]:min-h-[50px] md:[&:not(:empty)]:min-h-[90px] [&:not(:empty)]:bg-[#1a1a1a] [&:not(:empty)]:border [&:not(:empty)]:border-white/10 [&:not(:empty)]:rounded-xl">
      {children}
    </div>
  );
}

export function AdNative() {
  return (
    <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-[20px] p-4 flex flex-col items-center justify-center relative overflow-hidden group min-h-[250px]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      <span className="text-[12px] text-white/30 font-bold uppercase tracking-widest text-center">Monetag Native Ad Space<br/><span className="text-[10px] text-amber-500">Premium Placement</span></span>
    </div>
  );
}

export function AdSplash() {
  return (
    <div className="w-full max-w-[300px] aspect-[6/5] bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group mb-8 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      <span className="text-[12px] text-white/30 font-bold uppercase tracking-widest text-center">AdMob Splash Ad Space<br/><span className="text-[10px] text-amber-500">Premium Placement</span></span>
    </div>
  );
}

export function AdAppOpen() {
  return (
    <div className="w-full max-w-[320px] aspect-[2/3] bg-[#1a1a1a] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      <span className="text-[14px] text-white/30 font-bold uppercase tracking-widest text-center">AdMob App Open Ad Space</span>
    </div>
  );
}

export function AdInterstitial() {
  return null; 
}

export function AdRewarded() {
  return null; 
}

export function AdRewardedInterstitial() {
  return null; 
}
