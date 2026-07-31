const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure t is imported
if (!content.includes("import { t } from './i18n';")) {
  content = content.replace("import './index.css';", "import './index.css';\nimport { t } from './i18n';");
}

const getCurrencySymbol = `
  const getCurrencySymbol = () => {
    if (currency === 'USDT') return '$';
    if (currency === 'BDT') return '৳';
    return '₹';
  };
`;

if (!content.includes('getCurrencySymbol')) {
  content = content.replace('const [balance, setBalance] =', getCurrencySymbol + '\n  const [balance, setBalance] =');
}

// Replace all hardcoded ₹ with getCurrencySymbol()
content = content.replace(/₹/g, '{getCurrencySymbol()}');

// Replace {currency === 'USDT' ? '$' : currency === 'BDT' ? '৳' : '₹'}
content = content.replace(/\{currency === 'USDT' \? '\$' : currency === 'BDT' \? '৳' : '₹'\}/g, '{getCurrencySymbol()}');
content = content.replace(/currency === 'USDT' \? '\$' : currency === 'BDT' \? '৳' : '₹'/g, 'getCurrencySymbol()');

// Also fix `withdrawals.reduce...`
content = content.replace(/\{getCurrencySymbol\(\)\}\{balance.toFixed\(2\)\}/g, '{getCurrencySymbol()}{balance.toFixed(2)}');

// Fix navigation and tab references
const comps = [
  '<PremiumWithdraw \n            balance={balance}',
  '<UserHistory \n            history={history}',
  '<SettingsTab \n            appLanguage={appLanguage}',
  '<AdminWithdraw',
  '<AdminHistory'
];

comps.forEach(c => {
  content = content.replace(c, c + '\n            lang={appLanguage}');
});

// Update standard strings
content = content.replace('Available Balance', '{t(appLanguage, "Available Balance")}');
content = content.replace("Today's Earnings", '{t(appLanguage, "Today\'s Earnings")}');
content = content.replace('Total Lifetime Earnings', '{t(appLanguage, "Total Lifetime Earnings")}');
content = content.replace('Withdrawal Threshold Goal', '{t(appLanguage, "Withdrawal Threshold Goal")}');
content = content.replace('Wallet Dashboard', '{t(appLanguage, "Wallet Dashboard")}');
content = content.replace('Withdraw Funds', '{t(appLanguage, "Withdraw Funds")}');
content = content.replace('PLAY & EARN REWARDS', '{t(appLanguage, "PLAY & EARN REWARDS")}');
content = content.replace('RECENT ACTIVITY', '{t(appLanguage, "RECENT ACTIVITY")}');
content = content.replace('View All', '{t(appLanguage, "View All")}');

// Update menu names
content = content.replace(/>Home</g, '>{t(appLanguage, "Home")}<');
content = content.replace(/>Games</g, '>{t(appLanguage, "Games")}<');
content = content.replace(/>Wallet</g, '>{t(appLanguage, "Wallet")}<');
content = content.replace(/>Settings</g, '>{t(appLanguage, "Settings")}<');
content = content.replace(/>Admin</g, '>{t(appLanguage, "Admin")}<');
content = content.replace(/>Back</g, '>{t(appLanguage, "Back")}<');
content = content.replace(/>Save</g, '>{t(appLanguage, "Save")}<');
content = content.replace(/>Unlock Panel</g, '>{t(appLanguage, "Unlock Panel")}<');

// Game Cards title
content = content.replace(/"Casino Quiz"/g, 't(appLanguage, "Casino Quiz")');
content = content.replace(/"Lucky Wheel"/g, 't(appLanguage, "Lucky Wheel")');
content = content.replace(/"Royal Slots"/g, 't(appLanguage, "Royal Slots")');
content = content.replace(/"Daily Bonus"/g, 't(appLanguage, "Daily Bonus")');
content = content.replace(/"Watch Ads"/g, 't(appLanguage, "Watch Ads")');

// Replace standard alerts and text 
content = content.replace(/Wrong password! Access denied/g, 't(appLanguage, "Wrong password! Access denied")');

fs.writeFileSync('src/App.tsx', content, 'utf8');
