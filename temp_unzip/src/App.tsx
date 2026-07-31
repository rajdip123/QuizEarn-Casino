import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from './LoadingScreen';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { AdBanner, AdNative, AdAppOpen } from './AdsPlaceholder';
import PremiumWithdraw from './PremiumWithdraw';
import AdminWithdraw from './AdminWithdraw';
import AdminRevenue from './AdminRevenue';
import UserHistory from './UserHistory';
import NotificationCenter from './NotificationCenter';
import AdminHistory from './AdminHistory';
import { checkFraud, simulateFraudDetection, clearFraudDetection } from './AntiCheat';
import { QUIZ_CATEGORIES, getQuestionsForCategory } from './quizDatabase';
import LuckyWheel from './LuckyWheel';
import RoyalSlot from './RoyalSlot';
import WatchAds from './WatchAds';
import DailyBonus from './DailyBonus';

import GamesTab from "./GamesTab";
import SettingsTab from './SettingsTab';
import BottomNav from './BottomNav';

import {
  CheckCircle2, Coins, Crown, EyeOff, Eye, History, Mail,
  Settings, Shield, Timer, AlertTriangle, Trophy, Wallet, X, Zap,
  Play, Gift, UserPlus, CreditCard, ChevronRight, Activity, Flame,
  Gamepad2, CircleDollarSign, Bell, User, ArrowUpRight, Bot, Clock,
  ShieldCheck, Sparkles, Brain, Target, Dice5, Calendar, Tv, Users
} from 'lucide-react';

const Pt = [
  "🔥 Rahul just withdrew ₹500 via UPI",
  "💸 Priya withdrew ₹1200 via PayTM • 2m ago",
  "🚀 Aman withdrew ₹750 via UPI • 5m ago",
  "💰 Sneha withdrew ₹2000 via Bank Transfer",
  "⚡ Vikram withdrew ₹350 via UPI • now",
  "🎉 Ankit withdrew ₹1000 via UPI • 1m ago"
];

let Nt = [
  { q: "What is the capital of India?", opts: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], ans: 1, reward: 12 },
  { q: "Which planet is known as Red Planet?", opts: ["Venus", "Jupiter", "Mars", "Saturn"], ans: 2, reward: 10 },
  { q: "Who invented the Bulb?", opts: ["Edison", "Newton", "Einstein", "Tesla"], ans: 0, reward: 15 },
  { q: "IPL team with most titles?", opts: ["CSK", "MI", "RCB", "KKR"], ans: 1, reward: 10 },
  { q: "Largest ocean on Earth?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3, reward: 12 },
  { q: "2+2*2 = ?", opts: ["6", "8", "4", "2"], ans: 0, reward: 8 },
  { q: "Currency of Japan?", opts: ["Yuan", "Yen", "Won", "Ringgit"], ans: 1, reward: 10 },
  { q: "Fastest land animal?", opts: ["Lion", "Cheetah", "Tiger", "Horse"], ans: 1, reward: 10 },
  { q: "How many states in India?", opts: ["28", "29", "30", "27"], ans: 0, reward: 12 },
  { q: "Father of Computer?", opts: ["Charles Babbage", "Bill Gates", "Steve Jobs", "Tim Berners"], ans: 0, reward: 15 }
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  
  const [balance, setBalance] = useState(41.50);
  const [activeTab, setActiveTab] = useState("home"); 
  
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(3);
  const [feedback, setFeedback] = useState("");
  
  const [marqueeIdx, setMarqueeIdx] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showPayoutToast, setShowPayoutToast] = useState(true);
  
  const [history, setHistory] = useState([
    { id: 1, type: "earn", amount: 0.10, desc: "Quiz Reward (General Knowledge)", time: "12:02", status: "Paid" },
    { id: 2, type: "earn", amount: 0.20, desc: "Quiz Reward (National Flags)", time: "12:02", status: "Paid" },
    { id: 3, type: "earn", amount: 0.20, desc: "Quiz Reward (General Knowledge)", time: "11:45", status: "Paid" }
  ]);
  
  const [withdrawals, setWithdrawals] = useState([
    { id: 101, type: "withdraw", amount: 800, desc: "Rahul - rahul@upi", time: "2m ago", status: "Pending" },
    { id: 102, type: "withdraw", amount: 350, desc: "Aman - aman@paytm", time: "5m ago", status: "Pending" }
  ]);
  
  const [notification, setNotification] = useState("");
  const [notificationsList, setNotificationsList] = useState([]);
  const [adminRevenue, setAdminRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAppOpenAd, setShowAppOpenAd] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { width, height } = useWindowSize();
  const [isBanned, setIsBanned] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [userName, setUserName] = useState("Alex Mercer");
  const [lastNameChange, setLastNameChange] = useState<number>(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const [profilePhoto, setProfilePhoto] = useState<string>("https://ui-avatars.com/api/?name=Alex+Mercer&background=random");
  const [lastPhotoChange, setLastPhotoChange] = useState<number>(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const [appLanguage, setAppLanguage] = useState("English");
  const [currency, setCurrency] = useState("INR");
  
  const [quizCategories, setQuizCategories] = useState(
    QUIZ_CATEGORIES.map(c => ({ ...c, lockedUntil: 0 }))
  );
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  
  const clicks = useRef<number[]>([]);
  const timerRef = useRef<any>(null);
  const adminTimeoutRef = useRef<any>(null);


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

  useEffect(() => {
    if (!document.querySelector('meta[name="monetag"]')) {
      let M = document.createElement("meta");
      M.name = "monetag";
      M.content = "95adcbff7d0c8d965c328745ae1829ec";
      document.head.appendChild(M);
    }
    let k = setInterval(() => setMarqueeIdx((M) => (M + 1) % Pt.length), 3000);
    return () => clearInterval(k);
  }, []);

  useEffect(() => {
    if (activeTab !== "quiz" || isAnswered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((k) => {
        if (k <= 1) {
          handleNext();
          return 30;
        }
        return k - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, activeTab, isAnswered]);

  const handleAdminClick = () => {
    let k = adminClickCount + 1;
    setAdminClickCount(k);
    clearTimeout(adminTimeoutRef.current);
    adminTimeoutRef.current = setTimeout(() => setAdminClickCount(0), 2000);
    if (k >= 7) {
      setShowAdminLogin(true);
      setAdminClickCount(0);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === "Rajdeep123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setActiveTab("admin");
      setNotification("");
    } else {
      setNotification("Wrong password! Access denied");
      setTimeout(() => setNotification(""), 2500);
    }
  };

  const handleAnswer = (k: number) => {
    if (isBanned || isAnswered) return;
    let M = Date.now();
    clicks.current = [...clicks.current.filter((Fe) => M - Fe < 1500), M];
    let Te = clicks.current.length;
    if (Te > 25) {
      setIsBanned(true);
      setBalance(0);
      setNotification("🚨 CHEATING DETECTED! Account Banned - Balance Reset to ₹0");
      return;
    }
    if (Te > 20) {
      setNotification("⚠️ Warning: Stop rapid clicking! Next violation = BAN");
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    if (Te > 5) return;
    if (selectedAns !== null) return;
    
    setSelectedAns(k);
    setIsAnswered(true);
    setShowNext(true);
    clearInterval(timerRef.current);
    
    let nn = Nt[currentQ];
    if (k === nn.ans) {
      let Fe = nn.reward;
      setBalance((Nn) => Nn + Fe);
      setScore((Nn) => Nn + 1);
      setStreak((Nn) => Nn + 1);
      setFeedback(`+ ₹${Fe} Added! 🔥`);
      setHistory((Nn) => [{ id: Date.now(), type: "earn", amount: Fe, desc: `Quiz Reward (Q${currentQ + 1})`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: "Paid" }, ...Nn]);
    } else {
      setStreak(0);
      setFeedback(`Wrong! Answer: ${nn.opts[nn.ans]}`);
    }
  };

  const handleNext = () => {
    if (currentQ >= Nt.length - 1) {
      if (activeCategory) {
        setQuizCategories(cats => cats.map(c => c.id === activeCategory ? { ...c, lockedUntil: Date.now() + 24 * 60 * 60 * 1000 } : c));
        setActiveTab("quiz_categories");
        setNotification(`🎉 Completed ${quizCategories.find(c => c.id === activeCategory)?.name}! Locked for 24h.`);
      }
      setCurrentQ(0);
    } else {
      setCurrentQ((k) => k + 1);
    }
    setSelectedAns(null);
    setIsAnswered(false);
    setShowNext(false);
    setFeedback("");
    setTimeLeft(30);
  };

  const handleWithdraw = () => {
    let k = Number(withdrawAmount);
    if (!upiId || k < 100) {
      setNotification("Min ₹100 & valid UPI required");
      setTimeout(() => setNotification(""), 2500);
      return;
    }
    if (k > balance) {
      setNotification("Insufficient balance");
      setTimeout(() => setNotification(""), 2500);
      return;
    }
    setBalance((M) => M - k);
    setHistory((M) => [{ id: Date.now(), type: "withdraw", amount: k, desc: `Withdraw to ${upiId}`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: "Pending" }, ...M]);
    setWithdrawAmount("");
    setUpiId("");
    setNotification("✅ Withdraw request submitted!");
    setTimeout(() => setNotification(""), 3000);
  };

  const currentQuiz = Nt[currentQ];
  const earnedToday = history.filter((k) => k.type === "earn").reduce((k, M) => k + M.amount, 0);
  const totalWithdrawn = history.filter((k) => k.type === "withdraw").reduce((k, M) => k + M.amount, 0);

  const triggerWin = (amount) => {
    setBalance(b => b + amount);
    if (soundEnabled) {
      // Play sound logic here (mock)
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => { setIsLoading(false); setShowAppOpenAd(true); }} />;
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#FBBF24', '#F59E0B', '#D97706', '#ffffff']} />}
      {showAppOpenAd && (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
          <AdAppOpen />
          <button 
            onClick={() => setShowAppOpenAd(false)} 
            className="mt-6 text-[12px] text-white/50 uppercase tracking-widest font-bold hover:text-white transition-colors"
          >
            Continue to App &rarr;
          </button>
        </div>
      )}
      <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f] px-4 py-3 flex items-center justify-between">
        {/* Left: Profile Icon */}
        <div className="relative w-10 h-10 rounded-full bg-blue-600 border border-yellow-500 overflow-hidden flex items-center justify-center cursor-pointer" onClick={handleAdminClick}>
          <User className="text-white w-6 h-6" />
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5">
            <Crown className="w-2.5 h-2.5 text-black" />
          </div>
        </div>
        
        {/* Middle: Wallet Pill */}
        <button onClick={() => setActiveTab("wallet")} className="flex items-center gap-2 bg-[#1a1c24] border border-yellow-500/30 rounded-full pr-4 pl-1 py-1">
          <div className="bg-yellow-500 w-7 h-7 rounded-full flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5 text-black" />
          </div>
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="text-[8px] text-yellow-500 font-bold uppercase tracking-wider">Wallet</span>
            <span className="text-[12px] font-bold text-white">₹{balance.toFixed(2)}</span>
          </div>
        </button>
        
        {/* Right: Notifications & Admin */}
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab("notifications")} className="w-9 h-9 rounded-full bg-[#1a1c24] flex items-center justify-center relative hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-white/70" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={() => setShowAdminLogin(true)} className="flex items-center gap-1.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors">
            <Shield className="w-3.5 h-3.5" /> Admin
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4">
        <div className="mb-4"><AdBanner /></div>
        {notification && (
          <div className="mb-4 bg-yellow-500 text-black text-[13px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {notification}
          </div>
        )}
        {isBanned && (
          <div className="mb-4 bg-red-500 text-white px-4 py-3 rounded-xl font-bold text-center">
            ACCOUNT BANNED - Contact Admin. Balance set to ₹0
          </div>
        )}

        {/* Home / Dashboard UI */}
        {activeTab === "home" && (
          <div className="space-y-6">
            
            {/* Main Wallet Card */}
            <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-[20px] p-5 shadow-[0_0_20px_rgba(255,215,0,0.02)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                {/* Profile Info */}
                <div className="flex items-center gap-3">
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
                </div>
                
                {/* Balance */}
                <div className="text-right">
                  <div className="text-[9px] text-yellow-500/80 font-bold tracking-widest mb-1">AVAILABLE BALANCE</div>
                  <div className="text-[26px] font-bold text-yellow-500 leading-none">₹{balance.toFixed(2)}</div>
                </div>
              </div>
              
              {/* Earnings Row */}
              <div className="flex bg-[#050505] rounded-xl p-3 mb-5 border border-white/5 relative z-10">
                <div className="flex-1">
                  <div className="text-[9px] text-white/40 font-bold tracking-widest mb-1 uppercase">Today's Earnings</div>
                  <div className="text-[14px] font-bold text-emerald-400">+₹{earnedToday.toFixed(2)}</div>
                </div>
                <div className="w-px bg-white/10 mx-3"></div>
                <div className="flex-1">
                  <div className="text-[9px] text-white/40 font-bold tracking-widest mb-1 uppercase">Total Lifetime Earnings</div>
                  <div className="text-[14px] font-bold text-yellow-500">₹{(earnedToday + totalWithdrawn + balance).toFixed(2)}</div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mb-5 relative z-10">
                <div className="flex justify-between text-[11px] font-medium font-mono mb-2">
                  <span className="text-white/50">Withdrawal Threshold Goal</span>
                  <span className="text-yellow-500">{(balance / 100 * 100).toFixed(0)}% (₹{balance.toFixed(2)} / ₹100.00)</span>
                </div>
                <div className="h-1.5 bg-[#1a1c24] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full" style={{width: `${Math.min(balance / 100 * 100, 100)}%`}}></div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 relative z-10">
                <button onClick={() => setActiveTab("wallet")} className="flex-1 flex items-center justify-center gap-2 border border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-500 font-bold rounded-xl py-3 text-[13px] transition-colors">
                  <Wallet className="w-4 h-4" /> Wallet Dashboard
                </button>
                <button onClick={() => setActiveTab("wallet")} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl py-3 text-[13px] hover:brightness-110 transition-all">
                  Withdraw Funds <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Payout Toast */}
            {showPayoutToast && (
              <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-xl p-3 flex items-start gap-3 relative animate-[fade-in_0.5s_ease-out]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-1.5 text-[13px] mb-0.5">
                    <span className="font-bold text-white truncate">Nicholas Soh</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-yellow-500 text-[11px] font-mono bg-yellow-500/10 px-1.5 py-0.5 rounded">(CQ868628)</span>
                  </div>
                  <div className="text-[12px] text-white/80 mb-1.5 truncate">
                    {Pt[marqueeIdx]}
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> 25 mins ago</span>
                    <span className="text-white/20">•</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold"><ShieldCheck className="w-3 h-3" /> Live Payout</span>
                  </div>
                </div>
                <button onClick={() => setShowPayoutToast(false)} className="text-white/30 hover:text-white/70 absolute top-3 right-3 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Play & Earn Rewards */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h2 className="text-[12px] font-bold text-yellow-500 tracking-wider">PLAY & EARN REWARDS</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Casino Quiz Card */}
                <div onClick={() => setActiveTab("quiz_categories")} className="bg-[#0a0a0a] border border-yellow-500/50 rounded-xl p-4 cursor-pointer hover:bg-[#1a1c24] transition-colors relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="bg-[#1a1c24] border border-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      ₹0.10 / Q
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Casino Quiz</h3>
                  <p className="text-[11px] text-white/40">10,000+ Questions • 11 Topics</p>
                </div>
                
                {/* Lucky Wheel Card */}
                <div onClick={() => setActiveTab("wheel")} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-4 cursor-pointer hover:border-amber-500/30 transition-colors relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="bg-[#1a1c24] border border-amber-500/20 text-purple-300 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      Jackpot ₹50
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Lucky Wheel</h3>
                  <p className="text-[11px] text-white/40">Spin & Win Instant Cash</p>
                </div>

                {/* Royal Slots */}
                <div onClick={() => setActiveTab("wheel")} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-4 cursor-pointer hover:border-amber-500/30 transition-colors relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Dice5 className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="bg-[#1a1c24] border border-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-1.5 rounded-full">
                      50x Bet
                    </div>
                  </div>
                  <h3 className="font-bold text-[14px] text-white mb-1">Royal Slots</h3>
                  <p className="text-[11px] text-white/40">3-Reel Vegas Slot Machine</p>
                </div>

                {/* Daily Bonus */}
                <div onClick={() => setActiveTab("daily_bonus")} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl hover:border-teal-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
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
                </div>

                {/* Watch Ads */}
                <div onClick={() => setActiveTab("watch_ads")} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl hover:border-yellow-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
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
                </div>

                {/* Refer & Earn */}
                <div onClick={() => setActiveTab("refer")} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl hover:border-yellow-500/30 transition-colors rounded-xl p-4 cursor-pointer relative group">
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
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-yellow-500" />
                  <h2 className="text-[12px] font-bold text-yellow-500 tracking-wider">RECENT ACTIVITY</h2>
                </div>
                <button onClick={() => setActiveTab("history")} className="text-[11px] text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="space-y-4">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-white/5 last:border-0 pb-4 last:pb-0">
                    <div>
                      <div className="text-[13px] font-bold text-white/90">{item.desc}</div>
                      <div className="text-[11px] text-white/40 mt-1">{item.time}</div>
                    </div>
                    <div className={`font-bold text-[14px] ${item.type === "earn" ? "text-emerald-400" : "text-yellow-500"}`}>
                      {item.type === "earn" ? "+" : ""}₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Other Tabs (Quiz, Wallet, History, Admin etc) */}
                {activeTab === "quiz_categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[18px] text-white">Quiz Categories</h3>
              <button onClick={() => setShowAllCategories(!showAllCategories)} className="text-[12px] text-amber-400 hover:text-purple-300 font-bold">
                {showAllCategories ? "Show Less" : "View All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quizCategories.slice(0, showAllCategories ? quizCategories.length : 8).map(cat => {
                const isLocked = Date.now() < cat.lockedUntil;
                const timeLeft = Math.max(0, cat.lockedUntil - Date.now());
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minsLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

                return (
                  <div key={cat.id} 
                    onClick={() => {
                      if (!isLocked) {
                        setActiveCategory(cat.id);
                        // Fetch 10 questions from the DB (shuffled, progressive difficulty)
                        Nt = getQuestionsForCategory(cat.id, 10);
                        setCurrentQ(0);
                        setScore(0);
                        setStreak(0);
                        setActiveTab('quiz');
                      }
                    }}
                    className={`bg-[#0a0a0a] border ${isLocked ? 'border-red-500/20 opacity-70' : 'border-white/5 hover:border-yellow-500/30'} rounded-xl p-4 cursor-pointer relative group transition-colors`}
                  >
                    <div className="font-bold text-white text-[15px] mb-1">{cat.name}</div>
                    {isLocked ? (
                      <div className="text-[11px] text-red-400 flex items-center gap-1">
                        Locked (Completed) - {hoursLeft}h {minsLeft}m
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400">10 Questions Available</div>
                    )}
                  </div>
                )
              })}
            </div>
            <button onClick={() => setActiveTab("games")} className="mt-4 flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors">
              Back to Games
            </button>
          </div>
        )}
        {activeTab === "quiz" && (
          <div className="space-y-4">
            <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] mb-4">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
            </button>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <div className="text-[9px] text-white/40 font-bold tracking-wider">STREAK</div>
                  <div className="font-bold text-[16px] leading-none mt-1 text-white">{streak}🔥</div>
                </div>
              </div>
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <div className="text-[9px] text-white/40 font-bold tracking-wider">TIMER</div>
                  <div className={`font-bold text-[16px] leading-none mt-1 font-mono ${timeLeft < 10 ? "text-red-400" : "text-white"}`}>{timeLeft}s</div>
                </div>
              </div>
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <div className="text-[9px] text-white/40 font-bold tracking-wider">SCORE</div>
                  <div className="font-bold text-[16px] leading-none mt-1 text-white">{score}/{Nt.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-yellow-500/20 rounded-[20px] p-5 relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.02)]">
              
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1a1c24] border border-white/10 text-[11px] font-mono px-2.5 py-1 rounded-full text-white/70">Q {currentQ + 1} / {Nt.length}</span>
                  <span className="bg-yellow-500/10 text-yellow-500 text-[11px] font-bold px-2.5 py-1 rounded-full border border-yellow-500/20">₹{currentQuiz.reward.toFixed(2)}</span>
                </div>
                <div className="text-[9px] text-white/30 font-bold tracking-widest uppercase">Premium Quiz Mode</div>
              </div>

              <h2 className="text-[18px] md:text-[22px] font-bold leading-[1.3] text-white mb-6">{currentQuiz.q}</h2>

              <div className="grid gap-3">
                {currentQuiz.opts.map((opt, idx) => {
                  let isCorrect = currentQuiz.ans === idx;
                  let isSelected = selectedAns === idx;
                  let btnClass = "bg-[#050505] border-white/5 hover:border-yellow-500/30 hover:bg-[#1a1c24]";
                  
                  if (isAnswered) {
                    if (isCorrect) btnClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                    else if (isSelected) btnClass = "bg-red-500/10 border-red-500/30 text-red-400";
                    else btnClass = "bg-[#050505] border-white/5 opacity-50";
                  } else if (isSelected) {
                    btnClass = "bg-yellow-500/10 border-yellow-500/40 text-yellow-500";
                  }

                  return (
                    <button key={idx} onClick={() => handleAnswer(idx)} disabled={isAnswered} className={`text-left w-full p-4 rounded-xl border transition-all flex items-center justify-between group ${btnClass}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold border ${isAnswered && isCorrect ? "bg-emerald-500 text-black border-emerald-500" : isAnswered && isSelected ? "bg-red-500 text-white border-red-500" : "bg-[#1a1c24] border-white/10 group-hover:border-yellow-500/30 text-white/70"}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="font-bold text-[14px]">{opt}</span>
                      </div>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-[13px] font-bold">
                  {feedback ? (
                    <span className={`px-3 py-1.5 rounded-full text-[12px] ${feedback.includes("+") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-white/50"}`}>{feedback}</span>
                  ) : (
                    <span className="text-white/30 text-[12px] font-normal flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Fair Play Active</span>
                  )}
                </div>
                {showNext && (
                  <button onClick={handleNext} className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold px-6 h-10 rounded-full text-[13px] flex items-center gap-2 hover:brightness-110 transition-all">
                    Next <span>→</span>
                  </button>
                )}
              </div>

              <div className="mt-6 h-1 bg-[#1a1c24] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500" style={{ width: `${((currentQ + 1) / Nt.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <PremiumWithdraw 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification}
            setWithdrawals={setWithdrawals}
            setHistory={setHistory}
            setActiveTab={setActiveTab}
            currency={currency}
          />
        )}
        
        {activeTab === "notifications" && (
          <NotificationCenter notificationsList={notificationsList} setActiveTab={setActiveTab} />
        )}
        
        {activeTab === "games" && (
          <GamesTab setActiveTab={setActiveTab} />
        )}
        {activeTab === "settings" && (
          <SettingsTab soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} 
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

        {activeTab === "refer" && (
          <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-[20px] p-6 text-center">
            <h3 className="font-bold text-[20px] text-white mb-2">Refer & Earn</h3>
            <p className="text-[12px] text-white/50 mb-8">Invite friends and get ₹5 for each signup</p>
            <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl p-4 mb-6">
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
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 space-y-4">
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
              <div key={i} className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4">
                <div className="font-bold text-[13px] text-white mb-2">{faq.q}</div>
                <div className="text-[12px] text-white/50 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "terms" && (
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-[20px] p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4 text-white hover:text-white/70 cursor-pointer" onClick={() => setActiveTab("settings")}>
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Settings
            </div>
            <h3 className="font-bold text-[18px] text-white mb-4">Terms & Conditions</h3>
            <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-5 text-[12px] text-white/60 leading-relaxed max-h-[60vh] overflow-y-auto">
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

        {activeTab === "history" && (
          <UserHistory history={history} setActiveTab={setActiveTab} />
        )}
        
        {activeTab === "admin" && isAdmin && (
          <div className="space-y-4">
            <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] mb-2">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
            </button>
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl p-5 flex items-center justify-between shadow-lg shadow-purple-900/20">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <div className="font-bold text-[15px] leading-none mb-1">Admin God Mode Active</div>
                  <div className="text-[12px] opacity-80">Full system access granted</div>
                </div>
              </div>
              <button onClick={() => setIsAdmin(false)} className="bg-black/30 hover:bg-black/50 text-white text-[12px] font-bold px-4 h-9 rounded-lg transition-colors">Exit Admin</button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5">
                <h4 className="font-bold text-[10px] tracking-widest text-white/40 mb-4 uppercase">System Settings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3">
                    <span className="text-[13px] font-medium text-white/80">Balance Override</span>
                    <input value={balance} onChange={(e) => setBalance(Number(e.target.value) || 0)} type="number" className="w-20 bg-[#1a1c24] border border-white/10 rounded-lg px-2 py-1.5 text-[13px] font-bold text-white text-right outline-none focus:border-amber-500/50" />
                  </div>
                  <div className="flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-3">
                    <span className="text-[13px] font-medium text-white/80">Ban Status</span>
                    <button onClick={() => setIsBanned(!isBanned)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${isBanned ? "bg-red-500/20 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                      {isBanned ? "BANNED" : "ACTIVE"}
                    </button>
                  </div>
                  <button onClick={() => { setHistory([]); setBalance(0); }} className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl h-11 text-[13px] font-bold transition-colors mt-2">Reset All Data</button>
                </div>
              </div>
              

              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5 md:col-span-3">
                <h4 className="font-bold text-[10px] tracking-widest text-white/40 mb-4 uppercase">Advanced Game & Reward Controls</h4>
                <div className="space-y-4">
                  {/* Wheel Admin */}
                  <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[12px] text-white">Lucky Wheel Settings</div>
                      <input type="checkbox" defaultChecked className="accent-amber-500" />
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
                  <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4">
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
                  <div className="bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner rounded-xl p-4">
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
                        <button onClick={() => alert("All Settings Saved Successfully!")} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg h-[30px] text-[12px] transition-colors mt-0.5">Save Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl rounded-xl p-5 md:col-span-2">
                <AdminWithdraw withdrawals={withdrawals} setWithdrawals={setWithdrawals} setHistory={setHistory} setNotification={setNotification} setNotificationsList={setNotificationsList} />
                <AdminRevenue adminRevenue={adminRevenue} setAdminRevenue={setAdminRevenue} setNotification={setNotification} />
                <AdminHistory history={history} withdrawals={withdrawals} />
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-amber-500/30 w-full max-w-[380px] rounded-[20px] p-6 shadow-2xl shadow-purple-900/20">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-[16px]">Admin Access</span>
              </div>
              <button onClick={() => setShowAdminLogin(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <div className="text-[13px] text-white/50 mb-5 font-medium">7 consecutive clicks detected. Enter credentials to unlock the admin panel.</div>
            <div className="relative">
              <input value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Password" className="w-full h-12 bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10 rounded-xl px-4 pr-12 text-[14px] font-medium text-white outline-none focus:border-amber-500/50 transition-colors" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={handleAdminLogin} className="w-full mt-5 h-12 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">Unlock Panel</button>
          </div>
        </div>
      )}
      
      <footer className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 pb-24 text-center text-[11px] text-white/20 font-medium mt-4">
        © 2026 Premium Casino UI • Redesigned
      </footer>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
    </>
  );
}

