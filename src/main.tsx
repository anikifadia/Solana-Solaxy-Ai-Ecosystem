import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './LanguageContext.tsx';
import { WalletProvider } from './WalletContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </LanguageProvider>
  </StrictMode>,
);

