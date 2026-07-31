const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import PremiumWithdraw')) {
  content = content.replace(
    "import {",
    "import PremiumWithdraw from './PremiumWithdraw';\nimport AdminWithdraw from './AdminWithdraw';\nimport AdminRevenue from './AdminRevenue';\nimport UserHistory from './UserHistory';\nimport NotificationCenter from './NotificationCenter';\nimport AdminHistory from './AdminHistory';\nimport { checkFraud, simulateFraudDetection, clearFraudDetection } from './AntiCheat';\nimport {"
  );
}

if (!content.includes('const [notificationsList')) {
  content = content.replace(
    'const [notification, setNotification] = useState("");',
    'const [notification, setNotification] = useState("");\n  const [notificationsList, setNotificationsList] = useState([]);\n  const [adminRevenue, setAdminRevenue] = useState(0);'
  );
}

if (!content.includes('useEffect(() => { const fraud')) {
  content = content.replace(
    'const [balance, setBalance] = useState(0);',
    'const [balance, setBalance] = useState(0);\n  React.useEffect(() => { const fraud = checkFraud(); if(fraud.isBlocked) { setNotification(fraud.reason); } }, []);'
  );
}

content = content.replace(
  '<button className="w-9 h-9 rounded-full bg-[#1a1c24] flex items-center justify-center relative hover:bg-white/10 transition-colors">',
  '<button onClick={() => setActiveTab("notifications")} className="w-9 h-9 rounded-full bg-[#1a1c24] flex items-center justify-center relative hover:bg-white/10 transition-colors">'
);

const walletTabStart = content.indexOf('{activeTab === "wallet" && (');
if (walletTabStart !== -1) {
  const parts = content.substring(walletTabStart).split('{activeTab === "games" && (');
  if (parts.length > 1) {
    const replacePart = parts[0];
    content = content.replace(replacePart, `{activeTab === "wallet" && (
          <PremiumWithdraw 
            balance={balance} 
            setBalance={setBalance} 
            setNotification={setNotification}
            setWithdrawals={setWithdrawals}
            setHistory={setHistory}
            setActiveTab={setActiveTab}
            currency={currency}
          />
        )}
        
        {activeTab === "notifications" && (
          <NotificationCenter notificationsList={notificationsList} setActiveTab={setActiveTab} />
        )}
        
        `);
  }
}

const historyTabStart = content.indexOf('{activeTab === "history" && (');
if (historyTabStart !== -1) {
  const parts = content.substring(historyTabStart).split('{activeTab === "admin" && isAdmin && (');
  if (parts.length > 1) {
    content = content.replace(parts[0], `{activeTab === "history" && (
          <UserHistory history={history} setActiveTab={setActiveTab} />
        )}
        
        `);
  }
}

if (content.includes('Pending Withdrawals')) {
  content = content.replace(
    /<h4 className="font-bold text-\[10px\] tracking-widest text-white\/40 mb-4 uppercase">Pending Withdrawals<\/h4>[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\)\})/m,
    `<AdminWithdraw withdrawals={withdrawals} setWithdrawals={setWithdrawals} setHistory={setHistory} setNotification={setNotification} setNotificationsList={setNotificationsList} />
                <AdminRevenue adminRevenue={adminRevenue} setAdminRevenue={setAdminRevenue} setNotification={setNotification} />
                <AdminHistory history={history} withdrawals={withdrawals} />
              </div>`
  );
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
