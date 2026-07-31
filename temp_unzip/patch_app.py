import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add new state variables right after setNotification
state_vars = """
  const [userName, setUserName] = useState("Alex Mercer");
  const [lastNameChange, setLastNameChange] = useState<number>(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const [profilePhoto, setProfilePhoto] = useState<string>("https://ui-avatars.com/api/?name=Alex+Mercer&background=random");
  const [lastPhotoChange, setLastPhotoChange] = useState<number>(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const [appLanguage, setAppLanguage] = useState("English");
  const [currency, setCurrency] = useState("INR");
  
  const [quizCategories, setQuizCategories] = useState([
    { id: 'gk', name: 'General Knowledge', lockedUntil: 0 },
    { id: 'science', name: 'Science', lockedUntil: 0 },
    { id: 'tech', name: 'Technology', lockedUntil: 0 },
    { id: 'sports', name: 'Sports', lockedUntil: 0 },
    { id: 'history', name: 'History', lockedUntil: 0 },
    { id: 'geo', name: 'Geography', lockedUntil: 0 },
    { id: 'movies', name: 'Movies', lockedUntil: 0 },
    { id: 'animals', name: 'Animals', lockedUntil: 0 },
    { id: 'space', name: 'Space', lockedUntil: 0 },
    { id: 'countries', name: 'Countries', lockedUntil: 0 },
    { id: 'business', name: 'Business', lockedUntil: 0 },
    { id: 'math', name: 'Mathematics', lockedUntil: 0 },
    { id: 'mixed', name: 'Mixed', lockedUntil: 0 }
  ]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [spinResult, setSpinResult] = useState<string | null>(null);
"""
content = re.sub(r'const \[isBanned, setIsBanned\] = useState\(false\);\n  const \[showNext, setShowNext\] = useState\(false\);',
                 'const [isBanned, setIsBanned] = useState(false);\n  const [showNext, setShowNext] = useState(false);\n' + state_vars, content)

# 2. Add Developer Tools & Anti Cheat detection to useEffect
anti_cheat = """
  useEffect(() => {
    const handleContextMenu = (e: any) => e.preventDefault();
    const handleKeyDown = (e: any) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
        setIsBanned(true);
        setNotification("🚨 DevTools detected! Account flagged.");
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
"""
content = re.sub(r'  useEffect\(\(\) => {\n    if \(\!document\.querySelector',
                 anti_cheat + '\n  useEffect(() => {\n    if (!document.querySelector', content)


# 3. Add Settings component import
imports = """
import SettingsTab from './SettingsTab';
import BottomNav from './BottomNav';
"""
content = re.sub(r"import React, \{ useState, useEffect, useRef \} from 'react';", 
                 "import React, { useState, useEffect, useRef } from 'react';\n" + imports, content)


# 4. Modify the "Home" tab to remove the old Profile Info, and make game cards clickable
home_tab_search = """                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 border border-blue-400/50 flex items-center justify-center shadow-inner">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[15px] text-white">Alex Mercer</span>
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">Code: <span className="text-yellow-500 font-mono font-medium">CQGOLD777</span></div>
                  </div>
                </div>"""

home_tab_replace = """                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={profilePhoto} alt="Profile" className="w-12 h-12 rounded-xl object-cover border border-yellow-500/30" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[15px] text-white">{userName}</span>
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">Balance: <span className="text-yellow-500 font-mono font-medium">{currency}</span></div>
                  </div>
                </div>"""
content = content.replace(home_tab_search, home_tab_replace)

# 5. Make wheel and slot clickable
wheel_search = """                <div className="bg-[#11141d] border border-white/5 rounded-xl p-4 cursor-not-allowed opacity-80 relative">
                  <div className="flex justify-between items-start mb-4">"""
wheel_replace = """                <div onClick={() => setActiveTab("wheel")} className="bg-[#11141d] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-purple-500/30 transition-colors relative">
                  <div className="flex justify-between items-start mb-4">"""
content = content.replace(wheel_search, wheel_replace)

slot_search = """                <div className="bg-[#11141d] border border-white/5 rounded-xl p-4 cursor-not-allowed opacity-80 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Dice5 className="w-5 h-5 text-yellow-500" />"""
slot_replace = """                <div onClick={() => setActiveTab("slot")} className="bg-[#11141d] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-yellow-500/30 transition-colors relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Dice5 className="w-5 h-5 text-yellow-500" />"""
content = content.replace(slot_search, slot_replace)

# 6. Add BottomNav at the very end
footer_search = """      <footer className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 text-center text-[11px] text-white/20 font-medium mt-4">
        © 2026 Premium Casino UI • Redesigned
      </footer>
    </div>
  );
}"""

footer_replace = """      <footer className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 pb-24 text-center text-[11px] text-white/20 font-medium mt-4">
        © 2026 Premium Casino UI • Redesigned
      </footer>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}"""
content = content.replace(footer_search, footer_replace)


with open('src/App.tsx', 'w') as f:
    f.write(content)

