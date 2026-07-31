import re

with open('src/SettingsTab.tsx', 'r') as f:
    content = f.read()

# Replace variables calculation
old_calc = """  const canChangeName = Date.now() - lastNameChange > 7 * 24 * 60 * 60 * 1000;
  const canChangePhoto = Date.now() - lastPhotoChange > 7 * 24 * 60 * 60 * 1000;"""

new_calc = """  const canChangeName = Date.now() - lastNameChange > 7 * 24 * 60 * 60 * 1000;
  const canChangePhoto = Date.now() - lastPhotoChange > 7 * 24 * 60 * 60 * 1000;

  const getTimeLeft = (lastChangeTime: number) => {
    const timeLeft = 7 * 24 * 60 * 60 * 1000 - (Date.now() - lastChangeTime);
    if (timeLeft <= 0) return null;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };
"""
content = content.replace(old_calc, new_calc)

# Update countdown text
old_notice = """        {(!canChangeName || !canChangePhoto) && (
          <div className="text-[11px] text-red-400/80 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
            For security and anti-fraud policy, your name and photo can only be changed once every 7 days.
          </div>
        )}"""

new_notice = """        {(!canChangeName || !canChangePhoto) && (
          <div className="text-[11px] text-red-400/80 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <div className="font-bold mb-1">Security & Anti-Fraud Policy</div>
            <div>Name and photo can only be changed once every 7 days.</div>
            <div className="mt-2 flex gap-4 text-red-400 font-bold">
              {!canChangeName && <span>Name Cooldown: {getTimeLeft(lastNameChange)}</span>}
              {!canChangePhoto && <span>Photo Cooldown: {getTimeLeft(lastPhotoChange)}</span>}
            </div>
          </div>
        )}"""
content = content.replace(old_notice, new_notice)

# Add USDT wallet information
old_currency = """          <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
            <div className="text-[11px] text-white/50 mb-1">Preferred Currency</div>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-transparent text-[13px] font-bold text-white outline-none">
              <option value="INR">INR (₹)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="USDT">USDT ($)</option>
            </select>
          </div>"""

new_currency = """          <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
            <div className="text-[11px] text-white/50 mb-1">Preferred Currency</div>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-transparent text-[13px] font-bold text-white outline-none">
              <option value="INR">INR (₹)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="USDT">USDT ($)</option>
            </select>
          </div>
        </div>
        {currency === "USDT" && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-yellow-500/80 text-[11px]">
            <strong className="text-yellow-500 block mb-1">USDT (TRC20) Selected</strong>
            Please ensure you have configured your USDT withdrawal address in the Wallet tab. Withdrawals are processed within 24 hours.
          </div>
        )}
        <div className="hidden">"""
content = content.replace(old_currency, new_currency)
content = content.replace('        <div className="hidden">\n      </div>', '') # Cleanup

with open('src/SettingsTab.tsx', 'w') as f:
    f.write(content)
