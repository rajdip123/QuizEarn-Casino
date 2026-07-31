import React, { useState } from 'react';
import { Users, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { t } from './i18n';

export default function ReferEarn({ 
  lang, 
  currency, 
  adminSettings, 
  rate, 
  balance, 
  setBalance, 
  setHistory, 
  setNotification, 
  setActiveTab 
}: any) {
  
  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };

  const [referralsCount, setReferralsCount] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText("CQGOLD777");
    setNotification(t(lang, "📋 Invite code copied!"));
  };

  const handleSimulateReferral = () => {
    if (!adminSettings.referralEnabled) {
      setNotification(t(lang, "Referral program is currently disabled"));
      return;
    }
    
    if (referralsCount >= adminSettings.lifetimeReferralLimit) {
      setNotification(t(lang, "Lifetime referral limit reached"));
      return;
    }

    const newCount = referralsCount + 1;
    setReferralsCount(newCount);
    setNotification(t(lang, `Simulated 1 new referral! Total: ${newCount}`));
  };

  const claimable = Math.floor(referralsCount / adminSettings.minReferrals) > claimedRewards;

  const handleClaim = () => {
    if (!adminSettings.referralEnabled) {
      setNotification(t(lang, "Referral program is currently disabled"));
      return;
    }
    
    if (adminSettings.referralStatus !== 'Active') {
      setNotification(t(lang, `Referral program status is: ${adminSettings.referralStatus}`));
      return;
    }

    if (!claimable) {
      setNotification(t(lang, `You need at least ${adminSettings.minReferrals} more referrals to claim again`));
      return;
    }

    if (claimedRewards >= adminSettings.maxReferralRewards) {
      setNotification(t(lang, "You have reached the maximum rewards allowed"));
      return;
    }

    const amountToReward = adminSettings.referReward;
    
    setBalance((b: number) => b + amountToReward);
    setClaimedRewards((prev: number) => prev + 1);
    
    setHistory((h: any) => [{
      id: Date.now(),
      type: "earn",
      amount: amountToReward,
      desc: "Referral Bonus Claimed",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: "Paid"
    }, ...h]);

    setNotification(`🎉 ${t(lang, 'Successfully claimed')} ${getCurrencySymbol()}${(amountToReward * (rate||1)).toFixed(2)}`);
  };

  if (!adminSettings.referralEnabled) {
    return (
      <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-[20px] p-6 text-center">
        <AlertCircle className="w-12 h-12 text-orange-500/50 mx-auto mb-4" />
        <h3 className="font-bold text-[20px] text-white mb-2">{t(lang, 'Refer & Earn')}</h3>
        <p className="text-[14px] text-white/50">{t(lang, 'The referral program is currently disabled.')}</p>
        <button onClick={() => setActiveTab("games")} className="mt-8 text-[13px] text-white/40 hover:text-white transition-colors">{t(lang, 'Back to Games')}</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-[20px] p-6 text-center shadow-[0_0_30px_rgba(249,115,22,0.1)]">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4 border border-orange-500/20 shadow-inner">
        <Users className="w-8 h-8 text-orange-400" />
      </div>
      
      <h3 className="font-bold text-[20px] text-white mb-2">{t(lang, 'Refer & Earn')}</h3>
      <p className="text-[12px] text-white/60 mb-6 max-w-[250px] mx-auto leading-relaxed">
        {t(lang, 'Invite friends and get')} <span className="font-bold text-orange-400">{getCurrencySymbol()}{(adminSettings.referReward * rate).toFixed(2)}</span> {t(lang, 'for every')} {adminSettings.minReferrals} {t(lang, 'signup(s)')}
      </p>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#1a1c24] border border-orange-500/20 rounded-xl p-3">
          <div className="text-[11px] text-white/40 uppercase font-bold mb-1">{t(lang, 'Your Referrals')}</div>
          <div className="text-[20px] font-bold text-white">{referralsCount}</div>
        </div>
        <div className="bg-[#1a1c24] border border-orange-500/20 rounded-xl p-3">
          <div className="text-[11px] text-white/40 uppercase font-bold mb-1">{t(lang, 'Rewards Claimed')}</div>
          <div className="text-[20px] font-bold text-emerald-400">{claimedRewards} / {adminSettings.maxReferralRewards}</div>
        </div>
      </div>
      
      <div className="bg-[#050505]/80 backdrop-blur-md border border-orange-500/20 rounded-xl p-4 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="text-[11px] text-white/40 mb-2 uppercase tracking-wider font-bold">{t(lang, 'Your Invite Code')}</div>
        <div className="font-mono text-[28px] text-orange-400 font-bold tracking-widest drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">CQGOLD777</div>
      </div>
      
      <button onClick={handleCopy} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl py-4 shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-2 mb-3">
        <Copy className="w-5 h-5" /> {t(lang, 'Copy Invite Code')}
      </button>

      <button 
        onClick={handleClaim} 
        disabled={!claimable || claimedRewards >= adminSettings.maxReferralRewards || adminSettings.referralStatus !== 'Active'}
        className={`w-full font-bold rounded-xl py-4 flex items-center justify-center gap-2 transition-all ${
          !claimable || claimedRewards >= adminSettings.maxReferralRewards || adminSettings.referralStatus !== 'Active'
            ? 'bg-[#1a1c24] text-white/30 border border-white/5 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" /> 
        {!claimable 
          ? `${t(lang, 'Need')} ${adminSettings.minReferrals - (referralsCount % adminSettings.minReferrals)} ${t(lang, 'more to claim')}` 
          : t(lang, 'Claim Reward')}
      </button>

      {/* Admin Simulator Button for Testing */}
      <button onClick={handleSimulateReferral} className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-white/50 font-bold rounded-xl py-3 text-[12px] transition-all">
        [Simulate New Referral]
      </button>
      
      <button onClick={() => setActiveTab("games")} className="mt-6 text-[13px] text-white/40 hover:text-white transition-colors">{t(lang, 'Back to Games')}</button>
    </div>
  );
}
