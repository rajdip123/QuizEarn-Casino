import React, { useState } from 'react';
import { CheckCircle2, XCircle, Upload, Banknote, ShieldAlert } from 'lucide-react';

export default function AdminWithdraw({
  withdrawals,
  setWithdrawals,
  setHistory,
  setNotification,
  setNotificationsList
}: any) {
  
  const handleApprove = (id: number) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            updateWithdrawStatus(id, 'Approved', ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleReject = (id: number) => {
    updateWithdrawStatus(id, 'Rejected', null);
  };

  const updateWithdrawStatus = (id: number, status: string, screenshot: string | null) => {
    let updatedW: any = null;
    setWithdrawals((prev: any[]) => prev.map(w => {
      if (w.id === id) {
        updatedW = { ...w, status, screenshot, txId: `TXN${Math.floor(Math.random()*1000000)}` };
        return updatedW;
      }
      return w;
    }));

    if (updatedW) {
      // Update User History
      setHistory((prev: any[]) => prev.map(h => {
        if (h.type === "withdraw" && h.amount === updatedW.amount && h.status === "Pending") {
          return { ...h, status };
        }
        return h;
      }));
      
      // Notify user
      setNotificationsList((prev: any) => [{
        id: Date.now(),
        title: `Withdraw ${status}`,
        message: `Your withdraw request of ${updatedW.currency === 'USDT' ? '$' : '₹'}${updatedW.amount} was ${status.toLowerCase()}.`,
        type: status === 'Approved' ? 'success' : 'error',
        date: new Date().toLocaleString()
      }, ...prev]);

      setNotification(`Withdraw ${status} successfully.`);
    }
  };

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5 shadow-xl mt-4">
      <h4 className="font-bold text-[12px] tracking-widest text-white/40 mb-4 uppercase flex items-center gap-2">
        <Banknote className="w-4 h-4" /> Pending Withdrawals
      </h4>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {withdrawals.filter((w: any) => w.status === 'Pending').length === 0 && (
          <div className="text-center text-white/40 py-4 text-[12px]">No pending requests</div>
        )}
        {withdrawals.filter((w: any) => w.status === 'Pending').map((item: any) => (
          <div key={item.id} className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 relative">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-[10px] text-white/40 mb-1 uppercase">Amount</div>
                <div className="font-bold text-white">{item.currency === 'USDT' ? '$' : '₹'}{item.amount}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 mb-1 uppercase">Final</div>
                <div className="font-bold text-emerald-400">{item.currency === 'USDT' ? '$' : '₹'}{item.finalAmount}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 mb-1 uppercase">Method</div>
                <div className="text-[13px] text-white/90">{item.method}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 mb-1 uppercase">Receiver</div>
                <div className="text-[13px] text-white/90">{item.receiverName}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] text-white/40 mb-1 uppercase">Account / Address</div>
                <div className="text-[13px] text-white/90 font-mono bg-white/5 p-2 rounded-lg">{item.accountDetails}</div>
              </div>
              {item.notes && (
                <div className="col-span-2">
                  <div className="text-[10px] text-white/40 mb-1 uppercase">Notes</div>
                  <div className="text-[12px] text-white/70">{item.notes}</div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleApprove(item.id)} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold rounded-lg py-2 flex items-center justify-center gap-1 text-[12px] transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Approve & Upload
              </button>
              <button onClick={() => handleReject(item.id)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold rounded-lg py-2 flex items-center justify-center gap-1 text-[12px] transition-colors">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
