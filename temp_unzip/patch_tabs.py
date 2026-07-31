import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

tabs_to_inject = """
        {activeTab === "settings" && (
          <SettingsTab 
            userName={userName} setUserName={setUserName}
            lastNameChange={lastNameChange} setLastNameChange={setLastNameChange}
            profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto}
            lastPhotoChange={lastPhotoChange} setLastPhotoChange={setLastPhotoChange}
            appLanguage={appLanguage} setAppLanguage={setAppLanguage}
            currency={currency} setCurrency={setCurrency}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === "wheel" && (
          <div className="bg-[#11141d] border border-purple-500/30 rounded-[20px] p-6 text-center">
            <h3 className="font-bold text-[20px] text-white mb-2">Lucky Wheel</h3>
            <p className="text-[12px] text-white/50 mb-8">Spin to win up to ₹100</p>
            <div className="w-64 h-64 border-4 border-purple-500/50 rounded-full mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-black relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-yellow-500 clip-triangle z-10" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
               <span className="font-bold text-white text-[24px]">🎰</span>
            </div>
            <button onClick={() => {
              if (balance >= 5) {
                setBalance(b => b - 5);
                setTimeout(() => {
                  const win = Math.random() > 0.6 ? 10 : 0;
                  if (win > 0) {
                     setBalance(b => b + win);
                     setNotification(`🎉 You won ₹${win}!`);
                  } else {
                     setNotification(`😢 Better luck next time!`);
                  }
                }, 1500);
              } else {
                setNotification("Not enough balance! (₹5 required)");
              }
            }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl py-3 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all">Spin Now (₹5)</button>
            <button onClick={() => setActiveTab("home")} className="mt-4 text-[13px] text-white/40 hover:text-white transition-colors">Back to Home</button>
          </div>
        )}

        {activeTab === "slot" && (
          <div className="bg-[#11141d] border border-yellow-500/30 rounded-[20px] p-6 text-center">
            <h3 className="font-bold text-[20px] text-white mb-2">Royal Slots</h3>
            <p className="text-[12px] text-white/50 mb-8">Match 3 to win 50x your bet</p>
            <div className="flex justify-center gap-3 mb-8">
              {[1,2,3].map(i => (
                <div key={i} className="w-20 h-24 bg-[#0a0c12] border border-white/10 rounded-xl flex items-center justify-center text-[32px]">
                  💎
                </div>
              ))}
            </div>
            <button onClick={() => {
              if (balance >= 10) {
                setBalance(b => b - 10);
                setNotification("Rolling...");
                setTimeout(() => {
                  setNotification("😢 No match! Try again.");
                }, 1000);
              } else {
                setNotification("Not enough balance! (₹10 required)");
              }
            }} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl py-3 transition-all hover:brightness-110">Spin Slots (₹10)</button>
            <button onClick={() => setActiveTab("home")} className="mt-4 text-[13px] text-white/40 hover:text-white transition-colors">Back to Home</button>
          </div>
        )}
"""

content = content.replace('{activeTab === "history" && (', tabs_to_inject + '\n        {activeTab === "history" && (')

with open('src/App.tsx', 'w') as f:
    f.write(content)

