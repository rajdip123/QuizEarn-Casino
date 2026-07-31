import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add import for QUIZ_CATEGORIES and getQuestionsForCategory
imports_search = "import React, { useState, useEffect, useRef } from 'react';"
imports_replace = "import React, { useState, useEffect, useRef } from 'react';\nimport { QUIZ_CATEGORIES, getQuestionsForCategory } from './quizDatabase';"
content = content.replace(imports_search, imports_replace)

# 2. Update the initial state of quizCategories
categories_search = """  const [quizCategories, setQuizCategories] = useState([
    { id: 'gk', name: 'General Knowledge', lockedUntil: 0 },
    { id: 'science', name: 'Science', lockedUntil: 0 },
    { id: 'tech', name: 'Technology', lockedUntil: 0 },
    { id: 'sports', name: 'Sports', lockedUntil: 0 },
    { id: 'history', name: 'History', lockedUntil: 0 },
    { id: 'geo', name: 'Geography', lockedUntil: 0 },
    { id: 'movies', name: 'Movies', lockedUntil: 0 },
    { id: 'animals', name: 'Animals', lockedUntil: 0 },
    { id: 'space', name: 'Space', lockedUntil: 0 },
    { id: 'countries', name: 'Countries', lockedUntil: 0 },
    { id: 'business', name: 'Business', lockedUntil: 0 },
    { id: 'math', name: 'Mathematics', lockedUntil: 0 },
    { id: 'mixed', name: 'Mixed', lockedUntil: 0 }
  ]);"""
categories_replace = """  const [quizCategories, setQuizCategories] = useState(
    QUIZ_CATEGORIES.map(c => ({ ...c, lockedUntil: 0 }))
  );"""
content = content.replace(categories_search, categories_replace)

# 3. Update the generation logic inside the click handler of quiz category
generator_search = """                        // Generate 10 questions and shuffle options
                        Nt = Array.from({length: 10}).map((_, i) => {
                          const options = ["Option A", "Option B", "Option C", "Option D"].sort(() => Math.random() - 0.5);
                          return {
                            q: `[${cat.name}] Question ${i+1}: Identify the correct concept?`,
                            opts: options,
                            ans: Math.floor(Math.random() * 4),
                            reward: 10
                          };
                        }).sort(() => Math.random() - 0.5);"""
generator_replace = """                        // Fetch 10 questions from the DB (shuffled, progressive difficulty)
                        Nt = getQuestionsForCategory(cat.id, 10);"""
content = content.replace(generator_search, generator_replace)

with open('src/App.tsx', 'w') as f:
    f.write(content)
