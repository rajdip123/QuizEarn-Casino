import React, { useState } from 'react';
import { Search, Download, Filter, Users, Banknote, ShieldAlert } from 'lucide-react';

export default function AdminHistory({ history, withdrawals }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Combine data for admin view
  // In a real app this would come from a backend combining users, history, withdraws, etc.
  const allLogs = [
    ...history.map((h: any) => ({ ...h, user: 'rajdeepcoc111@gmail.com', logType: h.type === 'withdraw' ? 'Withdraw' : 'Reward' })),
    ...withdrawals.map((w: any) => ({
      id: w.id + '_w',
      type: 'withdraw',
      amount: w.amount,
      desc: `Withdraw to ${w.method}`,
      time: w.date,
      status: w.status,
      user: 'rajdeepcoc111@gmail.com',
      logType: 'Withdraw'
    }))
  ].sort((a, b) => b.id - a.id);

  const filteredLogs = allLogs.filter((item: any) => {
    const matchesSearch = item.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.status.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'All') return matchesSearch;
    return matchesSearch && item.logType === filterType;
  });

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5 shadow-xl mt-4">
      <h4 className="font-bold text-[12px] tracking-widest text-white/40 mb-4 uppercase flex items-center justify-between">
        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Global Admin History</span>
        <button onClick={() => alert("Exporting CSV...")} className="bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg flex items-center gap-1.5 capitalize transition-colors">
          <Download className="w-3 h-3" /> Export
        </button>
      </h4>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Search users, transactions, status..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-lg pl-8 pr-3 py-2 text-[12px] text-white outline-none focus:border-amber-500/50" 
          />
        </div>
        <select 
          value={filterType} 
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-lg px-2 py-2 text-[12px] text-white outline-none focus:border-amber-500/50"
        >
          <option value="All">All Logs</option>
          <option value="Reward">Rewards</option>
          <option value="Withdraw">Withdrawals</option>
          <option value="Fraud">Fraud Logs</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] tracking-widest text-white/30 font-bold uppercase border-b border-white/5 sticky top-0 bg-[#0a0a0a]">
            <tr>
              <th className="py-3 font-medium">User</th>
              <th className="py-3 font-medium">Action</th>
              <th className="py-3 font-medium">Amount</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {filteredLogs.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="py-3 pr-4 font-mono text-white/60">{item.user}</td>
                <td className="py-3 pr-4">
                  <div className="font-bold text-white/90">{item.desc}</div>
                  <div className="text-[10px] text-white/40">{item.logType}</div>
                </td>
                <td className="py-3 font-bold">₹{Number(item.amount).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Paid' || item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {item.status || 'Success'}
                  </span>
                </td>
                <td className="py-3 text-white/40 whitespace-nowrap">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
