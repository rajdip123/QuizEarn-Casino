const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('export default function App() {');
if (startIndex === -1) process.exit(1);

let braceCount = 0;
let started = false;
let endIndex = -1;

for (let i = startIndex; i < content.length; i++) {
  if (content[i] === '{') {
    braceCount++;
    started = true;
  } else if (content[i] === '}') {
    braceCount--;
  }
  
  if (started && braceCount === 0) {
    endIndex = i;
    break;
  }
}

if (endIndex !== -1) {
  const cleanContent = content.substring(0, endIndex + 1);
  fs.writeFileSync('src/App.clean.tsx', cleanContent, 'utf8');
  console.log("Successfully extracted clean App.tsx, length:", cleanContent.length, "lines:", cleanContent.split('\n').length);
} else {
  console.log("Could not find matching brace.");
}
