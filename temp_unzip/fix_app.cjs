const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `const triggerWin = (amount) => {
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
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#FBBF24', '#F59E0B', '#D97706', '#ffffff']} />}) => {`,
  `return () => {`
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
