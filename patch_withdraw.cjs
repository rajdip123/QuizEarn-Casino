const fs = require('fs');
let content = fs.readFileSync('src/PremiumWithdraw.tsx', 'utf8');

// Get Currency symbol
content = content.replace(
  "import { ChevronRight, Landmark, Wallet, CheckCircle2 } from 'lucide-react';",
  "import { ChevronRight, Landmark, Wallet, CheckCircle2 } from 'lucide-react';\nimport { t } from './i18n';"
);

// Props
content = content.replace(
  'currency\n}: any) {',
  'currency,\n  lang\n}: any) {'
);

const getCurrencySymbol = `  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };`;

content = content.replace('const [method, setMethod] =', getCurrencySymbol + '\n  const [method, setMethod] =');

// Update labels
content = content.replace(
  'Withdraw Funds',
  "{t(lang, 'Withdraw Funds')}"
);

content = content.replace(
  'Payment Method',
  "{t(lang, 'Payment Method')}"
);

content = content.replace(
  'Account Number / Wallet Address',
  "{t(lang, 'Account Number / Wallet Address')}"
);

content = content.replace(
  'Receiver Name',
  "{t(lang, 'Receiver Name')}"
);

content = content.replace(
  'Notes (Optional)',
  "{t(lang, 'Notes (Optional)')}"
);

// We need to dynamically list methods based on currency
// INR -> UPI, Bank Transfer, Paytm
// BDT -> bKash, Nagad, Rocket, Bank
// USDT -> TRC20, BEP20, ERC20

const methodsLogic = `  const getMethods = () => {
    if (currency === 'BDT') return ['bKash', 'Nagad', 'Rocket', 'Bank Transfer'];
    if (currency === 'USDT') return ['TRC20', 'BEP20', 'ERC20'];
    return ['UPI', 'Bank Transfer', 'Paytm'];
  };
  const currentMethods = getMethods();
  
  // ensure method is valid for currency
  React.useEffect(() => {
    if (!currentMethods.includes(method)) {
      setMethod(currentMethods[0]);
    }
  }, [currency]);
`;

content = content.replace('const [amount, setAmount] =', methodsLogic + '\n  const [amount, setAmount] =');
content = content.replace(/\{method === 'UPI' \? 'bg-blue-600 border-blue-500' : 'bg-\[\#11141d\] border-white\/5'\}/g, "{method === m ? 'bg-blue-600 border-blue-500' : 'bg-[#11141d] border-white/5'}");

const methodRender = `<div className="grid grid-cols-2 gap-3 mb-6">
        {currentMethods.map(m => (
          <button 
            key={m}
            onClick={() => setMethod(m)}
            className={\`p-4 rounded-xl border flex items-center gap-3 transition-colors \${method === m ? 'bg-blue-600 border-blue-500' : 'bg-[#11141d] border-white/5 hover:bg-white/5'}\`}
          >
            <Wallet className={\`w-5 h-5 \${method === m ? 'text-white' : 'text-blue-500'}\`} />
            <span className="font-semibold text-[14px]">{m}</span>
          </button>
        ))}
      </div>`;

content = content.replace(
  /<div className="grid grid-cols-2 gap-3 mb-6">[\s\S]*?<\/div>/,
  methodRender
);

content = content.replace(
  /₹/g,
  '{getCurrencySymbol()}'
);
content = content.replace(
  /'₹'/g,
  'getCurrencySymbol()'
);

fs.writeFileSync('src/PremiumWithdraw.tsx', content, 'utf8');
