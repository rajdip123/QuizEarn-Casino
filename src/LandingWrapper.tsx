import React, { useState } from 'react';
import App from './App';
import DownloadLanding from './DownloadLanding';

export default function LandingWrapper() {
  const [showApp, setShowApp] = useState(false);
  
  if (showApp) {
    return <App />;
  }
  
  return <DownloadLanding onPreview={() => setShowApp(true)} />;
}
