import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_search = "import { QUIZ_CATEGORIES, getQuestionsForCategory } from './quizDatabase';"
imports_replace = imports_search + "\nimport LuckyWheel from './LuckyWheel';\nimport RoyalSlot from './RoyalSlot';\nimport WatchAds from './WatchAds';\nimport DailyBonus from './DailyBonus';"
content = content.replace(imports_search, imports_replace)

# Replace wheel
wheel_regex = re.compile(r'\{activeTab === "wheel" && \([\s\S]*?\)\}', re.MULTILINE)
wheel_replace = """{activeTab === "wheel" && (
          <LuckyWheel 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
          />
        )}"""
content = wheel_regex.sub(wheel_replace, content)

# Replace slot
slot_regex = re.compile(r'\{activeTab === "slot" && \([\s\S]*?\)\}', re.MULTILINE)
slot_replace = """{activeTab === "slot" && (
          <RoyalSlot 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
            currency={currency}
          />
        )}"""
content = slot_regex.sub(slot_replace, content)

# Replace watch ads
ads_regex = re.compile(r'\{activeTab === "watch_ads" && \([\s\S]*?\)\}', re.MULTILINE)
ads_replace = """{activeTab === "watch_ads" && (
          <WatchAds 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
          />
        )}"""
content = ads_regex.sub(ads_replace, content)

# Replace daily bonus
daily_regex = re.compile(r'\{activeTab === "daily_bonus" && \([\s\S]*?\)\}', re.MULTILINE)
daily_replace = """{activeTab === "daily_bonus" && (
          <DailyBonus 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification} 
            setHistory={setHistory} 
            setActiveTab={setActiveTab} 
          />
        )}"""
content = daily_regex.sub(daily_replace, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
