import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

others_tabs = """
        {activeTab === "watch_ads" && (
          <div className="bg-[#11141d] border border-blue-500/30 rounded-[20px] p-6 text-center">
            <h3 className="font-bold text-[20px] text-white mb-2">Watch Ads</h3>
            <p className="text-[12px] text-white/50 mb-8">Earn ₹0.5 for every video you watch</p>
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
              <Tv className="w-10 h-10 text-blue-400" />
            </div>
            <button onClick={() => {
              setNotification("Loading Ad...");
              setTimeout(() => {
                setBalance(b => b + 0.5);
                setHistory(h => [{ id: Date.now(), type: "earn", amount: 0.5, desc: "Watched Ad Reward", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: "Paid" }, ...h]);
                setNotification("🎉 You earned ₹0.5!");
              }, 2000);
            }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-3 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">Watch Ad Now</button>
            <button onClick={() => setActiveTab("games")} className="mt-4 text-[13px] text-white/40 hover:text-white transition-colors">Back to Games</button>
          </div>
        )}

        {activeTab === "daily_bonus" && (
          <div className="bg-[#11141d] border border-pink-500/30 rounded-[20px] p-6 text-center">
            <h3 className="font-bold text-[20px] text-white mb-2">Daily Bonus</h3>
            <p className="text-[12px] text-white/50 mb-8">Claim your free cash daily</p>
            <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-pink-400" />
            </div>
            <button onClick={() => {
              setBalance(b => b + 5);
              setHistory(h => [{ id: Date.now(), type: "earn", amount: 5, desc: "Daily Bonus", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: "Paid" }, ...h]);
              setNotification("🎉 Daily Bonus Claimed (₹5)!");
              setActiveTab("games");
            }} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl py-3 shadow-[0_0_15px_rgba(219,39,119,0.3)] transition-all">Claim ₹5 Bonus</button>
            <button onClick={() => setActiveTab("games")} className="mt-4 text-[13px] text-white/40 hover:text-white transition-colors">Back to Games</button>
          </div>
        )}

        {activeTab === "refer" && (
          <div className="bg-[#11141d] border border-orange-500/30 rounded-[20px] p-6 text-center">
            <h3 className="font-bold text-[20px] text-white mb-2">Refer & Earn</h3>
            <p className="text-[12px] text-white/50 mb-8">Invite friends and get ₹5 for each signup</p>
            <div className="bg-[#0a0c12] border border-white/10 rounded-xl p-4 mb-6">
              <div className="text-[11px] text-white/40 mb-2 uppercase tracking-wider font-bold">Your Invite Code</div>
              <div className="font-mono text-[24px] text-orange-400 font-bold tracking-widest">CQGOLD777</div>
            </div>
            <button onClick={() => {
              navigator.clipboard.writeText("CQGOLD777");
              setNotification("📋 Invite code copied!");
            }} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl py-3 shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all">Copy Code</button>
            <button onClick={() => setActiveTab("games")} className="mt-4 text-[13px] text-white/40 hover:text-white transition-colors">Back to Games</button>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="bg-[#11141d] border border-white/5 rounded-[20px] p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4 text-white hover:text-white/70 cursor-pointer" onClick={() => setActiveTab("settings")}>
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Settings
            </div>
            <h3 className="font-bold text-[18px] text-white mb-4">FAQ</h3>
            {[
              { q: "How do I withdraw money?", a: "Go to the Wallet tab, select your preferred withdrawal method, enter your details and the amount, then submit. Withdrawals are processed instantly." },
              { q: "What is the minimum withdrawal?", a: "The minimum withdrawal amount is ₹500." },
              { q: "Why is my quiz category locked?", a: "Categories lock for 24 hours after completion to prevent spam. Check back tomorrow!" },
              { q: "Is the Lucky Wheel really random?", a: "Yes, the Lucky Wheel uses a verified random number generator algorithm." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#0a0c12] border border-white/5 rounded-xl p-4">
                <div className="font-bold text-[13px] text-white mb-2">{faq.q}</div>
                <div className="text-[12px] text-white/50 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "terms" && (
          <div className="bg-[#11141d] border border-white/5 rounded-[20px] p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4 text-white hover:text-white/70 cursor-pointer" onClick={() => setActiveTab("settings")}>
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Settings
            </div>
            <h3 className="font-bold text-[18px] text-white mb-4">Terms & Conditions</h3>
            <div className="bg-[#0a0c12] border border-white/5 rounded-xl p-5 text-[12px] text-white/60 leading-relaxed max-h-[60vh] overflow-y-auto">
              <p className="mb-4">Welcome to Premium Casino UI. By using this application, you agree to the following terms and conditions:</p>
              <h4 className="font-bold text-white mb-2 mt-4">1. Account Security</h4>
              <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials. We are not liable for unauthorized access.</p>
              <h4 className="font-bold text-white mb-2 mt-4">2. Anti-Fraud Policy</h4>
              <p className="mb-4">Multiple accounts, automated scripts, and exploitation of bugs will result in immediate permanent bans and forfeiture of balances.</p>
              <h4 className="font-bold text-white mb-2 mt-4">3. Withdrawals</h4>
              <p className="mb-4">All withdrawal requests are subject to manual or automated review. We reserve the right to delay or deny payouts if suspicious activity is detected.</p>
              <p className="mb-4">Please note that modifying the app package (APK) or playing via emulators is strictly prohibited.</p>
            </div>
          </div>
        )}
"""

content = content.replace('{activeTab === "history" && (', others_tabs + '\n        {activeTab === "history" && (')

with open('src/App.tsx', 'w') as f:
    f.write(content)
