import React, { useState } from 'react';
import { ChevronRight, Upload, AlertCircle, Info, Banknote, ShieldCheck, Clock } from 'lucide-react';

export default function PremiumWithdraw({
  balance,
  setBalance,
  setNotification,
  setWithdrawals,
  setHistory,
  setActiveTab,
  currency
}: any) {
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [notes, setNotes] = useState('');

  const getMethods = () => {
    if (currency === 'USDT') return ['TRC20', 'BEP20', 'ERC20'];
    if (currency === 'BDT') return ['bKash', 'Nagad', 'Rocket', 'Bank Transfer'];
    return ['UPI', 'Bank Transfer', 'Paytm'];
  };

  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };

  const minWithdraw = currency === 'USDT' ? 5 : (currency === 'BDT' ? 500 : 100);
  const maxWithdraw = currency === 'USDT' ? 1000 : (currency === 'BDT' ? 50000 : 10000);
  const withdrawFee = 2; // 2%
  const tax = 5; // 5%

  const numAmount = Number(amount) || 0;
  const feeAmount = (numAmount * withdrawFee) / 100;
  const taxAmount = (numAmount * tax) / 100;
  const finalAmount = numAmount - feeAmount - taxAmount;

  const handleWithdraw = () => {
    if (numAmount < minWithdraw) {
      setNotification(`Minimum withdraw is ${getCurrencySymbol()}${minWithdraw}`);
      return;
    }
    if (numAmount > maxWithdraw) {
      setNotification(`Maximum withdraw is ${getCurrencySymbol()}${maxWithdraw}`);
      return;
    }
    if (numAmount > balance) {
      setNotification("Insufficient balance!");
      return;
    }
    if (!method || !receiverName || !accountDetails) {
      setNotification("Please fill all required fields");
      return;
    }

    setBalance((b: number) => b - numAmount);
    
    const wRequest = {
      id: Date.now(),
      amount: numAmount,
      finalAmount: finalAmount,
      currency: currency,
      method: method,
      receiverName: receiverName,
      accountDetails: accountDetails,
      notes: notes,
      status: 'Pending',
      date: new Date().toLocaleString(),
      screenshot: null,
      txId: null
    };

    setWithdrawals((prev: any) => [wRequest, ...prev]);
    
    setHistory((prev: any) => [{
      id: Date.now(),
      type: "withdraw",
      amount: numAmount,
      desc: `Withdraw to ${method}`,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: "Pending"
    }, ...prev]);

    setNotification("Withdraw request submitted successfully!");
    setAmount('');
    setReceiverName('');
    setAccountDetails('');
    setNotes('');
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] mb-4">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </button>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[18px] text-white flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-400" /> Withdraw Funds
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secure
          </span>
        </div>

        <div className="bg-gradient-to-br from-[#050505] to-[#0a0a0a] rounded-xl p-5 border border-white/5 mb-5 shadow-inner">
          <div className="text-[10px] tracking-widest text-white/40 font-bold mb-1 uppercase">Available Balance</div>
          <div className="text-[32px] font-bold text-white leading-none">
            {getCurrencySymbol()}{balance.toFixed(2)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-white/50 font-bold tracking-wider uppercase mb-1.5 block">Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full h-12 bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-4 text-[14px] font-medium text-white outline-none focus:border-emerald-500/40">
              <option value="">Select Method</option>
              {getMethods().map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-white/50 font-bold tracking-wider uppercase mb-1.5 block">Amount</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder={`Min ${getCurrencySymbol()}${minWithdraw} - Max ${getCurrencySymbol()}${maxWithdraw}`} className="w-full h-12 bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-4 text-[14px] font-medium text-white outline-none focus:border-emerald-500/40 placeholder:text-white/20 transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-white/50 font-bold tracking-wider uppercase mb-1.5 block">Receiver Name</label>
            <input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="Full Name on Account" className="w-full h-12 bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-4 text-[14px] font-medium text-white outline-none focus:border-emerald-500/40 placeholder:text-white/20 transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-white/50 font-bold tracking-wider uppercase mb-1.5 block">Account Number / Wallet Address</label>
            <input value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} placeholder="Enter details carefully" className="w-full h-12 bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-4 text-[14px] font-medium text-white outline-none focus:border-emerald-500/40 placeholder:text-white/20 transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-white/50 font-bold tracking-wider uppercase mb-1.5 block">Notes (Optional)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any extra info" className="w-full h-12 bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-4 text-[14px] font-medium text-white outline-none focus:border-emerald-500/40 placeholder:text-white/20 transition-colors" />
          </div>

          {numAmount > 0 && (
            <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 text-[12px] space-y-2">
              <div className="flex justify-between text-white/70">
                <span>Requested Amount</span>
                <span>{getCurrencySymbol()}{numAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Withdraw Fee ({withdrawFee}%)</span>
                <span className="text-red-400">-{getCurrencySymbol()}{feeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Tax ({tax}%)</span>
                <span className="text-red-400">-{getCurrencySymbol()}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-white/10 my-2"></div>
              <div className="flex justify-between font-bold text-white text-[14px]">
                <span>Final Receive Amount</span>
                <span className="text-emerald-400">{getCurrencySymbol()}{(finalAmount > 0 ? finalAmount : 0).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button onClick={handleWithdraw} className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold rounded-xl text-[14px] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">Submit Request</button>
          
          <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
            <Clock className="w-3 h-3" /> Processing Time: 3 - 10 Minutes
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 shadow-xl">
        <h3 className="font-bold text-[16px] mb-5 text-white">Withdraw Rules</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="text-[12px] text-white/70 leading-relaxed">
              Please double check your account details. Incorrect details may lead to permanent loss of funds.
            </div>
          </div>
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
            <div className="text-[12px] text-white/70 leading-relaxed">
              Multiple accounts or fraud activity will result in permanent ban and confiscation of balance.
            </div>
          </div>
        </div>
        
        <h3 className="font-bold text-[16px] mb-5 text-white">Limits</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 uppercase mb-1">Min Withdraw</div>
            <div className="font-bold text-white">{getCurrencySymbol()}{minWithdraw}</div>
          </div>
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 uppercase mb-1">Max Withdraw</div>
            <div className="font-bold text-white">{getCurrencySymbol()}{maxWithdraw}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
