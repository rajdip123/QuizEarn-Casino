const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('const [activeTab, setActiveTab] = useState("home");', 'const [activeTab, setActiveTab] = useState("home");\n  const currentActiveTab = forceTab || activeTab;');
// We need to replace all instances of `activeTab ===` with `currentActiveTab ===` except in setActiveTab calls
code = code.replace(/activeTab ===/g, 'currentActiveTab ===');
// We need to fix BottomNav
code = code.replace('<BottomNav activeTab={activeTab}', '<BottomNav activeTab={currentActiveTab}');

fs.writeFileSync('src/App.tsx', code);
