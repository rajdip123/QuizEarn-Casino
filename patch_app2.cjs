const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/mainTabs\.includes\(activeTab\)/g, 'mainTabs.includes(currentActiveTab)');
code = code.replace(/mainTabs\.indexOf\(activeTab\)/g, 'mainTabs.indexOf(currentActiveTab)');
code = code.replace(/activeTab !== "quiz"/g, 'currentActiveTab !== "quiz"');
code = code.replace(/\[currentQ, activeTab, isAnswered\]/g, '[currentQ, currentActiveTab, isAnswered]');

fs.writeFileSync('src/App.tsx', code);
