export const quizCategories = [
  "General Knowledge", "Science", "Technology", "Sports", "History",
  "Geography", "Movies", "Animals", "Space", "Countries",
  "Business", "Mathematics", "Mixed"
];

export const generateQuestions = (category: string) => {
  // Generate 10 dummy questions per category
  return Array.from({ length: 10 }).map((_, i) => ({
    q: `[${category}] Sample Question ${i + 1}?`,
    opts: ["Option A", "Option B", "Option C", "Option D"],
    ans: Math.floor(Math.random() * 4),
    reward: 10
  }));
};
