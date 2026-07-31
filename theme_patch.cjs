const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/purple-600/g, 'amber-600');
  content = content.replace(/purple-500/g, 'amber-500');
  content = content.replace(/purple-400/g, 'amber-400');
  content = content.replace(/indigo-600/g, 'yellow-600');
  content = content.replace(/indigo-500/g, 'yellow-500');
  
  content = content.replace(/#11141d/g, '#0a0a0a');
  content = content.replace(/#0a0c12/g, '#050505');
  
  // Apply glassmorphism by adding backdrop-blur, etc to main containers
  // Find bg-[#0a0a0a] border border-white/5 and add backdrop-blur
  content = content.replace(/bg-\[#0a0a0a\] border border-white\/5/g, 'bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/10 shadow-2xl');
  content = content.replace(/bg-\[#050505\] border border-white\/5/g, 'bg-[#050505]/80 backdrop-blur-md border border-yellow-500/5 shadow-inner');
  content = content.replace(/bg-\[#050505\] border border-white\/10/g, 'bg-[#050505]/80 backdrop-blur-md border border-yellow-500/10');
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
