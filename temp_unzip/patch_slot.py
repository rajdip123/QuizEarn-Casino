import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

slot_search = """                setTimeout(() => {
                  setNotification("😢 No match! Try again.");
                }, 1000);"""

slot_replace = """                setTimeout(() => {
                  const isWin = Math.random() < 0.3; // 30% win chance
                  if (isWin) {
                    setBalance(b => b + 500); // 50x of 10
                    setNotification("🎰 BIG WIN! You won ₹500 (50x multiplier)!");
                  } else {
                    setNotification("😢 No match! Try again.");
                  }
                }, 1000);"""

content = content.replace(slot_search, slot_replace)

with open('src/App.tsx', 'w') as f:
    f.write(content)
