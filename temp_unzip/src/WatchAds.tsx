import React, { useState, useEffect } from 'react';
import { ChevronRight, Tv, CheckCircle2 } from 'lucide-react';

export default function WatchAds({
  balance,
  setBalance,
  setNotification,
  setHistory,
  setActiveTab
}: any) {
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [adCooldown, setAdCooldown] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const maxAds = 10;
  const rewardAmount = 0.5;

  useEffect(() => {
    let timer: any;
    if (adCooldown > 0) {
      timer = setInterval(() => setAdCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [adCooldown]);

  const watchAd = () => {
    if (adsWatched >= maxAds) {
      setNotification("Daily ad limit reached! Come back tomorrow.");
      return;
    }
    if (adCooldown > 0) {
      setNotification(`Please wait ${adCooldown}s before watching another ad.`);
      return;
    }

    setIsLoadingAd(true);
    setNotification("Loading Ad...");
    
    // Simulate Ad watching (e.g. 5 seconds)
    setTimeout(() => {
      setIsLoadingAd(false);
      setBalance((b: number) => b + rewardAmount);
      setHistory((h: any) => [{
        id: Date.now(),
        type: "earn",
        amount: rewardAmount,
        desc: "Watched Ad Reward",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: "Paid"
      }, ...h]);
      
      setAdsWatched(prev => prev + 1);
      setAdCooldown(30); // 30 seconds cooldown between ads
      setNotification(`🎉 You earned ₹${rewardAmount}!`);
    }, 5000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-[20px] p-6 text-center shadow-[0_0_30px_rgba(59,130,246,0.1)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setActiveTab("games")} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h3 className="font-bold text-[18px] text-white">Watch Ads</h3>
        <div className="w-8"></div>
      </div>
      
      <p className="text-[12px] text-white/50 mb-8">Earn ₹{rewardAmount} for every video you watch</p>
      
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-50"></div>
        <div className="relative w-full h-full rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
          <Tv className={`w-12 h-12 ${isLoadingAd ? 'text-white animate-pulse' : 'text-blue-400'}`} />
        </div>
      </div>

      <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-white/50">Daily Progress</span>
          <span className="text-[12px] font-bold text-white">{adsWatched} / {maxAds}</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(adsWatched / maxAds) * 100}%` }}
          ></div>
        </div>
        {adsWatched >= maxAds && (
          <div className="mt-3 text-[11px] text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All ads completed for today!
          </div>
        )}
      </div>

      <button 
        onClick={watchAd}
        disabled={isLoadingAd || adCooldown > 0 || adsWatched >= maxAds}
        className={`w-full font-bold rounded-xl py-4 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] ${
          isLoadingAd || adCooldown > 0 || adsWatched >= maxAds 
            ? 'bg-blue-600/30 text-white/50 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}
      >
        {isLoadingAd 
          ? 'Watching Ad (5s)...' 
          : adCooldown > 0 
            ? `Next Ad in ${adCooldown}s` 
            : adsWatched >= maxAds
              ? 'Limit Reached'
              : 'Watch Ad Now'}
      </button>
    </div>
  );
}
