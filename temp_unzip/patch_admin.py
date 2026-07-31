import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

admin_add = """
              <div className="bg-[#11141d] border border-white/5 rounded-xl p-5 md:col-span-3">
                <h4 className="font-bold text-[10px] tracking-widest text-white/40 mb-4 uppercase">Game & Reward Controls</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Quiz Reward / Q</div>
                    <input type="number" defaultValue="10" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Quiz Lock (Hours)</div>
                    <input type="number" defaultValue="24" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Wheel Jackpot %</div>
                    <input type="number" defaultValue="5" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Slot Win %</div>
                    <input type="number" defaultValue="30" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Ad Reward</div>
                    <input type="number" defaultValue="0.5" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Daily Bonus</div>
                    <input type="number" defaultValue="5" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Refer Reward</div>
                    <input type="number" defaultValue="5" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Apply Changes</div>
                    <button onClick={() => alert("Settings Saved Successfully!")} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg h-[30px] text-[12px] transition-colors mt-0.5">Save</button>
                  </div>
                </div>
              </div>
"""

search_term = '              <div className="bg-[#11141d] border border-white/5 rounded-xl p-5 md:col-span-2">'
content = content.replace(search_term, admin_add + '\n' + search_term)

with open('src/App.tsx', 'w') as f:
    f.write(content)

