import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# First replace everything from {activeTab === "wheel" && ( to {activeTab === "refer" && (
# wait, daily_bonus is right before refer.
# let's just find {activeTab === "wheel" && ( ... until {activeTab === "refer" && (

start_marker = '{activeTab === "wheel" && ('
end_marker = '{activeTab === "refer" && ('

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = """{activeTab === "wheel" && (
          <LuckyWheel 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === "slot" && (
          <RoyalSlot 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
            currency={currency}
          />
        )}
        
        {activeTab === "watch_ads" && (
          <WatchAds 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === "daily_bonus" && (
          <DailyBonus 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
          />
        )}

        """
    content = content[:start_idx] + new_block + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

