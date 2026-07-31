export const checkFraud = () => {
  const detections = [];
  
  if (localStorage.getItem('isBanned') === 'true') {
    return { isBlocked: true, reason: 'Account banned for policy violation.' };
  }

  // 1. Multiple Accounts check
  const accountId = localStorage.getItem('device_id');
  if (!accountId) {
    localStorage.setItem('device_id', `DEV_${Math.random().toString(36).substring(2)}`);
  } else if (localStorage.getItem('multi_account_flag') === 'true') {
    detections.push("Multiple Accounts Detected (Device Clone)");
  }
  
  // 2. VPN Abuse 
  if (localStorage.getItem('vpn_flag') === 'true') {
    detections.push("VPN/Proxy Abuse Detected");
  }

  // 3. Console/HTML Tampering (mock check)
  if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
    // DevTools might be open, but we won't strictly block unless flagged
    // detections.push("Console Tampering Detected");
  }

  // 4. API Tampering
  if (localStorage.getItem('api_tamper_flag') === 'true') {
    detections.push("API Tampering Detected");
  }

  if (detections.length > 0) {
    return { isBlocked: true, reason: detections.join(' | ') };
  }
  
  return { isBlocked: false, reason: null };
};

export const simulateFraudDetection = (type: 'vpn' | 'multi' | 'api' = 'multi') => {
  if (type === 'vpn') localStorage.setItem('vpn_flag', 'true');
  else if (type === 'api') localStorage.setItem('api_tamper_flag', 'true');
  else localStorage.setItem('multi_account_flag', 'true');
};

export const clearFraudDetection = () => {
  localStorage.removeItem('multi_account_flag');
  localStorage.removeItem('vpn_flag');
  localStorage.removeItem('api_tamper_flag');
  localStorage.removeItem('isBanned');
};
