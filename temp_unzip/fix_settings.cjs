const fs = require('fs');
let content = fs.readFileSync('src/SettingsTab.tsx', 'utf8');

// Fix imports
content = content.replace(
  "import { User, Image, Download, Mail, LogOut, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';",
  "import { User, Image, Download, Mail, LogOut, ChevronRight, CheckCircle2, ShieldCheck, Volume2, VolumeX } from 'lucide-react';"
);

// Fix signature
content = content.replace(
  "  currency, setCurrency,\n  setActiveTab\n}: any) {",
  "  currency, setCurrency,\n  setActiveTab,\n  soundEnabled, setSoundEnabled\n}: any) {"
);

fs.writeFileSync('src/SettingsTab.tsx', content, 'utf8');
