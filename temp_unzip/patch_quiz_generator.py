import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

generator_search = """                        // Generate 10 questions
                        Nt = Array.from({length: 10}).map((_, i) => ({
                          q: `[${cat.name}] Question ${i+1}: What is ...?`,
                          opts: ["Option A", "Option B", "Option C", "Option D"],
                          ans: Math.floor(Math.random() * 4),
                          reward: 10
                        }));"""

generator_replace = """                        // Generate 10 questions and shuffle options
                        Nt = Array.from({length: 10}).map((_, i) => {
                          const options = ["Option A", "Option B", "Option C", "Option D"].sort(() => Math.random() - 0.5);
                          return {
                            q: `[${cat.name}] Question ${i+1}: Identify the correct concept?`,
                            opts: options,
                            ans: Math.floor(Math.random() * 4),
                            reward: 10
                          };
                        }).sort(() => Math.random() - 0.5);"""

content = content.replace(generator_search, generator_replace)

with open('src/App.tsx', 'w') as f:
    f.write(content)
