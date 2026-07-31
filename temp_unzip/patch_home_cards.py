import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

watch_ads_search = """                <div className="bg-[#11141d] border border-white/5 hover:border-yellow-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tv className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="bg-[#1a1c24] border border-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      ₹0.5/Ad
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Watch Ads</h3>
                  <p className="text-[11px] text-white/40">AdMob Rewarded Video Ads</p>
                </div>"""

watch_ads_replace = """                <div onClick={() => setActiveTab("watch_ads")} className="bg-[#11141d] border border-white/5 hover:border-yellow-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tv className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="bg-[#1a1c24] border border-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      ₹0.5/Ad
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Watch Ads</h3>
                  <p className="text-[11px] text-white/40">AdMob Rewarded Video Ads</p>
                </div>"""
content = content.replace(watch_ads_search, watch_ads_replace)


daily_bonus_search = """                <div className="bg-[#11141d] border border-white/5 hover:border-teal-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="bg-[#1a1c24] border border-teal-500/20 text-teal-400 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      Day 2
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Daily Bonus</h3>
                  <p className="text-[11px] text-white/40">7-Day Streak Login Reward</p>
                </div>"""
daily_bonus_replace = """                <div onClick={() => setActiveTab("daily_bonus")} className="bg-[#11141d] border border-white/5 hover:border-teal-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="bg-[#1a1c24] border border-teal-500/20 text-teal-400 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      Day 2
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Daily Bonus</h3>
                  <p className="text-[11px] text-white/40">7-Day Streak Login Reward</p>
                </div>"""
content = content.replace(daily_bonus_search, daily_bonus_replace)


refer_search = """                <div className="bg-[#11141d] border border-white/5 hover:border-yellow-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="bg-[#1a1c24] border border-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      ₹5 Invite
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Refer & Earn</h3>
                  <p className="text-[11px] text-white/40">Invite Friends Get Bonus</p>
                </div>"""
refer_replace = """                <div onClick={() => setActiveTab("refer")} className="bg-[#11141d] border border-white/5 hover:border-yellow-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="bg-[#1a1c24] border border-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      ₹5 Invite
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Refer & Earn</h3>
                  <p className="text-[11px] text-white/40">Invite Friends Get Bonus</p>
                </div>"""
content = content.replace(refer_search, refer_replace)


# And make sure "Casino Quiz" card points to `quiz_categories` instead of `quiz`
quiz_search = """                <div onClick={() => setActiveTab("quiz")} className="bg-[#11141d] border border-yellow-500/50 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-5 h-5 text-yellow-500" />"""
quiz_replace = """                <div onClick={() => setActiveTab("quiz_categories")} className="bg-[#11141d] border border-yellow-500/50 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-5 h-5 text-yellow-500" />"""
content = content.replace(quiz_search, quiz_replace)


with open('src/App.tsx', 'w') as f:
    f.write(content)

