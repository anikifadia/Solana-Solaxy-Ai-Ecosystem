import React from 'react';
import { 
  Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, 
  Cat, Globe, Rocket, Trophy, Heart, Crown 
} from 'lucide-react';

const IconMap: { [key: string]: React.ComponentType<any> } = {
  Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, 
  Cat, Globe, Rocket, Trophy, Heart, Crown
};

interface TokenHDIconProps {
  ticker?: string;
  iconType?: string;
  colorGradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean;
  customSvg?: string;
}

export default function TokenHDIcon({
  ticker = '$SLX',
  iconType = 'Coins',
  colorGradient = 'from-g to-cyan',
  size = 'md',
  className = '',
  animate = true,
  customSvg,
}: TokenHDIconProps) {
  const IconComponent = IconMap[iconType] || Coins;
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
    '2xl': 'w-32 h-32 text-3xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  // Determine shadow color from gradient class name
  let glowColor = 'rgba(0, 255, 136, 0.4)';
  if (colorGradient.includes('cyan')) {
    glowColor = 'rgba(0, 238, 255, 0.4)';
  } else if (colorGradient.includes('r') || colorGradient.includes('pink') || colorGradient.includes('red')) {
    glowColor = 'rgba(255, 26, 74, 0.4)';
  } else if (colorGradient.includes('yellow') || colorGradient.includes('amber')) {
    glowColor = 'rgba(251, 191, 36, 0.4)';
  } else if (colorGradient.includes('purple') || colorGradient.includes('fuchsia')) {
    glowColor = 'rgba(168, 85, 247, 0.4)';
  }

  // Coin initials
  const initial = ticker.replace('$', '').substring(0, 2).toUpperCase() || 'S';

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center select-none ${sizeClasses[size]} ${className} group`}
      style={{
        boxShadow: `0 0 20px ${glowColor}, inset 0 0 10px rgba(255,255,255,0.1)`,
      }}
    >
      {/* 1. Outer Neon Swirling Orbit Orbiters */}
      {animate && (
        <>
          <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[spin_4s_linear_infinite] pointer-events-none opacity-40" />
          <div className={`absolute -inset-[2px] rounded-full bg-gradient-to-br ${colorGradient} opacity-30 blur-[2px] animate-pulse pointer-events-none`} />
        </>
      )}

      {/* 2. Outer Embossed Metal Coin Ring Rim */}
      <div className={`absolute inset-0 rounded-full border border-white/20 bg-gradient-to-br from-[#10192e] to-[#040811] p-[2px] flex items-center justify-center`}>
        {/* Inner metal shadow ring */}
        <div className={`absolute inset-[2px] rounded-full border-2 border-double border-white/10 bg-gradient-to-br from-[#121c32] via-[#040a18] to-[#01050e] flex items-center justify-center overflow-hidden`}>
          
          {/* Diagonal Metallic Sheen Glare */}
          <div 
            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-12 transition-transform duration-1000 group-hover:translate-x-[20%] group-hover:translate-y-[20%] pointer-events-none"
            style={{ transform: 'rotate(25deg)' }}
          />

          {/* Holographic Radial Background Grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4px_4px] opacity-40" />

          {/* Concentric Golden/Cyan embossed frame */}
          <div className={`absolute inset-[3px] rounded-full border border-dashed border-white/10 flex items-center justify-center`}>
            
            {/* 3. The actual core glowing Icon with gradient overlay */}
            <div className={`relative z-10 flex flex-col items-center justify-center text-center text-white`}>
              {customSvg ? (
                <div 
                  className={`flex items-center justify-center ${iconSizes[size]} select-none pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block`}
                  style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
                  dangerouslySetInnerHTML={{ __html: customSvg }}
                />
              ) : (
                <div className={`bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent flex items-center justify-center`}>
                  <IconComponent className={`${iconSizes[size]} drop-shadow-[0_0_8px_${glowColor}]`} />
                </div>
              )}
              
              {/* Embossed Symbol text identifier at the bottom in micro font */}
              {size !== 'sm' && (
                <span className="absolute bottom-[-11px] font-mono font-bold text-[7px] text-white/50 group-hover:text-white transition-colors uppercase tracking-[0.5px]">
                  {initial}
                </span>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 4. Tiny HD Floating Crystals around the coin */}
      {animate && size !== 'sm' && (
        <>
          <span 
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${colorGradient} blur-[0.5px] animate-ping`}
            style={{
              top: '10%',
              left: '80%',
              animationDuration: '3.5s',
            }}
          />
          <span 
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${colorGradient} blur-[0.5px] animate-ping`}
            style={{
              bottom: '15%',
              left: '5%',
              animationDuration: '2.8s',
            }}
          />
        </>
      )}
    </div>
  );
}
