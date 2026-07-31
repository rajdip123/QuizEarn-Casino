import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Zap, Users, Gift, Smartphone, ArrowRight, Star, CheckCircle2, Globe2, Trophy, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import App from './App';

export default function DownloadLanding({ onPreview }: { onPreview: () => void }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const screens = ['home', 'quiz_categories', 'wheel', 'wallet', 'daily_bonus', 'refer', 'history'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans relative selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent blur-[100px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-yellow-400/5 rounded-full blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+CjxwYXRoIGQ9Ik0wIDBoMXY0MEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPgo8L3N2Zz4=')] opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] border border-amber-300/30">
            <span className="text-black font-black text-2xl tracking-tighter">CQ</span>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
              Casino Quiz
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-amber-500/70 font-bold">Premium Rewards</p>
          </div>
        </div>
        <button 
          onClick={onPreview} 
          className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 px-5 py-2.5 rounded-full font-bold text-sm transition-all text-white/90"
        >
          Web Preview 
          <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-32">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 mb-32">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-amber-500/30 px-6 py-2 rounded-full mb-8 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                #1 Casino Reward Platform
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight"
            >
              Play. Learn.<br/>
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Earn Real Cash.
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 font-medium mb-10 leading-relaxed"
            >
              Join the elite circle of players. Test your knowledge, spin the premium wheel, and withdraw your winnings instantly. 
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button 
                onClick={onPreview}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-gradient-to-b from-amber-400 to-orange-600 text-white px-8 py-5 rounded-2xl font-black text-xl shadow-[0_10px_40px_rgba(245,158,11,0.3)] hover:scale-105 hover:shadow-[0_15px_50px_rgba(245,158,11,0.5)] transition-all overflow-hidden border border-amber-300/50"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 ease-in-out" />
                <Download className="w-7 h-7" />
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1">Download APK</span>
                  <span className="text-sm">Latest Version v1.0.0</span>
                </div>
              </button>
              
              <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                100% Secure & Verified
              </div>
            </motion.div>
          </div>

          {/* Right Visuals (Ambassador + Phone) */}
          <div className="flex-1 relative w-full max-w-[600px] flex justify-center items-center">
            
            {/* Ambassador Background Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="absolute right-[-10%] md:right-0 w-[120%] md:w-full h-[600px] opacity-40 md:opacity-60 mask-image-gradient"
              style={{ maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)' }}
            >
              <img 
                src="/src/assets/images/ambassador.jpg" 
                alt="Casino Ambassador"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Premium Phone Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[300px] md:w-[340px] aspect-[9/19] z-20 shrink-0"
            >
              {/* Phone Frame */}
              <div className="absolute inset-0 border-[6px] border-amber-500/30 rounded-[3rem] shadow-[0_0_50px_rgba(245,158,11,0.2),inset_0_0_20px_rgba(245,158,11,0.2)] z-30 pointer-events-none box-border" />
              <div className="absolute inset-[-1px] border-[2px] border-white/10 rounded-[3rem] z-40 pointer-events-none box-border" />
              
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-7 bg-black rounded-b-3xl w-40 mx-auto z-40 border-b border-x border-amber-500/30" />
              
              {/* Screen Container */}
              <div className="absolute inset-[6px] rounded-[2.6rem] bg-black overflow-hidden z-20 border border-white/5">
                <div className="w-full h-full relative" style={{ pointerEvents: 'none', transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                  <div className="w-[117%] h-[117%] -ml-[8.5%] bg-black">
                    <App forceTab={screens[currentScreen]} isPreview={true} />
                  </div>
                </div>
              </div>

              {/* Floating Elements (Gold Coins / Tags) */}
              <motion.div 
                animate={{ y: [-15, 15, -15] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-10 top-32 z-50 bg-black/80 backdrop-blur-xl border border-amber-500/40 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-2">
                  <span className="text-black font-black text-xl">$</span>
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Instant Pay</span>
              </motion.div>
              
              <motion.div 
                animate={{ y: [15, -15, 15] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 bottom-40 z-50 bg-black/80 backdrop-blur-xl border border-amber-500/40 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full border border-amber-500/30 flex items-center justify-center mb-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Daily Bonus</span>
              </motion.div>
            </motion.div>
            
          </div>
        </div>

        {/* Statistics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            { value: "10,000+", label: "Active Players", icon: Users },
            { value: "4.9/5.0", label: "App Rating", icon: Star },
            { value: "Instant", label: "Withdrawals", icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-amber-500/30 transition-colors">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <stat.icon className="w-8 h-8 text-amber-500 mb-4" />
              <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-white/50 font-bold uppercase tracking-widest text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-4">Premium Features</h3>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Everything you need for the ultimate gaming and earning experience.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-32">
          {[
            { icon: Globe2, label: "Global Access", desc: "Play from anywhere" },
            { icon: Zap, label: "Fast Cashout", desc: "Instant to wallet" },
            { icon: Star, label: "Daily Quizzes", desc: "Test your knowledge" },
            { icon: Gift, label: "Huge Bonuses", desc: "Claim free coins" },
            { icon: ShieldCheck, label: "100% Secure", desc: "Bank-grade security" },
            { icon: Users, label: "Referral System", desc: "Earn with friends" },
            { icon: Trophy, label: "Lucky Wheel", desc: "Spin to win big" },
            { icon: Clock, label: "24/7 Support", desc: "Always here to help" },
          ].map((feat, i) => (
            <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/5 hover:border-amber-500/30 p-6 rounded-3xl flex flex-col items-center text-center transition-all hover:transform hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-amber-500/10 border border-white/5 group-hover:border-amber-500/20 flex items-center justify-center mb-4 transition-colors">
                <feat.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="font-bold text-white mb-1">{feat.label}</h4>
              <p className="text-xs text-white/50">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-[3rem] p-8 md:p-16 mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('/src/assets/images/ambassador.jpg')] bg-cover bg-center opacity-10 mix-blend-screen mask-image-gradient" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }} />
          
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Why Choose Casino Quiz?</h3>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              We provide a seamless, high-end experience for players who demand the best. With a stunning interface, fair gameplay, and instant rewards, we've set a new standard in the industry.
            </p>
            <ul className="space-y-4 mb-10">
              {['Fair & Transparent System', 'High-Yield Reward Structure', 'Premium User Interface', 'Dedicated Account Managers'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-white font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={onPreview} className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors">
              Get Started Now <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black relative z-10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                <span className="text-black font-black text-xl">CQ</span>
              </div>
              <span className="text-2xl font-black text-white">Casino Quiz</span>
            </div>
            <p className="text-white/40 max-w-xs text-sm">
              The ultimate premium reward platform. Play, learn, and earn real cash rewards daily.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-amber-400 transition-colors">About Us</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Contact</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center border-t border-white/10 pt-8 text-white/30 text-xs">
          &copy; {new Date().getFullYear()} Casino Quiz. All rights reserved. Premium Gaming Experience.
        </div>
      </footer>
      
    </div>
  );
}
