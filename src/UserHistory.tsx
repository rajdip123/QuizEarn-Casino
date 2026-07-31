import React, { useState } from 'react';
import { ChevronRight, Search, Filter } from 'lucide-react';
import { t } from './i18n';

export default function UserHistory({ history, setActiveTab, currency, lang, rate }: any) {
    const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredHistory = history.filter((item: any) => {
    const matchesSearch = (item.desc || item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.amount.toString().includes(searchTerm) || 
                          (item.status && item.status.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'All') return matchesSearch;
    if (filterType === 'Earn') return matchesSearch && item.type === 'earn';
    if (filterType === 'Withdraw') return matchesSearch && item.type === 'withdraw';
    
    return matchesSearch;
  });

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 shadow-xl">
      <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] mb-4">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back
      </button>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[18px] text-white">Transaction History</h3>
        <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">All Records</span>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white outline-none focus:border-amber-500/50" 
          />
        </div>
        <select 
          value={filterType} 
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-amber-500/50 appearance-none"
        >
          <option value="All">All Types</option>
          <option value="Earn">Earnings</option>
          <option value="Withdraw">Withdrawals</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] tracking-widest text-white/30 font-bold uppercase border-b border-white/5">
            <tr>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Detail</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/40">No records found.</td>
              </tr>
            )}
            {filteredHistory.map((item: any) => (
              <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="py-4">
                  <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase ${item.type === "earn" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : item.type === "loss" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <div className="font-bold text-white/90 mb-0.5">{item.desc}</div>
                  <div className="text-[11px] text-white/40">{item.time}</div>
                </td>
                <td className="py-4 font-bold whitespace-nowrap">
                  <span className={item.type === 'earn' ? 'text-emerald-400' : item.type === 'loss' ? 'text-red-400' : 'text-white'}>
                    {item.type === 'earn' ? '+' : item.type === 'loss' ? '-' : ''}{getCurrencySymbol()}{(item.amount * (rate||1)).toFixed(2)}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                    item.status === 'Paid' || item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 
                    item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {item.status || 'Success'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
