import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# First, import the component at the top
if 'import LivePayoutToast' not in content:
    content = content.replace("import WatchAds from './WatchAds';", "import WatchAds from './WatchAds';\nimport LivePayoutToast from './LivePayoutToast';")

# Find the old Live Payout Toast block and replace it
# Use a regex or find logic that accurately matches it
search_block = """            {/* Live Payout Toast */}
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
            )}"""

replacement_block = """            {/* Live Payout Toast */}
            <LivePayoutToast currency={currency} lang={appLanguage} />"""

if search_block in content:
    content = content.replace(search_block, replacement_block)
else:
    # Let's try with a more flexible regex if exact match fails
    regex = r"\{\/\* Live Payout Toast \*\/\}[\s\S]*?<\/button>\s*<\/div>\s*\)\}"
    content = re.sub(regex, replacement_block, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
