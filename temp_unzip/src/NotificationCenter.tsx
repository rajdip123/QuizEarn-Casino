import React, { useState } from 'react';
import { Bell, CheckCircle2, XCircle, Info, Gift, ChevronRight } from 'lucide-react';

export default function NotificationCenter({ notificationsList, setActiveTab }: any) {
  const [filter, setFilter] = useState('All');

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'reward': return <Gift className="w-5 h-5 text-pink-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredList = filter === 'All' ? notificationsList : notificationsList.filter((n: any) => n.type === filter);

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 shadow-xl">
      <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] mb-4">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[18px] text-white flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h3>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'success', 'reward', 'info', 'error'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-amber-600 text-white' : 'bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 text-white/50 hover:text-white'
            }`}
          >
            {f === 'success' ? 'Approved' : f === 'error' ? 'Rejected' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {filteredList.length === 0 && (
          <div className="text-center text-white/40 py-8">No notifications found.</div>
        )}
        {filteredList.map((notif: any) => (
          <div key={notif.id} className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex gap-4 items-start hover:bg-white/[0.02] transition-colors">
            <div className="mt-0.5 shrink-0">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="font-bold text-[14px] text-white/90">{notif.title}</div>
                <div className="text-[10px] text-white/30 whitespace-nowrap">{notif.date}</div>
              </div>
              <div className="text-[12px] text-white/60 leading-relaxed">{notif.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
