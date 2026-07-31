import React, { useState } from 'react';
import { User, Image, Download, Mail, LogOut, ChevronRight, CheckCircle2, ShieldCheck, Volume2, VolumeX } from 'lucide-react';

export default function SettingsTab({ 
  userName, setUserName, 
  lastNameChange, setLastNameChange,
  profilePhoto, setProfilePhoto,
  lastPhotoChange, setLastPhotoChange,
  appLanguage, setAppLanguage,
  currency, setCurrency,
  setActiveTab,
  soundEnabled, setSoundEnabled
}: any) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  
  const canChangeName = Date.now() - lastNameChange > 7 * 24 * 60 * 60 * 1000;
  const canChangePhoto = Date.now() - lastPhotoChange > 7 * 24 * 60 * 60 * 1000;

  const getTimeLeft = (lastChangeTime: number) => {
    const timeLeft = 7 * 24 * 60 * 60 * 1000 - (Date.now() - lastChangeTime);
    if (timeLeft <= 0) return null;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };


  const handleNameChange = () => {
    if (canChangeName) {
      setUserName(tempName);
      setLastNameChange(Date.now());
      setEditingName(false);
    }
  };

  const handlePhotoUpload = (e: any) => {
    if (canChangePhoto && e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setProfilePhoto(ev.target.result as string);
          setLastPhotoChange(Date.now());
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[18px] text-white">Settings</h3>
      </div>

      {/* Profile Section */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Profile</h4>
        
        <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={profilePhoto} alt="Profile" className="w-12 h-12 rounded-full border border-white/10" />
              <label className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full p-1 cursor-pointer hover:bg-amber-500 transition-colors">
                <Image className="w-3 h-3" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={!canChangePhoto} />
              </label>
            </div>
            <div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input value={tempName} onChange={e => setTempName(e.target.value)} className="bg-[#1a1c24] text-white px-2 py-1 rounded-md text-[13px] border border-white/10 outline-none w-24" />
                  <button onClick={handleNameChange} className="text-emerald-400 bg-emerald-500/10 p-1 rounded-md"><CheckCircle2 className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="font-bold text-white text-[15px]">{userName}</div>
              )}
              <div className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified User
              </div>
            </div>
          </div>
          {!editingName && (
            <button onClick={() => setEditingName(true)} disabled={!canChangeName} className={`px-3 py-1.5 rounded-lg text-[12px] font-bold ${canChangeName ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white/5 opacity-50 text-white/50 cursor-not-allowed'}`}>
              Edit
            </button>
          )}
        </div>
        {(!canChangeName || !canChangePhoto) && (
          <div className="text-[11px] text-red-400/80 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <div className="font-bold mb-1">Security & Anti-Fraud Policy</div>
            <div>Name and photo can only be changed once every 7 days.</div>
            <div className="mt-2 flex gap-4 text-red-400 font-bold">
              {!canChangeName && <span>Name Cooldown: {getTimeLeft(lastNameChange)}</span>}
              {!canChangePhoto && <span>Photo Cooldown: {getTimeLeft(lastPhotoChange)}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Preferences</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3">
            <div className="text-[11px] text-white/50 mb-1">App Language</div>
            <select value={appLanguage} onChange={e => setAppLanguage(e.target.value)} className="w-full bg-transparent text-[13px] font-bold text-white outline-none">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3">
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
        <div className="hidden">
        </div>
      </div>

      
      {/* Settings Options */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Options</h4>
        <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
            </div>
            <div>
              <div className="font-bold text-[13px] text-white">Sound Effects</div>
              <div className="text-[11px] text-white/50">Play sounds on rewards & spins</div>
            </div>
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-amber-500' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
      
      {/* App Info Section */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">App Info</h4>
        <div className="space-y-2">
          <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-[14px] text-white">Download Game</div>
              <div className="text-[11px] text-white/50 mt-0.5">Version 1.0.2 • 24 MB • Launched: July 2026</div>
            </div>
            <button className="bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5">
              <Download className="w-4 h-4" /> APK
            </button>
          </div>
          <a href="mailto:rajdeepcoc115@gmail.com" className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <div className="font-bold text-[13px] text-white">Help & Support</div>
                <div className="text-[11px] text-white/50">rajdeepcoc115@gmail.com</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </a>
          <div onClick={() => setActiveTab('faq')} className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
            <div className="font-bold text-[13px] text-white">FAQ</div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </div>
          <div onClick={() => setActiveTab('terms')} className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
            <div className="font-bold text-[13px] text-white">Terms & Conditions</div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </div>
        </div>
      </div>

      <button className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-2 mt-4">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}
