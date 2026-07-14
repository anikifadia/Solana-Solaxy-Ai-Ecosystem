import React from 'react';
import { motion } from 'motion/react';

export const SolaxyLogo = ({ className = "w-8 h-8", withGlow = true }: { className?: string, withGlow?: boolean }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 rounded-full bg-g/20 blur-md animate-pulse" />
      )}
      <motion.svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#galaxyGrad)" strokeWidth="2" strokeDasharray="20 10 5 10" opacity="0.6"/>
        <defs>
          <linearGradient id="galaxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00eeff" />
          </linearGradient>
        </defs>
      </motion.svg>
      
      <motion.svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#galaxyGrad)" strokeWidth="1" strokeDasharray="10 20" opacity="0.8"/>
      </motion.svg>

      {/* Center AI / Star element */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-3/5 h-3/5 z-10 text-white"
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="url(#galaxyGrad)" />
        <circle cx="50" cy="50" r="10" fill="#000208" />
        <circle cx="50" cy="50" r="4" fill="#00ff88" />
      </motion.svg>
    </div>
  );
};

export const SolaxyEmoticon = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="roboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00eeff" />
          </linearGradient>
        </defs>
        {/* Head */}
        <rect x="15" y="25" width="70" height="55" rx="20" fill="#000208" stroke="url(#roboGrad)" strokeWidth="3" />
        
        {/* Ears/Antennas */}
        <path d="M5 50 L15 50" stroke="#00ff88" strokeWidth="4" strokeLinecap="round" />
        <path d="M85 50 L95 50" stroke="#00eeff" strokeWidth="4" strokeLinecap="round" />
        
        {/* Top Antenna */}
        <path d="M50 25 L50 10" stroke="#00ff88" strokeWidth="3" strokeLinecap="round" />
        <motion.circle 
          cx="50" cy="10" r="4" fill="#00eeff" 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Eyes (Animated blink) */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        >
          <rect x="30" y="45" width="12" height="6" rx="3" fill="#00ff88" />
          <rect x="58" y="45" width="12" height="6" rx="3" fill="#00eeff" />
        </motion.g>

        {/* Mouth */}
        <path d="M 40 65 Q 50 70 60 65" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
};
