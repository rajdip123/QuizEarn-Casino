const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const earnedToday = history.filter((k) => k.type === "earn").reduce((k, M) => k + M.amount, 0);
  const totalWithdrawn = history.filter((k) => k.type === "withdraw").reduce((k, M) => k + M.amount, 0);

  return (
    <div className="min-h-screen w-full bg-[#080a0f] text-white overflow-x-hidden font-sans">`;

const replacement = `  const earnedToday = history.filter((k) => k.type === "earn").reduce((k, M) => k + M.amount, 0);
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
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#FBBF24', '#F59E0B', '#D97706', '#ffffff']} />}
      <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden font-sans">`;

content = content.replace(target, replacement);

content = content.replace(
  `      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}`,
  `      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
    </>
  );
}`
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
