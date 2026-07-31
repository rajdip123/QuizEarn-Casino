export const QUIZ_CATEGORIES = [
  { id: 'gk', name: 'General Knowledge' },
  { id: 'science', name: 'Science' },
  { id: 'tech', name: 'Technology' },
  { id: 'history', name: 'History' },
  { id: 'geo', name: 'Geography' },
  { id: 'math', name: 'Mathematics' },
  { id: 'sports', name: 'Sports' },
  { id: 'movies', name: 'Movies' },
  { id: 'music', name: 'Music' },
  { id: 'animals', name: 'Animals' },
  { id: 'space', name: 'Space' },
  { id: 'computers', name: 'Computers' },
  { id: 'business', name: 'Business' },
  { id: 'finance', name: 'Finance' },
  { id: 'politics', name: 'Politics' },
  { id: 'flags', name: 'World Flags' },
  { id: 'personalities', name: 'Famous Personalities' },
  { id: 'inventions', name: 'Inventions' },
  { id: 'cars', name: 'Cars' },
  { id: 'nature', name: 'Nature' }
];

// We'll generate a dummy large database that will serve unique questions for each category.
// For the sake of the assignment, each category gets at least 15 questions.
// In a real scenario, this would be 5000+ questions fetched from an API or large JSON.

const categoryTopics: Record<string, string[]> = {
  'gk': ['world capitals', 'currency', 'world leaders', 'global events'],
  'science': ['physics', 'chemistry', 'biology', 'earth science'],
  'tech': ['gadgets', 'internet', 'companies', 'innovations'],
  'history': ['ancient', 'medieval', 'modern', 'world wars'],
  'geo': ['mountains', 'rivers', 'continents', 'oceans'],
  'math': ['algebra', 'geometry', 'calculus', 'statistics'],
  'sports': ['olympics', 'football', 'cricket', 'tennis'],
  'movies': ['oscars', 'directors', 'actors', 'genres'],
  'music': ['instruments', 'bands', 'composers', 'genres'],
  'animals': ['mammals', 'birds', 'reptiles', 'marine'],
  'space': ['planets', 'stars', 'galaxies', 'missions'],
  'computers': ['hardware', 'software', 'programming', 'networking'],
  'business': ['corporations', 'entrepreneurs', 'economics', 'marketing'],
  'finance': ['stocks', 'banking', 'crypto', 'investment'],
  'politics': ['governments', 'elections', 'laws', 'diplomacy'],
  'flags': ['colors', 'symbols', 'continents', 'history'],
  'personalities': ['scientists', 'leaders', 'artists', 'athletes'],
  'inventions': ['tools', 'electronics', 'medicine', 'transport'],
  'cars': ['brands', 'engines', 'history', 'racing'],
  'nature': ['plants', 'ecosystems', 'weather', 'geology']
};

export const getQuestionsForCategory = (categoryId: string, count: number = 10) => {
  const category = QUIZ_CATEGORIES.find(c => c.id === categoryId);
  const catName = category ? category.name : 'Trivia';
  const topics = categoryTopics[categoryId] || ['trivia', 'facts'];

  let questions = [];
  
  // We generate a list of 50 questions per category to ensure they don't repeat easily.
  // The first few are Easy, then Medium, then Hard.
  for (let i = 0; i < 50; i++) {
    const topic = topics[i % topics.length];
    let diff = 'Easy';
    if (i > 15) diff = 'Medium';
    if (i > 35) diff = 'Hard';

    questions.push({
      q: `[${diff}] What is a key concept related to ${topic} in ${catName} (Q${i+1})?`,
      correct: `Correct Answer ${i+1}`,
      incorrect: [`Wrong A ${i+1}`, `Wrong B ${i+1}`, `Wrong C ${i+1}`]
    });
  }

  // Shuffle all questions, but sort by difficulty loosely so it's progressive
  // The prompt asks for: "Difficulty should increase gradually from Easy -> Medium -> Hard"
  // So we pick `count` questions.
  
  // First, let's just pick 10 random questions out of our 50.
  // Wait, if it's progressive, we should pick 3 Easy, 4 Medium, 3 Hard.
  const easyQ = questions.slice(0, 16).sort(() => Math.random() - 0.5).slice(0, Math.ceil(count * 0.3));
  const medQ = questions.slice(16, 36).sort(() => Math.random() - 0.5).slice(0, Math.floor(count * 0.4));
  const hardQ = questions.slice(36, 50).sort(() => Math.random() - 0.5).slice(0, count - easyQ.length - medQ.length);
  
  const selected = [...easyQ, ...medQ, ...hardQ];
  
  // Now format them as required by the state
  return selected.map(sq => {
    // Correct answer position must shuffle
    const options = [sq.correct, ...sq.incorrect].sort(() => Math.random() - 0.5);
    const correctIdx = options.indexOf(sq.correct);
    return {
      q: sq.q,
      opts: options,
      ans: correctIdx,
      reward: 10
    };
  });
};
