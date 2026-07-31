import React, { useState } from 'react';
import { Wallet, Settings, TrendingUp, Download } from 'lucide-react';

export default function AdminRevenue({
  adminRevenue,
  setAdminRevenue,
  setNotification
}: any) {
  const [revPercent, setRevPercent] = useState(10);
  const [refPercent, setRefPercent] = useState(5);
  const [taxPercent, setTaxPercent] = useState(5);
  const [minWithdraw, setMinWithdraw] = useState(100);
  const [maxWithdraw, setMaxWithdraw] = useState(10000);
  const [withdrawFee, setWithdrawFee] = useState(2);
  const [dailyLimit, setDailyLimit] = useState(50000);

  const [withdrawMethod, setWithdrawMethod] = useState('UPI');

  const handleWithdraw = () => {
    if (adminRevenue < minWithdraw) {
      setNotification(`Minimum withdraw is ₹${minWithdraw}`);
      return;
    }
    setAdminRevenue(0);
    setNotification("Admin Revenue Withdrawn successfully!");
  };

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5 shadow-xl mt-4">
      <h4 className="font-bold text-[12px] tracking-widest text-white/40 mb-4 uppercase flex items-center gap-2">
        <TrendingUp className="w-4 h-4" /> Admin Revenue Wallet
      </h4>
      
      <div className="bg-gradient-to-br from-[#050505] to-[#0a0a0a] border border-emerald-500/20 rounded-xl p-6 mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="text-[11px] font-bold text-white/40 uppercase mb-2">Total Revenue Earned</div>
        <div className="text-[36px] font-bold text-emerald-400 leading-none mb-1">₹{adminRevenue.toFixed(2)}</div>
        <div className="text-[12px] text-white/50">From Quiz, Slot, Wheel, Ads, and Tax</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4">
          <div className="font-bold text-[13px] text-white mb-4">Revenue Configuration</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Global Revenue %</span>
              <input type="number" value={revPercent} onChange={e => setRevPercent(Number(e.target.value))} className="w-16 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Referral %</span>
              <input type="number" value={refPercent} onChange={e => setRefPercent(Number(e.target.value))} className="w-16 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Tax %</span>
              <input type="number" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))} className="w-16 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
          </div>
        </div>

        <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4">
          <div className="font-bold text-[13px] text-white mb-4">Withdraw Configuration</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Min Withdraw</span>
              <input type="number" value={minWithdraw} onChange={e => setMinWithdraw(Number(e.target.value))} className="w-20 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Max Withdraw</span>
              <input type="number" value={maxWithdraw} onChange={e => setMaxWithdraw(Number(e.target.value))} className="w-20 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Withdraw Fee %</span>
              <input type="number" value={withdrawFee} onChange={e => setWithdrawFee(Number(e.target.value))} className="w-16 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/60">Daily Limit</span>
              <input type="number" value={dailyLimit} onChange={e => setDailyLimit(Number(e.target.value))} className="w-24 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1 text-[12px] text-white outline-none text-right" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex flex-col gap-3">
        <div className="font-bold text-[13px] text-white">Withdraw Admin Revenue</div>
        <select value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)} className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-emerald-500/40">
          <option value="UPI">UPI</option>
          <option value="Bank">Bank Transfer</option>
          <option value="Paytm">Paytm</option>
          <option value="USDT">USDT (Crypto)</option>
          <option value="BDT Wallet">BDT Wallet</option>
        </select>
        <button onClick={handleWithdraw} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> Withdraw Revenue
        </button>
      </div>
    </div>
  );
}
