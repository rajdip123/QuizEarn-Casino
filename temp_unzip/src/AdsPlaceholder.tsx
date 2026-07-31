import React from 'react';

export function AdBanner() {
  return (
    <div className="w-full h-[50px] md:h-[90px] bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">AdMob Banner Ad Space</span>
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
    <div className="w-[300px] h-[250px] bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group mb-8 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      <span className="text-[12px] text-white/30 font-bold uppercase tracking-widest text-center">AdMob Splash Ad Space<br/><span className="text-[10px] text-amber-500">Premium Placement</span></span>
    </div>
  );
}

export function AdAppOpen() {
  return (
    <div className="w-[320px] h-[480px] bg-[#1a1a1a] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-2xl">
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
