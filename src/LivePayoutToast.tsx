import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Clock, ShieldCheck, X } from 'lucide-react';
import { t } from './i18n';

const FIRST_NAMES = ["Rahul", "Priya", "Aman", "Sneha", "Vikram", "Ankit", "Rohan", "Neha", "Arjun", "Pooja", "Karthik", "Divya", "Sanjay", "Kavya", "Suresh", "Riya", "Amit", "Meera", "Raj", "Aditi", "John", "Sarah", "Michael", "Emma", "David", "Jessica", "Daniel", "Emily", "Matthew", "Ashley", "Ali", "Fatima", "Omar", "Aisha", "Ahmed", "Zainab", "Mohammed", "Maryam", "Hassan", "Khadija"];
const LAST_NAMES = ["Sharma", "Patel", "Singh", "Kumar", "Das", "Gupta", "Verma", "Reddy", "Nair", "Yadav", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Khan", "Ali", "Ahmed", "Syed", "Rahman", "Hussain", "Mahmoud", "Ibrahim", "Abbas", "Hassan"];
const AVATAR_COLORS = [
  "from-red-500 to-orange-500",
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-yellow-500 to-amber-500",
  "from-cyan-500 to-blue-500",
  "from-fuchsia-500 to-purple-500"
];
const COUNTRY_CONFIGS = [
  { country: "🇮🇳 IN", currency: "INR", symbol: "₹", methods: ["UPI", "Paytm", "Bank Transfer"], rate: 1 },
  { country: "🇧🇩 BD", currency: "BDT", symbol: "৳", methods: ["bKash", "Nagad", "Rocket", "Bank Transfer"], rate: 1.4 },
  { country: "🌐 Crypto", currency: "USDT", symbol: "$", methods: ["TRC20", "BEP20", "ERC20"], rate: 0.012 }
];
const AMOUNTS = [40, 50, 80, 100, 120, 150, 180, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1500, 1800, 2000, 2500, 3000, 5000, 7500, 10000];
const TIMES = ["just now", "5 sec ago", "10 sec ago", "15 sec ago", "30 sec ago", "1 min ago", "2 mins ago", "3 mins ago", "5 mins ago", "10 mins ago", "15 mins ago"];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomUser = () => {
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const username = `@${firstName.toLowerCase()}${Math.floor(Math.random() * 9999)}`;
  const color = getRandomElement(AVATAR_COLORS);
  const idNumber = `CQ${Math.floor(100000 + Math.random() * 900000)}`;
  
  const config = getRandomElement(COUNTRY_CONFIGS);
  const country = config.country;
  const paymentMethod = getRandomElement(config.methods);
  
  const baseAmount = Number(getRandomElement(AMOUNTS));
  let amountStr = "";
  if (config.rate < 1) {
    amountStr = (baseAmount * config.rate).toFixed(2);
    if (amountStr.endsWith('.00')) amountStr = amountStr.slice(0, -3);
  } else {
    amountStr = Math.round(baseAmount * config.rate).toString();
  }
  
  const formattedAmount = `${config.symbol}${amountStr}`;
  const time = getRandomElement(TIMES);

  return { fullName, username, color, idNumber, country, paymentMethod, formattedAmount, time };
};

let lastUserStr = "";

export default function LivePayoutToast({ currency, lang }: { currency: string, lang: string }) {
  const [isVisible, setIsVisible] = useState(true);
  
  const getUniqueRandomUser = useCallback(() => {
    let newUser;
    let attempts = 0;
    do {
      newUser = generateRandomUser();
      attempts++;
    } while (newUser.fullName === lastUserStr && attempts < 10);
    lastUserStr = newUser.fullName;
    return newUser;
  }, []);

  const [user, setUser] = useState(() => getUniqueRandomUser());
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    // Periodically update user
    let timer: NodeJS.Timeout;
    const scheduleNext = () => {
      const intervalTime = 4000 + Math.random() * 3000;
      timer = setTimeout(() => {
        setUser(getUniqueRandomUser());
        setKey(k => k + 1);
        scheduleNext();
      }, intervalTime);
    };
    
    scheduleNext();
    return () => clearTimeout(timer);
  }, [isVisible, getUniqueRandomUser]);

  if (!isVisible) return null;

  return (
    <div key={key} className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-3 flex items-start gap-3 relative animate-[fade-in_0.5s_ease-out] shadow-[0_0_20px_rgba(16,185,129,0.05)] mb-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center shrink-0 border border-white/10 shadow-inner overflow-hidden relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <span className="relative z-10 text-white font-bold text-[18px]">{user.fullName.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-1.5 text-[13px] mb-0.5">
          <span className="font-bold text-white truncate">{user.fullName}</span>
          <span className="text-white/40 text-[11px] font-medium truncate">{user.username}</span>
          <span className="text-[10px] text-white/50 bg-white/5 px-1.5 py-0.5 rounded">{user.country}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-yellow-500 text-[10px] font-mono bg-yellow-500/10 px-1.5 py-0.5 rounded ml-auto">({user.idNumber})</span>
        </div>
        <div className="text-[13px] text-white/80 mb-1.5 truncate">
          {t(lang, 'Withdrew')} <span className="font-bold text-emerald-400">{user.formattedAmount}</span> {t(lang, 'via')} {user.paymentMethod}
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {user.time}</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold"><ShieldCheck className="w-3 h-3" /> {t(lang, 'Verified Payout')}</span>
          </div>
        </div>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-white/30 hover:text-white/70 absolute top-3 right-3 p-1 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
