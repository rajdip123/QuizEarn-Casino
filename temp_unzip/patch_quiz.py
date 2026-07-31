import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Replace the const Nt with export let Nt or just use activeQuestions
# Actually, the user says "Never repeat completed questions", "Each category locked for 24 hours".
# Let's add QuizCategoriesTab.tsx and use it to populate activeQuestions.

content = content.replace('const Nt = [', 'let Nt = [')

# 2. Add Quiz Categories Tab
quiz_categories_tab = """        {activeTab === "quiz_categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[18px] text-white">Quiz Categories</h3>
              <button onClick={() => setShowAllCategories(!showAllCategories)} className="text-[12px] text-purple-400 hover:text-purple-300 font-bold">
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
                        // Generate 10 questions
                        Nt = Array.from({length: 10}).map((_, i) => ({
                          q: `[${cat.name}] Question ${i+1}: What is ...?`,
                          opts: ["Option A", "Option B", "Option C", "Option D"],
                          ans: Math.floor(Math.random() * 4),
                          reward: 10
                        }));
                        setCurrentQ(0);
                        setScore(0);
                        setStreak(0);
                        setActiveTab('quiz');
                      }
                    }}
                    className={`bg-[#11141d] border ${isLocked ? 'border-red-500/20 opacity-70' : 'border-white/5 hover:border-yellow-500/30'} rounded-xl p-4 cursor-pointer relative group transition-colors`}
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
        )}"""

content = content.replace('{activeTab === "quiz" && (', quiz_categories_tab + '\n        {activeTab === "quiz" && (')

# 3. Add handleFinishCategory logic
# When currentQ reaches the end and the user clicks Next, we should lock the category.
handle_next_search = """  const handleNext = () => {
    if (currentQ >= Nt.length - 1) {
      setCurrentQ(0);
    } else {
      setCurrentQ((k) => k + 1);
    }"""
handle_next_replace = """  const handleNext = () => {
    if (currentQ >= Nt.length - 1) {
      if (activeCategory) {
        setQuizCategories(cats => cats.map(c => c.id === activeCategory ? { ...c, lockedUntil: Date.now() + 24 * 60 * 60 * 1000 } : c));
        setActiveTab("quiz_categories");
        setNotification(`🎉 Completed ${quizCategories.find(c => c.id === activeCategory)?.name}! Locked for 24h.`);
      }
      setCurrentQ(0);
    } else {
      setCurrentQ((k) => k + 1);
    }"""
content = content.replace(handle_next_search, handle_next_replace)

# 4. Make "games" tab work
content = content.replace('import SettingsTab from', 'import GamesTab from "./GamesTab";\nimport SettingsTab from')

games_tab = """        {activeTab === "games" && (
          <GamesTab setActiveTab={setActiveTab} />
        )}"""

content = content.replace('{activeTab === "settings" && (', games_tab + '\n        {activeTab === "settings" && (')

with open('src/App.tsx', 'w') as f:
    f.write(content)
