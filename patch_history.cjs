const fs = require('fs');
let content = fs.readFileSync('src/UserHistory.tsx', 'utf8');

// Props
content = content.replace(
  'currency\n}: any) {',
  'currency,\n  lang\n}: any) {'
);

content = content.replace(
  "import { ChevronRight, ArrowDownRight, ArrowUpRight, Search, Filter } from 'lucide-react';",
  "import { ChevronRight, ArrowDownRight, ArrowUpRight, Search, Filter } from 'lucide-react';\nimport { t } from './i18n';"
);

const getCurrencySymbol = `  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };`;

content = content.replace('const [searchTerm, setSearchTerm] =', getCurrencySymbol + '\n  const [searchTerm, setSearchTerm] =');

content = content.replace(/₹/g, '{getCurrencySymbol()}');

content = content.replace('Transaction History', "{t(lang, 'Transaction History')}");
content = content.replace('All Records', "{t(lang, 'All Records')}");
content = content.replace('Search records...', "{t(lang, 'Search records...')}");

fs.writeFileSync('src/UserHistory.tsx', content, 'utf8');
