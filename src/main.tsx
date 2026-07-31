import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import LandingWrapper from './LandingWrapper.tsx';
import './index.css';
const monetag = document.createElement("script");
monetag.dataset.zone = "11467019";
monetag.src = "https://n6wxm.com/vignette.min.js";
document.body.appendChild(monetag);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingWrapper />
  </StrictMode>,
);

