import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

search_controls = '<h4 className="font-bold text-[10px] tracking-widest text-white/40 mb-4 uppercase">Game & Reward Controls</h4>'

end_controls = """                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-3">
                    <div className="text-[11px] text-white/50 mb-1">Apply Changes</div>
                    <button onClick={() => alert("Settings Saved Successfully!")} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg h-[30px] text-[12px] transition-colors mt-0.5">Save</button>
                  </div>
                </div>
              </div>"""

start_idx = content.find(search_controls)
end_idx = content.find(end_controls) + len(end_controls)

if start_idx != -1 and end_idx != -1:
    new_controls = """<h4 className="font-bold text-[10px] tracking-widest text-white/40 mb-4 uppercase">Advanced Game & Reward Controls</h4>
                <div className="space-y-4">
                  {/* Wheel Admin */}
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[12px] text-white">Lucky Wheel Settings</div>
                      <input type="checkbox" defaultChecked className="accent-purple-500" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Jackpot Prob (%)</div>
                        <input type="number" defaultValue="5" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Daily Spin Limit</div>
                        <input type="number" defaultValue="10" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Cooldown (s)</div>
                        <input type="number" defaultValue="60" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Individual Prob (%)</div>
                        <input type="number" defaultValue="15" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* Slot Admin */}
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[12px] text-white">Royal Slot Settings</div>
                      <input type="checkbox" defaultChecked className="accent-yellow-500" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Min Bet</div>
                        <input type="number" defaultValue="10" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Max Bet</div>
                        <input type="number" defaultValue="1000" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Reward Multiplier</div>
                        <input type="number" defaultValue="50" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Win Prob (%)</div>
                        <input type="number" defaultValue="30" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Lose Prob (%)</div>
                        <input type="number" defaultValue="70" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Jackpot Prob (%)</div>
                        <input type="number" defaultValue="1" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* Watch Ads & General Admin */}
                  <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[12px] text-white">Ads & General Settings</div>
                      <input type="checkbox" defaultChecked className="accent-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Ad Reward</div>
                        <input type="number" defaultValue="0.5" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Max Ads / Day</div>
                        <input type="number" defaultValue="10" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Ad Cooldown (s)</div>
                        <input type="number" defaultValue="30" className="w-full bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/50 mb-1">Save</div>
                        <button onClick={() => alert("All Settings Saved Successfully!")} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg h-[30px] text-[12px] transition-colors mt-0.5">Save Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>"""
    content = content[:start_idx] + new_controls + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
