import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

wheel_search = """                  const win = Math.random() > 0.6 ? 10 : 0;
                  if (win > 0) {
                     setBalance(b => b + win);
                     setNotification(`🎉 You won ₹${win}!`);
                  } else {
                     setNotification(`😢 Better luck next time!`);
                  }"""

wheel_replace = """                  const rewards = [0.10, 0.50, 2, 5, 10, 20, 50, 100, 0, 0, 0];
                  const win = rewards[Math.floor(Math.random() * rewards.length)];
                  if (win > 0) {
                     setBalance(b => b + win);
                     setNotification(win === 100 ? `🎰 JACKPOT! You won ₹100!` : `🎉 You won ₹${win}!`);
                  } else {
                     setNotification(`😢 Try Again! Better luck next time!`);
                  }"""

content = content.replace(wheel_search, wheel_replace)

with open('src/App.tsx', 'w') as f:
    f.write(content)
